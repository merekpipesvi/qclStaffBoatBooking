import jwt from 'jsonwebtoken';
import { COOKIE_NAME, MINUTES } from './constants.js';

export const createTokens = (user) => (jwt.sign({userId: user.userId, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' }));

export const validateToken = (req, res, next) => {
    const accessToken = req.cookies[COOKIE_NAME];

    if (!accessToken) {
        return res.status(400).json({ error: "User not authenticated :("});
    } else {
        try {
            const user = jwt.verify(accessToken, process.env.JWT_SECRET);
            if (user) {
                req.authenticated = true;
                req.userId = user.userId;
                req.role = user.role;
                return next();
            }
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}

export const keepAlive = (req, res, next) => {
    const accessToken = req.cookies[COOKIE_NAME];
    if (!accessToken) {
        return res.status(400).json({ error: "User not authenticated :("});
    } else {
        res.cookie(COOKIE_NAME, accessToken, { maxAge: 30*MINUTES, httpOnly: true, sameSite: 'none', secure: true });
        return next();
    }
}