// routes/paystackWebhook.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // or your email provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post("/paystack-webhook", express.json({ type: 'application/json' }), async (req, res) => {
    const event = req.body;

    if (event.event === 'charge.success') {
        const paymentData = event.data;

        // ⚠️ LocalStorage is frontend-only — you CANNOT read it here.
        // Instead, store order details in your DB when initiating payment.
        // Then fetch them here using paymentData.reference or customer.email.

        const customerEmail = paymentData.customer.email;
        const amountPaid = paymentData.amount / 100; // Paystack stores in kobo
        const orderReference = paymentData.reference;

        // TODO: Fetch order details from DB using reference
        const orderDetails = {
            productName: "Example Product",
            price: amountPaid,
            reference: orderReference
        };

        // Send email to admin
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Order - ${orderReference}`,
            text: `A new payment has been received.\n\nCustomer: ${customerEmail}\nProduct: ${orderDetails.productName}\nAmount: ${orderDetails.price}`
        });

        // Send email to customer
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: "Order Confirmation",
            text: `Thank you for your purchase!\n\nProduct: ${orderDetails.productName}\nAmount: ${orderDetails.price}\nReference: ${orderDetails.reference}`
        });
    }

    res.sendStatus(200);
});

module.exports = router;
