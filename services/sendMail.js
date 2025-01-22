const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure:465, 
    requireTLS: true,
    auth: {
        user: "danialhamza.bytecraft@gmail.com",
        pass:"ypdi wdqk ekln fldw"
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
