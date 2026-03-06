---
name: message-queues
description: Kafka vs RabbitMQ vs SQS vs BullMQ — selection guide, producer/consumer patterns, idempotency
---

# Message Queue Selection

> Kafka vs RabbitMQ vs SQS — decision guide and patterns.

---

## Selection Guide

```
What type of messaging do you need?
├── High-throughput event streaming (100K+ msg/sec)
│   └── Apache Kafka
├── Complex routing, task queues, RPC
│   └── RabbitMQ
├── Simple cloud queue, serverless
│   └── AWS SQS / Google Cloud Pub/Sub
├── Redis-based, lightweight
│   └── BullMQ (Redis)
└── Simple in-process
    └── EventEmitter / Node events
```

---

## Comparison

| Feature | Kafka | RabbitMQ | SQS | BullMQ |
|---------|-------|----------|-----|--------|
| Throughput | ★★★★★ | ★★★ | ★★★ | ★★★ |
| Ordering | ✅ Per partition | ❌ | ✅ FIFO | ✅ |
| Persistence | ✅ Configurable | ✅ | ✅ | ✅ Redis |
| Consumer groups | ✅ | ❌ | ❌ | ❌ |
| Dead letter | ✅ | ✅ | ✅ | ✅ |
| Replay | ✅ | ❌ | ❌ | ❌ |
| Setup complexity | High | Medium | Low | Low |
| Best for | Event streaming | Task routing | Serverless | Node.js apps |

---

## Kafka Patterns

### Producer

```typescript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

async function publishEvent(topic: string, event: DomainEvent) {
  await producer.send({
    topic,
    messages: [{
      key: event.data.entityId,  // Partition key for ordering
      value: JSON.stringify(event),
      headers: {
        'event-type': event.type,
        'correlation-id': event.metadata.correlationId,
      },
    }],
  });
}
```

### Consumer

```typescript
const consumer = kafka.consumer({ groupId: 'payment-service' });

await consumer.subscribe({ topic: 'orders', fromBeginning: false });

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const event = JSON.parse(message.value.toString());

    // Idempotency check
    const processed = await redis.get(`processed:${event.id}`);
    if (processed) return; // Already handled

    try {
      await handleEvent(event);
      await redis.setex(`processed:${event.id}`, 86400 * 7, '1');
    } catch (error) {
      // Send to dead letter topic
      await producer.send({
        topic: `${topic}.dlq`,
        messages: [message],
      });
    }
  },
});
```

---

## RabbitMQ Patterns

### Setup with amqplib

```typescript
import amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

// Declare exchange and queue
await channel.assertExchange('events', 'topic', { durable: true });
await channel.assertQueue('payment-processor', {
  durable: true,
  deadLetterExchange: 'events.dlx',
});
await channel.bindQueue('payment-processor', 'events', 'order.*');
```

### Publisher

```typescript
function publish(routingKey: string, event: DomainEvent) {
  channel.publish(
    'events',
    routingKey,
    Buffer.from(JSON.stringify(event)),
    {
      persistent: true,            // Survive broker restart
      messageId: event.id,         // Deduplication
      timestamp: Date.now(),
      headers: { 'x-retry-count': 0 },
    }
  );
}

publish('order.created', orderEvent);
```

### Consumer

```typescript
channel.prefetch(10); // Process 10 at a time

channel.consume('payment-processor', async (msg) => {
  if (!msg) return;

  try {
    const event = JSON.parse(msg.content.toString());
    await processPayment(event);
    channel.ack(msg);             // Acknowledge success
  } catch (error) {
    const retries = (msg.properties.headers['x-retry-count'] || 0) + 1;

    if (retries >= 3) {
      channel.reject(msg, false); // Send to DLQ
    } else {
      // Retry with delay
      channel.reject(msg, false);
      setTimeout(() => {
        channel.publish('events', msg.fields.routingKey, msg.content, {
          ...msg.properties,
          headers: { ...msg.properties.headers, 'x-retry-count': retries },
        });
      }, Math.pow(2, retries) * 1000);
    }
  }
});
```

---

## BullMQ (Node.js / Redis)

```typescript
import { Queue, Worker } from 'bullmq';

// Producer
const emailQueue = new Queue('emails', {
  connection: { host: 'localhost', port: 6379 },
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

await emailQueue.add('welcome', { userId: '123', template: 'welcome' });

// Consumer
const worker = new Worker('emails', async (job) => {
  await sendEmail(job.data.userId, job.data.template);
}, {
  connection: { host: 'localhost', port: 6379 },
  concurrency: 5,
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});
```

---

## Idempotency Pattern

```typescript
async function processIdempotent(event: DomainEvent) {
  const idempotencyKey = `idempotent:${event.id}`;

  // Use Redis SETNX for atomic check-and-set
  const isNew = await redis.set(idempotencyKey, 'processing', 'EX', 86400, 'NX');

  if (!isNew) {
    console.log(`Event ${event.id} already processed, skipping`);
    return;
  }

  try {
    await processEvent(event);
    await redis.set(idempotencyKey, 'completed', 'EX', 86400);
  } catch (error) {
    await redis.del(idempotencyKey); // Allow retry
    throw error;
  }
}
```

---

⚡ PikaKit v3.9.86

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [patterns.md](patterns.md) | Event Sourcing, CQRS, Saga patterns |
| [pubsub.md](pubsub.md) | Real-time Pub/Sub and WebSocket |
| [webhooks.md](webhooks.md) | External webhook delivery |
| [../SKILL.md](../SKILL.md) | Queue selection quick reference |
