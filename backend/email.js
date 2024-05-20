import nodemailer from 'nodemailer';
import { getAdminEmails, getNumBoatsUnavailableByDate, getUserById, getUserIdsForBoatAssignments, getUserIdsOfBookingsNeedingConfirmation, isHalfDay } from './database.js';
import { LOWEST_BOAT_ID, STRING_DATE_FORMAT, TIME_OF_DECISION, ISO_DATE_FORMAT, BOATS_AVAILABLE } from './constants.js';
import { format, startOfToday, startOfTomorrow } from 'date-fns';

export const sendConfirmationNeededEmail = async ({userId}) => {
    try {
        const user = await getUserById(userId);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODE_MAILER_EMAIL,
                pass: process.env.NODE_MAILER_PASS,
            },
        });

        console.log(user);

        const mailOptions = {
            from: process.env.NODE_MAILER_EMAIL,
            to: user.email,
            subject: 'Action Needed For Your Boat Booking',
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
                    <a href="http://qclstaffboats.com/?deepLink=/confirmation" class="button">Confirm Booking</a>
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

        await transporter.sendMail(mailOptions);
        return { message: 'Email sent successfully.' };
    } catch (error) {
        return { message: `Error sending email: ${error}` };
    }
}

export const sendAllConfirmationNeededEmails = async () => {
    const userIdsArr = await getUserIdsOfBookingsNeedingConfirmation(
        {dateString: format(startOfToday(), ISO_DATE_FORMAT)}
    );

    userIdsArr.flat().forEach((userId) => 
        sendConfirmationNeededEmail({userId})
    );
}


export const sendBoatConfirmedEmail = async ({userId, boatNumber, isMorningBooking}) => {
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
            to: user.email,
            subject: "You've been assigned a boat!",
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
                </style>
            </head>
            <body>
                <div class="container">
                    <h3 class="header">You were assigned Boat ${boatNumber}${isMorningBooking == null ? '' : ` ${isMorningBooking ? 'from 7am to 12pm' : 'from 12pm to 5pm'}`} for ${format(startOfTomorrow(), STRING_DATE_FORMAT)}!</h3>
                </div>
            </body>
            </html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully.');
    } catch (error) {
        console.log(`Error sending email: ${error}`);
    }
}

export const sendBoatListToAdmins = async ({usersArr, isMorningBooking}) => {
    try {
        const adminEmails = await getAdminEmails();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODE_MAILER_EMAIL,
                pass: process.env.NODE_MAILER_PASS,
            },
        });
        adminEmails.forEach(({email: adminEmail}) => {
            const mailOptions = {
                from: process.env.NODE_MAILER_EMAIL,
                to: adminEmail,
                subject: `Boat Assignments${isMorningBooking == null ? ' for' : `-${isMorningBooking ? '7am to 12pm' : '12pm to 5pm'} on`} ${format(startOfTomorrow(), STRING_DATE_FORMAT)}`,
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 15px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <table>
                        <tr>
                            <th>Boat</th>
                            <th>Name</th>
                        </tr>
                        <tr>
                            <td>Boat 34</td>
                            <td>${usersArr?.[0]?.firstName} ${usersArr?.[0]?.lastName}</td>
                        </tr>
                        <tr>
                            <td>Boat 35</td>
                            <td>${usersArr?.[1]?.firstName} ${usersArr?.[1]?.lastName}</td>
                        </tr>
                        <tr>
                            <td>Boat 36</td>
                            <td>${usersArr?.[2]?.firstName} ${usersArr?.[2]?.lastName}</td>
                        </tr>
                    </table>
                </body>
                </html>
                `,
            };
            transporter.sendMail(mailOptions);
        });

        return { message: 'Email sent successfully.' };
    } catch (error) {
        return { message: `Error sending email: ${error}` };
    }
}


export const sendAllBoatConfirmedEmails = async () => {
    const dateString = format(startOfToday(), ISO_DATE_FORMAT);
    const isDayAHalfDay = await isHalfDay({date: dateString});
    const numBoatsUnavailable = await getNumBoatsUnavailableByDate({date: dateString});
    const boatsAvailableForDate = BOATS_AVAILABLE - Object.values(numBoatsUnavailable)[0];

    (isDayAHalfDay ? [true, false] : [null]).forEach(async (isMorningBooking) => {
        const usersArr = await getUserIdsForBoatAssignments({dateString, isMorningBooking, boatsAvailableForDate});
        usersArr.forEach(({userId}, index) => sendBoatConfirmedEmail({userId, boatNumber: LOWEST_BOAT_ID + index, isMorningBooking }))
        sendBoatListToAdmins({usersArr});
    })
}
