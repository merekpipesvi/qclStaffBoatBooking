/**
 * Only allow admins to access these endpoints.
 */
export const adminOnly = (req, res, next) => {
    if (req.role === 'admin') {
        next();
    } else {
        res.status(403).json({message: "User doesn't have required credentials"});
    }
}