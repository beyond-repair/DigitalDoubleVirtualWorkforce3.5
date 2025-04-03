module.exports = {
    clientId: process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'YOUR_PAYPAL_CLIENT_SECRET',
    mode: process.env.PAYPAL_MODE || 'sandbox', // change to 'live' for production
};
