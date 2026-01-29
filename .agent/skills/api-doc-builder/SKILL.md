---
name: api-doc-builder
description: >-
  Swagger/OpenAPI generation, interactive API docs, Postman collections, GraphQL schema documentation.
  Triggers on: API docs, Swagger, OpenAPI, Postman.
  Coordinates with: doc-generator, api-architect.
allowed-tools: Read, Write, Glob
metadata:
  category: "documentation"
  success_metrics: "OpenAPI spec generated, interactive docs deployed"
  coordinates_with: "doc-generator, api-architect"
---

# API Documentation Builder

> Auto-generate Swagger/OpenAPI docs and Postman collections

## 🎯 Purpose

Generate comprehensive API documentation including Swagger/OpenAPI specs, interactive UI, and Postman collections from code annotations.

---

## 1. Swagger/OpenAPI Setup

### Install Dependencies

```bash
npm install swagger-jsdoc swagger-ui-express
```

### Configuration

```typescript
// lib/docs/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      { url: "http://localhost:3000/api", description: "Development" },
      { url: "https://api.example.com", description: "Production" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
```

---

## 2. API Route Documentation

### Swagger Annotations

```typescript
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Not found
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  return Response.json(user);
}
```

---

## 3. Interactive UI

### Mount Swagger UI

```typescript
// app/api-docs/route.ts
import { swaggerSpec } from "@/lib/docs/swagger";
import swaggerUi from "swagger-ui-express";

export function GET() {
  return swaggerUi.setup(swaggerSpec);
}
```

**Access:** `http://localhost:3000/api-docs`

---

## 4. Postman Collection Export

### Generate Collection

```typescript
import { swaggerSpec } from "./swagger";

function convertToPostman(spec: any) {
  return {
    info: {
      name: spec.info.title,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: Object.entries(spec.paths).map(([path, methods]: any) => ({
      name: path,
      request: {
        method: Object.keys(methods)[0].toUpperCase(),
        url: `{{baseUrl}}${path}`,
        header: [{ key: "Authorization", value: "Bearer {{token}}" }],
      },
    })),
  };
}

// Export to postman-collection.json
fs.writeFileSync("postman-collection.json", JSON.stringify(convertToPostman(swaggerSpec), null, 2));
```

---

## 5. GraphQL Documentation

### Schema Export

```bash
npm install graphql-markdown
```

```typescript
import { printSchema } from "graphql";
import fs from "fs";

const schemaString = printSchema(schema);
fs.writeFileSync("docs/schema.graphql", schemaString);
```

---

> **Key Takeaway:** Auto-generated API docs stay current and reduce support tickets.
