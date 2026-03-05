---
name: pubsub-realtime
description: Real-time patterns — WebSocket (Socket.io), SSE, Redis Pub/Sub, Redis Streams consumer groups
---

# Pub/Sub & Real-Time Patterns

> Redis Pub/Sub, WebSocket, Server-Sent Events for real-time features.

---

## Pattern Selection

| Pattern | Direction | Reconnect | Best For |
|---------|-----------|-----------|----------|
| **WebSocket** | Bidirectional | Manual | Chat, gaming, collaboration |
| **SSE** | Server → Client | Auto | Notifications, live feeds |
| **Redis Pub/Sub** | Server ↔ Server | Auto | Inter-service events |
| **Long Polling** | Client → Server | Per request | Legacy compatibility |

---

## WebSocket (Socket.io)

### Server

```typescript
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const io = new Server(httpServer, {
  cors: { origin: 'https://example.com' },
  adapter: createAdapter(pubClient, subClient),  // Multi-server scaling
});

// Authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = await verifyToken(token);
    socket.data.user = user;
    next();
  } catch (e) {
    next(new Error('Unauthorized'));
  }
});

// Room-based messaging
io.on('connection', (socket) => {
  const userId = socket.data.user.id;

  // Join user's personal room
  socket.join(`user:${userId}`);

  // Join organization room
  socket.join(`org:${socket.data.user.orgId}`);

  // Handle events
  socket.on('message', async (data) => {
    // Broadcast to room
    io.to(`channel:${data.channelId}`).emit('message', {
      ...data,
      userId,
      timestamp: Date.now(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`);
  });
});

// Server-side emit (from API route)
function notifyUser(userId: string, event: string, data: unknown) {
  io.to(`user:${userId}`).emit(event, data);
}
```

### Client

```typescript
import { io } from 'socket.io-client';

const socket = io('https://api.example.com', {
  auth: { token: accessToken },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
});

socket.on('connect', () => console.log('Connected'));
socket.on('message', (data) => handleMessage(data));
socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
```

---

## Server-Sent Events (SSE)

### Server

```typescript
// Express
app.get('/api/events', (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',  // Disable nginx buffering
  });

  // Send periodic heartbeat
  const heartbeat = setInterval(() => {
    res.write(':heartbeat\n\n');
  }, 30000);

  // Send events
  function sendEvent(event: string, data: unknown) {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  // Subscribe to updates
  const unsubscribe = eventBus.on('notification', (data) => {
    if (data.userId === req.user.id) {
      sendEvent('notification', data);
    }
  });

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
  });
});
```

### Client

```typescript
const eventSource = new EventSource('/api/events', {
  // With auth (use fetch-event-source for headers)
});

eventSource.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data);
  showNotification(data);
});

eventSource.onerror = () => {
  // Auto-reconnects by default
  console.log('SSE connection error, will retry...');
};
```

---

## Redis Pub/Sub (Inter-Service)

```typescript
import { createClient } from 'redis';

// Publisher (Service A)
const publisher = createClient();
await publisher.connect();

await publisher.publish('user-events', JSON.stringify({
  type: 'user.updated',
  data: { userId: '123', changes: { name: 'New Name' } },
}));

// Subscriber (Service B)
const subscriber = createClient();
await subscriber.connect();

await subscriber.subscribe('user-events', (message) => {
  const event = JSON.parse(message);
  handleUserEvent(event);
});

// Pattern subscribe (wildcard)
await subscriber.pSubscribe('order.*', (message, channel) => {
  console.log(`Received on ${channel}:`, message);
});
```

### Redis Pub/Sub Limitations

| Limitation | Workaround |
|------------|------------|
| No persistence | Use Redis Streams instead |
| No ack mechanism | Combine with BullMQ |
| Missed if subscriber offline | Use Redis Streams |

---

## Redis Streams (Persistent Pub/Sub)

```typescript
// Producer
await redis.xAdd('notifications', '*', {
  type: 'order.shipped',
  data: JSON.stringify({ orderId: '123' }),
});

// Consumer Group
await redis.xGroupCreate('notifications', 'email-service', '0', { MKSTREAM: true });

// Consumer
const messages = await redis.xReadGroup(
  'email-service',    // Group
  'worker-1',         // Consumer name
  { key: 'notifications', id: '>' },
  { COUNT: 10, BLOCK: 5000 },
);

for (const message of messages) {
  await processMessage(message);
  await redis.xAck('notifications', 'email-service', message.id);
}
```

---

⚡ PikaKit v3.9.76

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [message-queues.md](message-queues.md) | Persistent queues (Kafka, RabbitMQ) |
| [patterns.md](patterns.md) | Event Sourcing, CQRS for event-driven |
| [webhooks.md](webhooks.md) | External event delivery |
| [../SKILL.md](../SKILL.md) | Sync vs async decision tree |
