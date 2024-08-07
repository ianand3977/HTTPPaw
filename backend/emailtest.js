const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS_KEY,
    },
});

transporter.sendMail({
    from: process.env.EMAIL_USER, // Add the from address
    to: 'anandgu2002@gmail.com',
    subject: 'Hello',
    html: '<h1>How are you</h1>',
})
.then(() => {
    console.log('Email sent');
})
.catch(err => {
    console.log('Error:', err);
});
