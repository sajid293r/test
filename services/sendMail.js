/* const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
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
 */


const nodemailer = require('nodemailer');

const sendEmail = (from, to, subject, html, delay) => {
    setTimeout(() => {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Replace with your SMTP server
            port: 587, // Replace with your SMTP server port
            secure: false, // Use true for 465, false for other ports
            auth: {
                user: 'danialhamza.bytecraft@gmail.com', // Replace with your email
                pass: 'ypdi wdqk ekln fldw', // Replace with your email password
            },
        });

        const mailOptions = {
            from,
            to,
            subject,
            html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(`Error sending email to ${to} : ${error.message}`);
            }
            console.log(`Email sent to ${to}: ${info.response}`);
        });
    }, delay);
};

module.exports = sendEmail;
