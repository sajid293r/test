const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for port 465, false for other ports
    requireTLS: true, 
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS  
    },
    logger: true,
    debug: true
});

const sendEmail = (from, recipient, subject, text, delay) => {
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

module.exports = sendEmail;
