import bcrypt from 'bcrypt';

export function hashPassword(password) {
    return bcrypt.hashSync(password, 12);
}

export async function validatePassword(savedPassword, password) {
    console.log("password11");
    return bcrypt.compare(password, savedPassword);
}