const express = require('express');
const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Email sender configuration (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,  // Your Gmail address
        pass: process.env.GMAIL_PASS   // Gmail App Password
    }
});

// POST /api/order-success
router.post("/order-success", async (req, res) => {
    const { reference, productName, productImage, productPrice, userEmail, userPhone, userAddress } = req.body;

    try {
        //  Verify payment with Paystack API
        const verifyRes = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        // If payment is not successful, stop here
        if (verifyRes.data.data.status !== "success") {
            return res.status(400).json({ status: "failed", message: "Payment not verified" });
        }

        //  Send email to Admin (You)
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: `New Order - ${productName}`,
            html: `
                <h2>New Order Received</h2>
                <p><strong>Product:</strong> ${productName}</p>
                <p><strong>Price:</strong> Ghs ${productPrice}</p>
                <p><strong>Customer Email:</strong> ${userEmail}</p>
                <p><strong>Phone:</strong> ${userPhone}</p>
                <p><strong>Address:</strong> ${userAddress}</p>
                <img src="${productImage}" width="200" alt="Product Image">
            `
        });

        //  Send confirmation email to Customer
        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: userEmail,
            subject: "Order Confirmation",
            html: `
                <h2>Thank You for Your Order!</h2>
                <p>We have received your payment for:</p>
                <p><strong>${productName}</strong> - ₦${productPrice}</p>
                <p>Delivery Address: ${userAddress}</p>
                <img src="${productImage}" width="200" alt="Product Image">
                <p>We'll contact you on ${userPhone} if needed.</p>
                <p>Thank you for shopping with us!</p>
            `
        });

        // Success response
        res.json({ status: "success", message: "Emails sent successfully" });

    } catch (error) {
        console.error("Error processing order:", error.response?.data || error.message);
        res.status(500).json({ status: "error", message: "Server error" });
    }
});

module.exports = router;
