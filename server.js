require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 5000;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT, // true for port 465, false for other ports
    requireTLS: true, 
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS  
    },
    logger: true, // Enable logging
    debug: true   // Enable debug output
});

// Update the connection string with your database name
mongoose.connect('mongodb+srv://user123:user123@cluster0.unkh6.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(cors());

const EmailSchema = new mongoose.Schema({
    from: String,
    to: [String], 
    subject: String,
    text: String,
    sendAt: Date
});

const Email = mongoose.model('Email', EmailSchema);

app.get("/", (req, res) => {
    res.send("Server is Running");
});

app.post('/scheduleEmail', async (req, res) => {
    console.log(req.body);
    const { from, to, subject, text, sendAt, gap } = req.body;
    const email = new Email({ from, to, subject, text, sendAt });

    await email.save();

    const sendEmail = async (recipient, delay) => {
        const message = {
            from,
            to: recipient,
            subject,
            text
        };

        setTimeout(async () => {
            try {
                await transporter.sendMail(message);
                console.log('Email sent to', recipient);
            } catch (error) {
                console.error('Error sending email to', recipient, ':', error.message);
            }
        }, delay);
    };

    const recipients = Array.isArray(to) ? to.map(email => email.trim()) : [to.trim()];
    let delay = 0;

    for (const recipient of recipients) {
        sendEmail(recipient, delay);
        delay += gap * 60000;
    }

    res.send('Email scheduled successfully');
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
