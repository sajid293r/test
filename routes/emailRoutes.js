const express = require('express');
const router = express.Router();
const Email = require('../model/Email');
const sendEmail = require('../services/sendMail');

router.get("/", (req, res) => {
    res.send("Server is Running");
});

router.post('/scheduleEmail', async (req, res) => {
    console.log(req.body);
    const { from, to, subject, text: html, sendAt, gap } = req.body;
    const email = new Email({ from, to, subject, text: html, sendAt, gap });

    await email.save();

    const recipients = Array.isArray(to) ? to.map(email => email.trim()) : [to.trim()];
    let delay = 0;

    for (const recipient of recipients) {
        sendEmail(from, recipient, subject, html, delay); 
        delay += gap * 60000;
    }

    res.send('Email scheduled successfully');
});

module.exports = router;
