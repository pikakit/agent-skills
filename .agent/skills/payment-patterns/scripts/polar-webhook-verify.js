/**
 * Polar Webhook Signature Verification (StandardWebhooks)
 * Version: 2.0.0
 *
 * Polar uses StandardWebhooks format with 3 headers:
 *   webhook-id        — unique event ID
 *   webhook-timestamp  — Unix timestamp (seconds)
 *   webhook-signature  — base64 HMAC-SHA256
 *
 * Signed content: `${webhook-id}.${webhook-timestamp}.${body}`
 * Secret: base64-encoded, may have `whsec_` prefix
 *
 * Usage:
 *   Import:  import { verifyPolarWebhook, polarWebhookMiddleware } from './polar-webhook-verify.js'
 *   CLI:     node polar-webhook-verify.js --test
 */

import crypto from 'node:crypto'

const VERSION = '2.0.0'
const TIMESTAMP_TOLERANCE_SEC = 300 // 5 minutes replay protection

/**
 * Verify Polar webhook signature (StandardWebhooks format)
 * @param {string} body - Raw request body as string
 * @param {Object} headers - Request headers object
 * @param {string} headers.webhook-id - Unique event ID
 * @param {string} headers.webhook-timestamp - Unix timestamp
 * @param {string} headers.webhook-signature - Signature (v1,base64)
 * @param {string} secret - POLAR_WEBHOOK_SECRET (may have whsec_ prefix)
 * @returns {{ valid: boolean, error?: string }}
 */
export function verifyPolarWebhook(body, headers, secret) {
    const webhookId = headers['webhook-id']
    const timestamp = headers['webhook-timestamp']
    const signature = headers['webhook-signature']

    if (!webhookId || !timestamp || !signature) {
        return { valid: false, error: 'Missing required webhook headers (webhook-id, webhook-timestamp, webhook-signature)' }
    }

    if (!secret) {
        return { valid: false, error: 'Missing POLAR_WEBHOOK_SECRET' }
    }

    // Replay protection — reject events older than 5 minutes
    const now = Math.floor(Date.now() / 1000)
    const ts = parseInt(timestamp, 10)
    if (isNaN(ts) || Math.abs(now - ts) > TIMESTAMP_TOLERANCE_SEC) {
        return { valid: false, error: `Timestamp outside ${TIMESTAMP_TOLERANCE_SEC}s tolerance (replay protection)` }
    }

    // Decode secret — strip whsec_ prefix if present
    const secretRaw = secret.startsWith('whsec_') ? secret.slice(6) : secret
    const secretBytes = Buffer.from(secretRaw, 'base64')

    // Construct signed content
    const signedContent = `${webhookId}.${timestamp}.${body}`

    // Compute expected signature
    const expected = crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64')

    // Signature header may contain multiple signatures: "v1,<base64> v1,<base64>"
    const signatures = signature.split(' ')
    const isValid = signatures.some(sig => {
        const sigValue = sig.startsWith('v1,') ? sig.slice(3) : sig
        try {
            return crypto.timingSafeEqual(
                Buffer.from(expected),
                Buffer.from(sigValue)
            )
        } catch {
            return false
        }
    })

    if (!isValid) {
        return { valid: false, error: 'Signature mismatch' }
    }

    return { valid: true }
}

/**
 * Express middleware for Polar webhook verification
 * @param {string} secret - POLAR_WEBHOOK_SECRET
 *
 * Usage:
 *   app.post('/webhooks/polar',
 *     express.raw({ type: 'application/json' }),
 *     polarWebhookMiddleware(process.env.POLAR_WEBHOOK_SECRET),
 *     (req, res) => { ... }
 *   )
 */
export function polarWebhookMiddleware(secret) {
    return (req, res, next) => {
        const body = req.body.toString()

        const result = verifyPolarWebhook(body, req.headers, secret)
        if (!result.valid) {
            console.error(`Polar webhook verification failed: ${result.error}`)
            return res.status(403).json({ error: 'Webhook verification failed' })
        }

        try {
            req.polarEvent = JSON.parse(body)
        } catch (err) {
            return res.status(400).json({ error: 'Invalid JSON payload' })
        }

        next()
    }
}

/**
 * Hono middleware for Polar webhook verification
 * @param {string} secret - POLAR_WEBHOOK_SECRET
 *
 * Usage:
 *   app.post('/webhooks/polar', polarWebhookMiddlewareHono(secret), async (c) => { ... })
 */
export function polarWebhookMiddlewareHono(secret) {
    return async (c, next) => {
        const body = await c.req.text()

        const result = verifyPolarWebhook(body, Object.fromEntries(c.req.raw.headers), secret)
        if (!result.valid) {
            console.error(`Polar webhook verification failed: ${result.error}`)
            return c.json({ error: 'Webhook verification failed' }, 403)
        }

        try {
            c.set('polarEvent', JSON.parse(body))
        } catch {
            return c.json({ error: 'Invalid JSON payload' }, 400)
        }

        await next()
    }
}

// --- CLI Test Mode ---
if (process.argv[2] === '--test') {
    console.log(`\nPolar Webhook Verify v${VERSION} — Test Mode\n`)

    const testSecret = 'whsec_' + Buffer.from('test-secret-key-32-bytes-long!!!').toString('base64')
    const testBody = JSON.stringify({ type: 'subscription.created', data: { id: 'sub_123' } })
    const testId = 'msg_test123'
    const testTimestamp = String(Math.floor(Date.now() / 1000))

    // Generate valid signature
    const secretBytes = Buffer.from('test-secret-key-32-bytes-long!!!', 'utf8')
    const signedContent = `${testId}.${testTimestamp}.${testBody}`
    const validSig = 'v1,' + crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64')

    // Test 1: Valid signature
    const r1 = verifyPolarWebhook(testBody, {
        'webhook-id': testId,
        'webhook-timestamp': testTimestamp,
        'webhook-signature': validSig,
    }, testSecret)
    console.log(`✅ Valid signature:   ${r1.valid ? 'PASS' : 'FAIL'} ${r1.error || ''}`)

    // Test 2: Invalid signature
    const r2 = verifyPolarWebhook(testBody, {
        'webhook-id': testId,
        'webhook-timestamp': testTimestamp,
        'webhook-signature': 'v1,invalidsignature==',
    }, testSecret)
    console.log(`✅ Invalid signature: ${!r2.valid ? 'PASS' : 'FAIL'} (expected reject)`)

    // Test 3: Expired timestamp
    const r3 = verifyPolarWebhook(testBody, {
        'webhook-id': testId,
        'webhook-timestamp': String(Math.floor(Date.now() / 1000) - 600), // 10 min ago
        'webhook-signature': validSig,
    }, testSecret)
    console.log(`✅ Expired timestamp: ${!r3.valid ? 'PASS' : 'FAIL'} (expected reject)`)

    // Test 4: Missing headers
    const r4 = verifyPolarWebhook(testBody, {}, testSecret)
    console.log(`✅ Missing headers:   ${!r4.valid ? 'PASS' : 'FAIL'} (expected reject)`)

    console.log('\nAll tests complete.\n')
}
