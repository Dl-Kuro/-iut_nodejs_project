'use strict';

const NODEMAILER = require('nodemailer');
const { Service } = require('@hapipal/schmervice');

module.exports = class MailService extends Service {
    async sendWelcomeMail(user) {

        // let testAccount = await NODEMAILER.createTestAccount();

        const transporter = NODEMAILER.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const info = {
            from: process.env.MAIL_ADDRESS,
            to: user.mail,
            subject: 'Hello ✔',
            text: 'Hello world ?'
        };

        await transporter.sendMail(info);
    }
};

