'use strict';

const NODEMAILER = require('nodemailer');
const { Service } = require('@hapipal/schmervice');

module.exports = class MailService extends Service {

    async sendMail(user, subject, text) {

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

        const message = {
            from: process.env.MAIL_ADDRESS,
            to: user,
            subject,
            text
        };

        try {
            await transporter.sendMail(message);
            return { 'Success': 'Mail send' };
        }
        catch (e) {
            return { 'Error': e };
        }
    }
};

