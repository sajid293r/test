const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: smtp.gmail.com,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, 
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },

});

const sendEmail = (from, recipient, subject, html, delay) => {
    const message = {
        from,
        to: recipient,
        subject,
        html 
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
