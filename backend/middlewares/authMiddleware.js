import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({message: 'Token requerido'});

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if (err) return res.status(403).json({message: 'Token inválido'});

        req.user = user;
        next();
    });
}
