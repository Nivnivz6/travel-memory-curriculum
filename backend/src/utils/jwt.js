import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '1h'; 

export const signToken = (payload)  => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: EXPIRES_IN,
        algorithm: 'HS512', 
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};