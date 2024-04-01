import express from 'express';
import { getBoatsUnavailableDates, getUsersForBookings } from '../database.js';
import { keepAlive, validateToken } from '../JWT.js';

const router = express.Router();
router.use(validateToken);
router.use(keepAlive);

router.get("/", async (req, res) => {
    const { startDate, endDate } = req.query;
    const boats = await getBoatsUnavailableDates({startDate, endDate});
    const dateBoatMapping = {};

    boats.forEach(({ boatId, dateUnavailable }) => {
        const date = dateUnavailable.toLocaleDateString();
        if (!dateBoatMapping[date]) {
          dateBoatMapping[date] = [];
        }
        dateBoatMapping[date].push(boatId);
      });
    res.send(dateBoatMapping);
})

export default router;