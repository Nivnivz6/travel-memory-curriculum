import { verifyToken } from '../utils/jwt.js';

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ msg: 'Unauthorized' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid or expired token' });
        return;
    }
};