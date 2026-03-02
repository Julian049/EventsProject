import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export function generateToken(userData) {
    const user = {email: userData.email, role: userData.role};
    return jwt.sign({user: user}, process.env.JWT_ACCESS_TOKEN)
}

export function verifyToken(userData) {
    return jwt.verify(userData, process.env.JWT_ACCESS_TOKEN);
}
