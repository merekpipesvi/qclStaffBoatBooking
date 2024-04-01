import { getDaysOfWeek } from '../database.js';
import express from 'express';
import { keepAlive, validateToken } from '../JWT.js';

const router = express.Router();

router.use(keepAlive);

router.get('/', validateToken, async (req, res) => {
    const days = await getDaysOfWeek();
    res.json(days);
});

export default router;