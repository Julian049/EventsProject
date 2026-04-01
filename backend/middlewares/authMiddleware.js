import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Role from '../constants/role.js';

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

export function adminAuthorized(req, res, next) {
    if (req.user.role !== Role.admin) {
        return res.status(403).json({message: 'Acceso denegado'});
    }
    next();
}

export function updateUserAuthorized(req, res, next) {
    if (Number(req.params.id) !== Number(req.user.id) && req.user.role !== Role.admin) {
        return res.status(403).json({message: 'Acceso denegado'});
    }
    next();
}

export function deleteUserAuthorized(req, res, next) {
    if (Number(req.params.id) !== Number(req.user.id)) {
        return res.status(403).json({message: 'Acceso denegado'});
    }
    next();
}