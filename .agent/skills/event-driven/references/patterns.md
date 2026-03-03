# Event-Driven Patterns

> Event Sourcing, CQRS, Saga, choreography vs orchestration.

---

## Event Sourcing

### Concept

Instead of storing current state, store **all events** that led to current state.

```
Traditional:  user.balance = 150
Event Sourced:
  1. AccountCreated { balance: 0 }
  2. MoneyDeposited { amount: 200 }
  3. MoneyWithdrawn { amount: 50 }
  → Computed state: balance = 150
```

### Implementation

```typescript
// Event Store
interface EventStore {
  append(streamId: string, events: DomainEvent[]): Promise<void>;
  read(streamId: string, fromVersion?: number): Promise<DomainEvent[]>;
}

// Aggregate (rebuild state from events)
class BankAccount {
  private balance = 0;
  private version = 0;

  static fromEvents(events: DomainEvent[]): BankAccount {
    const account = new BankAccount();
    for (const event of events) {
      account.apply(event);
    }
    return account;
  }

  private apply(event: DomainEvent) {
    switch (event.type) {
      case 'account.created':
        this.balance = 0;
        break;
      case 'money.deposited':
        this.balance += event.data.amount;
        break;
      case 'money.withdrawn':
        this.balance -= event.data.amount;
        break;
    }
    this.version++;
  }

  withdraw(amount: number): DomainEvent[] {
    if (this.balance < amount) throw new InsufficientFundsError();
    return [{ type: 'money.withdrawn', data: { amount }, ... }];
  }
}
```

### When to Use

| ✅ Good Fit | ❌ Bad Fit |
|------------|-----------|
| Financial systems (audit trail) | Simple CRUD apps |
| Compliance requirements | Low-complexity domains |
| Need to replay / debug | High-write, low-read |
| Complex business rules | Prototype / MVP |

---

## CQRS (Command Query Responsibility Segregation)

### Concept

```
┌──────────────┐       ┌──────────────┐
│   Commands   │       │   Queries    │
│  (writes)    │       │  (reads)     │
└──────┬───────┘       └──────┬───────┘
       │                      │
  ┌────▼────┐           ┌────▼────┐
  │  Write  │ ──events──▶│  Read   │
  │  Model  │           │  Model  │
  └────┬────┘           └────┬────┘
       │                      │
  ┌────▼────┐           ┌────▼────┐
  │  Write  │           │  Read   │
  │   DB    │           │   DB    │
  └─────────┘           └─────────┘
```

### Implementation

```typescript
// Write side (command handler)
class CreateOrderHandler {
  async execute(cmd: CreateOrderCommand) {
    const order = Order.create(cmd);
    await this.writeDb.save(order);

    // Publish event for read side
    await this.eventBus.publish({
      type: 'order.created',
      data: order.toDTO(),
    });
  }
}

// Read side (event handler / projector)
class OrderProjector {
  async onOrderCreated(event: DomainEvent<OrderCreated>) {
    // Update denormalized read model
    await this.readDb.query(`
      INSERT INTO order_summaries (id, customer_name, total, status, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [event.data.orderId, event.data.customerName, event.data.total, 'pending', event.timestamp]);
  }
}
```

### When to Use

| ✅ Good Fit | ❌ Bad Fit |
|------------|-----------|
| Read/write at different scales | Simple domains |
| Complex read queries | Strong consistency required |
| Different read/write models | Small team / early stage |
| Need materialized views | Prototype / MVP |

---

## Saga Pattern

### Choreography (Event-Based)

```
Order Service → publishes OrderCreated
    ↓
Payment Service → listens → processes payment → publishes PaymentCompleted
    ↓
Inventory Service → listens → reserves stock → publishes StockReserved
    ↓
Shipping Service → listens → creates shipment → publishes ShipmentCreated

Compensation (on failure):
Payment fails → publishes PaymentFailed
    → Order Service listens → cancels order
    → Inventory Service listens → releases stock
```

### Orchestration (Central Coordinator)

```typescript
class OrderSaga {
  async execute(orderId: string) {
    try {
      // Step 1: Reserve payment
      await this.paymentService.reserve(orderId);

      // Step 2: Reserve inventory
      await this.inventoryService.reserve(orderId);

      // Step 3: Confirm payment
      await this.paymentService.confirm(orderId);

      // Step 4: Ship
      await this.shippingService.createShipment(orderId);

    } catch (error) {
      // Compensate in reverse order
      await this.compensate(orderId, error.failedStep);
    }
  }

  private async compensate(orderId: string, failedStep: number) {
    if (failedStep > 2) await this.paymentService.refund(orderId);
    if (failedStep > 1) await this.inventoryService.release(orderId);
    await this.orderService.cancel(orderId);
  }
}
```

### Choreography vs Orchestration

| Aspect | Choreography | Orchestration |
|--------|-------------|---------------|
| Coupling | Loose | Central point |
| Visibility | Distributed (hard to trace) | Central (easy to trace) |
| Complexity | Simple sagas | Complex multi-step |
| Failure handling | Each service compensates | Orchestrator handles |
| Best for | ≤ 3 steps | > 3 steps |

---

⚡ PikaKit v3.9.72
