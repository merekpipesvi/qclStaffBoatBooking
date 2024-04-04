import nodemailer from 'nodemailer';
import { getUserById } from './database.js';
import { TIME_OF_DECISION } from './constants.js';

export const sendEmail = async ({userId}) => {
    try {
        const user = await getUserById(userId);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODE_MAILER_EMAIL,
                pass: process.env.NODE_MAILER_PASS,
            },
        });

        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: process.env.NODE_MAILER_EMAIL,
            subject: 'Testing sending out emails',
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #FAFAFA;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        text-align: center;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        border: 1px solid blue;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                    .button:hover {
                        background-color: #ADD8E6;
                    }
                    .header {
                        color: blue;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="header">Confirmation Needed</h1>
                    <p>Hey ${user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)},</p>
                    <p>Someone ahead of you has cancelled their booking!</p>
                    <p>If you still want the boat tomorrow, please confirm by clicking the button below.</p>
                    <a href="https://your-booking-details-url.com" class="button">Confirm Booking</a>
                    <p>
                        If you have the highest priority of all people who confirm, you'll get
                        an email of your assigned boat at ${TIME_OF_DECISION}.
                    </p>
                    <p>Thank you!</p>
                </div>
            </body>
            </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return { message: 'Email sent successfully.' };
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('An error has occurred.');
    }
}


sendEmail({userId: 1})
    .then(result => {
        console.log(result)
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });