import express from 'express';
import { getUserForLogIn, createUser } from './database.js';
import cors from 'cors';
import userRouter from './routes/users.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { createTokens, validateToken } from './JWT.js';
import { COOKIE_NAME, DEFAULT_USER_ROLE, HASH_ROUNDS, MINUTES } from './constants.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/api/users', userRouter);

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, fishingLicence, pcoc } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, HASH_ROUNDS);
        const createdUser = await createUser({ firstName, lastName, email, password: hashPassword, role: DEFAULT_USER_ROLE, fishingLicence, pcoc });
        res.status(201).send(createdUser);
    } catch (error) {
        res.status(400).json({ error })
    }
    
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await getUserForLogIn(email);
    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (user == null || !passwordsMatch) {
        res.status(400).json({error: "That email and password don't match our records"});
    } else {
        const accessToken = createTokens(user);
        res.cookie(COOKIE_NAME, accessToken, { maxAge: 60*MINUTES, httpOnly: true });
        res.json(user);
    }
});

app.get('/me', validateToken, (req, res) => {
    res.json("profile");
});


app.listen(8800, () => {
    console.log('Server running on port 8800');
});



