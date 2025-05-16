import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user || req.user.role !== 'recruiter') {
            return res.status(403).json({ message: 'Recruiter access required' });
        }
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Access denied' });
    }
};


