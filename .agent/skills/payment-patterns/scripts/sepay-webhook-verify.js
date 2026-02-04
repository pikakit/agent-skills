/**
 * SePay Webhook Signature Verification
 * 
 * Usage: Import and use in your webhook handler
 */

const crypto = require('crypto');

/**
 * Verify SePay webhook signature
 * @param {string} payload - Raw request body as string
 * @param {string} signature - x-sepay-signature header value
 * @param {string} secret - SEPAY_WEBHOOK_SECRET
 * @returns {boolean}
 */
function verifySepayWebhook(payload, signature, secret) {
    if (!signature || !secret) {
        console.error('Missing signature or secret');
        return false;
    }

    const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex');

    const sigToCompare = signature.replace('sha256=', '');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(sigToCompare, 'hex'),
            Buffer.from(expectedSig, 'hex')
        );
    } catch (err) {
        console.error('Signature comparison failed:', err.message);
        return false;
    }
}

/**
 * Express middleware for SePay webhook verification
 */
function sepayWebhookMiddleware(secret) {
    return (req, res, next) => {
        const signature = req.headers['x-sepay-signature'];
        const payload = req.body.toString();

        if (!verifySepayWebhook(payload, signature, secret)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        req.sepayEvent = JSON.parse(payload);
        next();
    };
}

module.exports = {
    verifySepayWebhook,
    sepayWebhookMiddleware,
};
