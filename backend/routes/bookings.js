import express from 'express';
import { confirmBooking, createBooking, deleteBooking, getBookingsForDayOfWeek, getBookingsNeedingConfirmation, getUserById, getUsersForBookings, unconfirmBooking } from '../database.js';
import { keepAlive, validateToken } from '../JWT.js';
import { adminOnly } from '../middleware.js';

const router = express.Router();
router.use(validateToken);
router.use(keepAlive);

router.get("/", async (req, res) => {
    const { isMorningBooking, date } = req.query;
    const users = await getUsersForBookings({date, isMorningBooking: isMorningBooking === 'null' ? null : isMorningBooking === 'true'});
    res.send(users);
});

// Post model specifically for users booking for themselves, not for use by admins booking others
router.post("/", validateToken , async (req,res) => {
    const userId = req.userId;
    const user = await getUserById(userId);
    const {date, isMorningBooking} = req.body;
    const bookingRes = await createBooking({date, isMorningBooking, userPoints: user.points, isPriority: 0, userId});
    res.status(201).send(bookingRes);
});

// Post model specifically for admins booking priority
router.post("/priority", validateToken, adminOnly, async (req,res) => {
    const {userId, date, isMorningBooking} = req.body;
    const user = await getUserById(userId);
    const bookingRes = await createBooking({date, isMorningBooking, userPoints: user.points, isPriority: 1, userId});
    res.status(201).send(bookingRes);
});

// delete model specifically for admins booking priority
router.delete("/priority", validateToken, adminOnly, async (req,res) => {
    const {userId, date, isMorningBooking} = req.body;
    const deletionReturn = await deleteBooking({date, isMorningBooking, userId});
    res.status(201).send(deletionReturn);
});

router.delete("/", validateToken , async (req,res) => {
    const userId = req.userId;
    const {date, isMorningBooking} = req.body;
    const deletionReturn = await deleteBooking({date, isMorningBooking, userId});
    res.status(201).send(deletionReturn);
});

router.get("/confirmation", validateToken, async (req, res) => {
    const userId = req.userId;
    const bookings = await getBookingsNeedingConfirmation({userId});
    res.send(bookings);
});

router.post("/confirmation/confirm", validateToken , async (req,res) => {
    const userId = req.userId;
    const {bookingId} = req.body;

    const confirmBookingRes = await confirmBooking({bookingId, userId});
    res.status(201).send(confirmBookingRes);
});

router.post("/confirmation/unconfirm", validateToken , async (req,res) => {
    const userId = req.userId;
    const {bookingId} = req.body;

    const unconfirmBookingRes = await unconfirmBooking({bookingId, userId});
    res.status(201).send(unconfirmBookingRes);
});

router.get("/bookingsByDay", async (req, res) => {
    const { dayOfWeek } = req.query;
    const dayOfWeekNum = Number(dayOfWeek);
    if(isNaN(dayOfWeekNum) || ![0, 1, 2, 3, 4, 5, 6].some((dateFnDayOfWeek) => dateFnDayOfWeek === dayOfWeekNum)) {
        res.status(400).send({message: "dayOfWeek should be a number between 0 (sunday) and 6 (saturday)"});
    }
    // date-fns uses 0 for Sunday, where MySQL uses 1.
    const bookings = await getBookingsForDayOfWeek({dayOfWeek: dayOfWeekNum + 1});
    res.send(bookings);
});

export default router;