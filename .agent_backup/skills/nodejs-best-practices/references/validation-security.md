# Validation & Security

## Validate at Boundaries

```
Where to validate:
├── API entry point (request body/params)
├── Before database operations
├── External data (API responses, file uploads)
└── Environment variables (startup)
```

## Validation Library Selection

| Library | Best For |
|---------|----------|
| **Zod** | TypeScript first, inference |
| **Valibot** | Smaller bundle (tree-shakeable) |
| **ArkType** | Performance critical |
| **Yup** | Existing React Form usage |

## Security Checklist

- [ ] **Input validation**: All inputs validated
- [ ] **Parameterized queries**: No SQL string concatenation
- [ ] **Password hashing**: bcrypt or argon2
- [ ] **JWT verification**: Verify signature and expiry
- [ ] **Rate limiting**: Protect from abuse
- [ ] **Security headers**: Helmet.js or equivalent
- [ ] **HTTPS**: Everywhere in production
- [ ] **CORS**: Properly configured
- [ ] **Secrets**: Environment variables only
- [ ] **Dependencies**: Regularly audited

## Security Mindset

```
Trust nothing:
├── Query params → validate
├── Request body → validate
├── Headers → verify
├── Cookies → validate
├── File uploads → scan
└── External APIs → validate response
```
