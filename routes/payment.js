// routes/payment.js
const { error } = require('console');
const express = require('express');
const https = require('https');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('', async (req, res) => {
    let { product, user } = req.body;
    product = JSON.parse(product);
    console.log(product.price)


    fetch('https://api.paystack.co/transaction/initialize', {
        headers: {
            Authorization: 'Bearer ' + process.env.PAYSTACK_SECRET_KEY,
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            email: user.email, // get email from localStorage
            amount: Number(product.price) * 100, // Paystack requires amount in GHS
            ref: 'order_' + Math.floor(Math.random() * 1000000), // Unique reference
            metadata: {
                product,
                user: {
                    email: user.email,
                    phone: user.phone,
                    address: user.address
                }
            },
            currency: 'GHS',
        })
    }).then(r => r.json().then(data => ({ status: r.status, body: data })))
        .then(obj => {
            res.json(obj)
        })
        .catch(error => {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Payment initialization failed' });
        })
})

router.post('/order-success', async (req, res) => {
    try {
        const { product, user } = req.body;

        // === SEND EMAIL TO ADMIN ===
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD
            }
        });

        // Email to YOU (admin)
        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: 'New Order Received',
            html: `
                <h2>New Order Details</h2>
                <p><strong>Product:</strong> ${product.name}</p>
                <p><strong>Price:</strong> ₦${product.price}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Address:</strong> ${user.address}</p>
                <img src="${product.img}" alt="Product Image" width="150" />
            `
        });

        // Email to CUSTOMER
        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: 'Order Confirmation',
            html: `
                <h2>Thank you for your order!</h2>
                <p>Your payment was successful.</p>
                <p><strong>Product:</strong> ${product.name}</p>
                <p><strong>Price:</strong> ₦${product.price}</p>
                <p>We will send further updates to ${user.email}.</p>
                <img src="${product.img}" alt="Product Image" width="150" />
            `
        });

        res.json({ success: true, message: 'Order email sent' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error sending order email' });
    }
});

module.exports = router;
