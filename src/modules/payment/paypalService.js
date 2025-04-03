const paypal = require('paypal-rest-sdk');
const config = require('../../config/paypal');

paypal.configure({
    mode: config.mode,
    client_id: config.clientId,
    client_secret: config.clientSecret,
});

function createPayment(paymentData, callback) {
    paypal.payment.create(paymentData, function (error, payment) {
        if (error) {
            return callback(error);
        }
        callback(null, payment);
    });
}

module.exports = { createPayment };
