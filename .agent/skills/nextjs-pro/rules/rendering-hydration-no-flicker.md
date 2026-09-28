---
"title": "Prevent Hydration Mismatch Without Flickering"
"kind": "code"
"impact": "standard"
"tags":
  - "rendering"
  - "ssr"
  - "hydration"
  - "localStorage"
  - "flicker"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs/messages/react-hydration-error"
    "title": "Next.js hydration error guidance"
  - "url": "https://nextjs.org/docs/app/guides/content-security-policy"
    "title": "Next.js Content Security Policy guide"
---

# Prevent Hydration Mismatch Without Flickering

## Prevent Hydration Mismatch Without Flickering

Render preference-dependent markup from request data when possible. When a preference exists only in browser storage, use a reviewed pre-hydration bootstrap that complies with the application's Content Security Policy (CSP). Never use this presentation technique for authentication or authorization state.

## Incorrect
```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem('theme') || 'light'
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

Server-side rendering will fail because `localStorage` is undefined.

## Incorrect
```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // Runs after hydration - causes visible flash
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])
  
  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

Component first renders with default value (`light`), then updates after hydration, causing a visible flash of incorrect content.

## Correct
```tsx
// app/layout.tsx
import { cookies } from 'next/headers'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const storedTheme = (await cookies()).get('theme')?.value
  const theme = storedTheme === 'dark' ? 'dark' : 'light'

  return (
    <html data-theme={theme}>
      <body>{children}</body>
    </html>
  )
}
```

The server and first client render now agree because both receive the same theme value. Update the cookie when the user changes theme so the next request remains consistent.

If the preference must remain in `localStorage`, place a small audited script in `public/theme-init.js`, load it from the root layout with `next/script` and `strategy="beforeInteractive"`, and limit `suppressHydrationWarning` to the single element whose attribute the script changes. Prefer an external same-origin script under a `script-src 'self'` policy; when the application uses nonce-based CSP, pass the request nonce through the documented Next.js CSP integration. Do not add `unsafe-inline` for this feature.

## Verification

Run the repository typecheck and a production browser test with JavaScript enabled, disabled, and storage unavailable. Verify the initial DOM has the intended theme, hydration emits no warning, and the production CSP reports no violation.
