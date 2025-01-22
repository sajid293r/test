const express = require('express');
const dns = require('dns');
const Email = require('../model/Email');
const sendEmail = require('../services/sendMail');

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Server is Running");
});

router.post('/scanEmails', async (req, res) => {
    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ error: 'No email addresses provided' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipients = Array.isArray(to) ? to.map(email => email.trim()) : [to.trim()];
    let validEmails = [];
    let invalidEmails = [];

    const resolveWithTimeout = (domain) => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('DNS resolution timeout'));
            }, 5000); // 5-second timeout

            dns.resolveMx(domain, (err, addresses) => {
                clearTimeout(timeout);
                if (err) {
                    reject(err);
                } else {
                    resolve(addresses);
                }
            });
        });
    };

    await Promise.all(recipients.map(async (recipient) => {
        if (emailRegex.test(recipient)) {
            const domain = recipient.split('@')[1];
            try {
                const addresses = await resolveWithTimeout(domain);
                console.log(`Resolved addresses for ${domain}: ${JSON.stringify(addresses)}`);
                if (addresses && addresses.length > 0) {
                    validEmails.push(recipient);
                } else {
                    invalidEmails.push(recipient);
                }
            } catch (err) {
                console.log(`Error resolving ${domain}: ${err.message}`);
                invalidEmails.push(recipient);
            }
        } else {
            invalidEmails.push(recipient);
        }
    }));

    res.json({ validEmails, invalidEmails });
});

router.post('/scheduleEmail', async (req, res) => {
    console.log(req.body);
    const { from, to, subject, text: html, sendAt, gap } = req.body;

    if (!to) {
        return res.status(400).json({ error: 'No email addresses provided' });
    }

    const email = new Email({ from, to, subject, text: html, sendAt, gap });
    await email.save();

    const recipients = Array.isArray(to) ? to.map(email => email.trim()) : [to.trim()];
    let delay = 0;

    for (const recipient of recipients) {
        sendEmail(from, recipient, subject, html, delay);
        delay += gap * 60000;
    }

    res.status(200).json({ message: 'Email scheduled successfully' });
});

module.exports = router;
