import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export function generateToken(userData) {
    return jwt.sign(
        { id: userData.id, email: userData.email, role: userData.role },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: '2h' }
    )
}
