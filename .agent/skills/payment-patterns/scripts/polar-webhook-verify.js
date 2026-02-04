/**
 * Polar Webhook Signature Verification
 * 
 * Usage: Import and use in your webhook handler
 */

const crypto = require('crypto');

/**
 * Verify Polar webhook signature
 * @param {string} payload - Raw request body as string
 * @param {string} signature - polar-signature header value
 * @param {string} secret - POLAR_WEBHOOK_SECRET
 * @returns {boolean}
 */
function verifyPolarWebhook(payload, signature, secret) {
    if (!signature || !secret) {
        console.error('Missing signature or secret');
        return false;
    }

    const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expectedSig, 'hex')
        );
    } catch (err) {
        console.error('Signature comparison failed:', err.message);
        return false;
    }
}

/**
 * Express middleware for Polar webhook verification
 */
function polarWebhookMiddleware(secret) {
    return (req, res, next) => {
        const signature = req.headers['polar-signature'];
        const payload = req.body.toString();

        if (!verifyPolarWebhook(payload, signature, secret)) {
            return res.status(401).json({ error: 'Invalid signature' });
        }

        req.polarEvent = JSON.parse(payload);
        next();
    };
}

module.exports = {
    verifyPolarWebhook,
    polarWebhookMiddleware,
};
