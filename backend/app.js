import express from 'express';
import cors from 'cors';
import { CronJob } from 'cron';
import userRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import daysRouter from './routes/days.js';
import bookingsRouter from './routes/bookings.js';
import boatsRouter from './routes/boats.js';
import cookieParser from 'cookie-parser';
import { API_BASE } from './constants.js';
import { sendAllBoatConfirmedEmails, sendAllConfirmationNeededEmails } from './email.js';

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
app.use(`${API_BASE}/users`, userRouter);
app.use(`${API_BASE}/auth`, authRouter);
app.use(`${API_BASE}/halfDays`, daysRouter);
app.use(`${API_BASE}/bookings`, bookingsRouter);
app.use(`${API_BASE}/boats`, boatsRouter);

const confirmationNeededEmails = new CronJob(
    "0 20 * * *",
    sendAllConfirmationNeededEmails,
    null, // onComplete
    true, // starts it automatically
    'America/Los_Angeles', 
);

const boatAssignmentEmails = new CronJob(
    "0 22 * * *",
    sendAllBoatConfirmedEmails,
    null, // onComplete
    true, // starts it automatically
    'America/Los_Angeles', 
);

app.listen(8800, () => {
    console.log('Server running on port 8800');
});



