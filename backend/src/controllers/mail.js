const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true', 
    pool: true,   
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2"
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,   
    socketTimeout: 30000      
});

const sendEmail = (options) => {
    return transporter.sendMail({
        from: process.env.MAIL_USER,
        to: process.env.MAIL_USER,
        ...options
    });
};

module.exports = { sendEmail };