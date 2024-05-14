import { getFutureHalfDays, getHalfDays, setDaysFullDay, setDaysHalfDay } from '../database.js';
import express from 'express';
import { keepAlive, validateToken } from '../JWT.js';
import { eachDayOfInterval, endOfYear, format, getDay } from 'date-fns';
import { ISO_DATE_FORMAT } from '../constants.js';
import { adminOnly } from '../middleware.js';

const router = express.Router();

router.use(keepAlive);
router.use(validateToken);

router.get('/range/:endDate', async (req, res) => {
    const endDate = req.params.endDate;
    const days = await getHalfDays({endDate});
    res.json(days.map(({date}) => format(date, ISO_DATE_FORMAT)));
});

router.get('/future', async (_req, res) => {
    const days = await getFutureHalfDays();
    res.json(days.map(({date}) => format(date, ISO_DATE_FORMAT)));
})

router.post('/setHalfDays', adminOnly, async (req, res) => {
    const { dayOfTheWeek, startDate } = req.body;
    const end = endOfYear(new Date());
    const dateStringArr = eachDayOfInterval({start: startDate, end})
        .filter((date) => getDay(date) === dayOfTheWeek)
        .map((date) => format(date, ISO_DATE_FORMAT));
    await setDaysHalfDay({dateStringArr});
    res.json(dateStringArr);
})

router.post('/setFullDays', adminOnly, async (req, res) => {
    const { dayOfTheWeek, startDate } = req.body;
    const end = endOfYear(new Date());
    const dateStringArr = eachDayOfInterval({start: startDate, end})
        .filter((date) => getDay(date) === dayOfTheWeek)
        .map((date) => format(date, ISO_DATE_FORMAT));
    await setDaysFullDay({dateStringArr});
    res.json(dateStringArr);
})

export default router;