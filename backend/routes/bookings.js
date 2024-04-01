import express from 'express';
import { createBooking, deleteBooking, getUserById, getUsersForBookings } from '../database.js';
import { keepAlive, validateToken } from '../JWT.js';

const router = express.Router();
router.use(validateToken);
router.use(keepAlive);

router.get("/", async (req, res) => {
    const { isMorningBooking, date } = req.query;
    const userId = req.userId;
    const users = await getUsersForBookings({userId, date, isMorningBooking: isMorningBooking === 'null' ? null : isMorningBooking === 'true'});
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


router.delete("/", validateToken , async (req,res) => {
    const userId = req.userId;
    const {date, isMorningBooking} = req.body;
    const deletionReturn = await deleteBooking({date, isMorningBooking, userId});
    res.status(201).send(deletionReturn);
});

export default router;