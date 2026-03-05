/**
 * SePay Webhook Signature Verification
 * Version: 2.0.0
 *
 * SePay sends webhook with:
 *   x-sepay-signature header — HMAC-SHA256 of raw body, hex-encoded, may have sha256= prefix
 *
 * Usage:
 *   Import:  import { verifySepayWebhook, sepayWebhookMiddleware } from './sepay-webhook-verify.js'
 *   CLI:     node sepay-webhook-verify.js --test
 */

import crypto from 'node:crypto'

const VERSION = '2.0.0'

/**
 * Verify SePay webhook signature
 * @param {string} payload - Raw request body as string
 * @param {string} signature - x-sepay-signature header value
 * @param {string} secret - SEPAY_WEBHOOK_SECRET
 * @returns {{ valid: boolean, error?: string }}
 */
export function verifySepayWebhook(payload, signature, secret) {
    if (!signature) {
        return { valid: false, error: 'Missing x-sepay-signature header' }
    }

    if (!secret) {
        return { valid: false, error: 'Missing SEPAY_WEBHOOK_SECRET' }
    }

    const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex')

    // Strip sha256= prefix if present
    const sigToCompare = signature.replace('sha256=', '')

    try {
        const isValid = crypto.timingSafeEqual(
            Buffer.from(sigToCompare, 'hex'),
            Buffer.from(expectedSig, 'hex')
        )
        return isValid ? { valid: true } : { valid: false, error: 'Signature mismatch' }
    } catch (err) {
        return { valid: false, error: `Signature comparison failed: ${err.message}` }
    }
}

/**
 * Express middleware for SePay webhook verification
 * @param {string} secret - SEPAY_WEBHOOK_SECRET
 *
 * Usage:
 *   app.post('/webhooks/sepay',
 *     express.raw({ type: 'application/json' }),
 *     sepayWebhookMiddleware(process.env.SEPAY_WEBHOOK_SECRET),
 *     (req, res) => { ... }
 *   )
 */
export function sepayWebhookMiddleware(secret) {
    return (req, res, next) => {
        const signature = req.headers['x-sepay-signature']
        const payload = req.body.toString()

        const result = verifySepayWebhook(payload, signature, secret)
        if (!result.valid) {
            console.error(`SePay webhook verification failed: ${result.error}`)
            return res.status(401).json({ error: 'Invalid signature' })
        }

        try {
            req.sepayEvent = JSON.parse(payload)
        } catch (err) {
            return res.status(400).json({ error: 'Invalid JSON payload' })
        }

        next()
    }
}

/**
 * Hono middleware for SePay webhook verification
 * @param {string} secret - SEPAY_WEBHOOK_SECRET
 */
export function sepayWebhookMiddlewareHono(secret) {
    return async (c, next) => {
        const payload = await c.req.text()
        const signature = c.req.header('x-sepay-signature')

        const result = verifySepayWebhook(payload, signature, secret)
        if (!result.valid) {
            console.error(`SePay webhook verification failed: ${result.error}`)
            return c.json({ error: 'Invalid signature' }, 401)
        }

        try {
            c.set('sepayEvent', JSON.parse(payload))
        } catch {
            return c.json({ error: 'Invalid JSON payload' }, 400)
        }

        await next()
    }
}

// --- CLI Test Mode ---
if (process.argv[2] === '--test') {
    console.log(`\nSePay Webhook Verify v${VERSION} — Test Mode\n`)

    const testSecret = 'test-secret-key'
    const testBody = JSON.stringify({
        gateway: 'VietinBank',
        transactionDate: '2025-01-15',
        accountNumber: '123456789',
        transferAmount: 500000,
        content: 'DH001 thanh toan',
        transferType: 'in',
    })

    // Generate valid signature
    const validSig = 'sha256=' + crypto.createHmac('sha256', testSecret).update(testBody, 'utf8').digest('hex')

    // Test 1: Valid signature
    const r1 = verifySepayWebhook(testBody, validSig, testSecret)
    console.log(`✅ Valid signature:   ${r1.valid ? 'PASS' : 'FAIL'} ${r1.error || ''}`)

    // Test 2: Valid signature without prefix
    const noPrefixSig = crypto.createHmac('sha256', testSecret).update(testBody, 'utf8').digest('hex')
    const r2 = verifySepayWebhook(testBody, noPrefixSig, testSecret)
    console.log(`✅ No sha256= prefix: ${r2.valid ? 'PASS' : 'FAIL'} ${r2.error || ''}`)

    // Test 3: Invalid signature
    const r3 = verifySepayWebhook(testBody, 'sha256=invalid', testSecret)
    console.log(`✅ Invalid signature: ${!r3.valid ? 'PASS' : 'FAIL'} (expected reject)`)

    // Test 4: Missing signature
    const r4 = verifySepayWebhook(testBody, undefined, testSecret)
    console.log(`✅ Missing signature: ${!r4.valid ? 'PASS' : 'FAIL'} (expected reject)`)

    console.log('\nAll tests complete.\n')
}
