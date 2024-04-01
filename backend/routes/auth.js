import { getUserForLogIn, createUser, getUserById } from '../database.js';
import express from 'express';
import bcrypt from 'bcrypt';
import { createTokens, validateToken } from '../JWT.js';
import { COOKIE_NAME, DEFAULT_USER_ROLE, HASH_ROUNDS, MINUTES } from '../constants.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, fishingLicence, pcoc } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, HASH_ROUNDS);
        const createdUser = await createUser({ firstName, lastName, email, password: hashPassword, role: DEFAULT_USER_ROLE, fishingLicence, pcoc, points: 0 });
        res.status(201).send(createdUser);
    } catch (error) {
        res.status(400).json({ error })
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await getUserForLogIn(email);
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (user == null || !passwordsMatch) {
        res.status(400).json({error: "That email and password don't match our records"});
    } else {
        const accessToken = createTokens(user);
        res.cookie(COOKIE_NAME, accessToken, { maxAge: 15*MINUTES, httpOnly: true });
        res.json("Successful login");
    }
});

router.get('/me', validateToken, async (req, res) => {
    const currentUser = await getUserById(req.userId);
    res.json(currentUser);
});

export default router;