import bcrypt from 'bcrypt';

export function hashPassword(password) {
    return bcrypt.hashSync(password, 12);
}

function validatePassword(savedPassword, password) {
    return bcrypt.compare(password, savedPassword);
}