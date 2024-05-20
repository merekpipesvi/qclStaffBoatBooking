import { getUserForLogIn, createUser, getUserById } from '../database.js';
import express from 'express';
import bcrypt from 'bcrypt';
import { createTokens, keepAlive, validateToken } from '../JWT.js';
import { COOKIE_NAME, DEFAULT_USER_ROLE, HASH_ROUNDS, MINUTES } from '../constants.js';
import { isBefore } from 'date-fns';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, fishingLicence, pcoc } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, HASH_ROUNDS);
        const shouldAutoConfirm = isBefore(new Date(), new Date('2024-06-01'));
        const createdUser = await createUser({ firstName, lastName, email, password: hashPassword, role: DEFAULT_USER_ROLE, fishingLicence, pcoc, isConfirmed: shouldAutoConfirm ? 1 : 0, points: 0 });
        const accessToken = createTokens(createdUser);
        res.cookie(COOKIE_NAME, accessToken, { maxAge: 15*MINUTES, httpOnly: true, sameSite: 'none', secure: true });
        res.status(201).send(createdUser);
    } catch (error) {
        res.status(400).json({ error })
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await getUserForLogIn(email);

    if(user === undefined) {
        res.status(401).json("Account not on record.")
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    // Using the error response as messages in the log in page.
    if (user == null || !passwordsMatch) {
        res.status(401).json("Password or email are incorrect.");
    } else if (!user.isConfirmed) {
        res.status(401).json("This account needs admin confirmation.");
    } else {
        const accessToken = createTokens(user);
        res.cookie(COOKIE_NAME, accessToken, { maxAge: 15*MINUTES, httpOnly: true, sameSite: 'none', secure: true });
        res.json("Successful login");
    }
});

router.get('/me', validateToken, async (req, res) => {
    const currentUser = await getUserById(req.userId);
    res.json(currentUser);
});

router.get('/extend', keepAlive, async (req,res) => {
    res.json('Session extended');
})

export default router;