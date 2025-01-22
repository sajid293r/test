const express = require('express');
const router = express.Router();
const dns = require('dns');
const util = require('util');
const sendEmail = require('../services/sendMail');
const Email = require('../model/Email');
const resolveMx = util.promisify(dns.resolveMx);

router.post('/scanEmails', async (req, res) => {
    console.log(req.body);
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

            resolveMx(domain)
                .then(addresses => {
                    clearTimeout(timeout);
                    resolve(addresses);
                })
                .catch(err => {
                    clearTimeout(timeout);
                    reject(err);
                });
        });
    };

    await Promise.all(recipients.map(async (recipient) => {
        if (emailRegex.test(recipient)) {
            const domain = recipient.split('@')[1];
            try {
                const addresses = await resolveWithTimeout(domain);
                if (addresses && addresses.length > 0) {
                    console.log(`Valid email domain: ${domain}`);
                    validEmails.push(recipient);
                } else {
                    console.log(`Invalid email domain: ${domain}`);
                    invalidEmails.push(recipient);
                }
            } catch (err) {
                console.log(`Invalid email domain: ${domain}`);
                invalidEmails.push(recipient);
            }
        } else {
            console.log(`Invalid email address format: ${recipient}`);
            invalidEmails.push(recipient);
        }
    }));

    res.json({ validEmails, invalidEmails });
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
