import jwt from 'jsonwebtoken';
import { COOKIE_NAME } from './constants.js';

export const createTokens = (user) => (jwt.sign({userId: user.userId, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' }));

export const validateToken = (req, res, next) => {
    const accessToken = req.cookies[COOKIE_NAME];

    if (!accessToken) {
        return res.status(400).json({ error: "User not authenticated :("});
    } else {
        try {
            const isValidToken = jwt.verify(accessToken, process.env.JWT_SECRET);
            if (isValidToken) {
                req.authenticated = true;
                return next();
            }
        } catch (error) {
            return res.status(400).json({ error });
        }
    }
}