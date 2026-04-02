const bcryptUtil = require('../utils/bcrypt');
const jwtUtil = require('../utils/jwt');
const UserModel = require('../models/userModel');
const errors = require('../exceptions/errors');

exports.login = async (email, password) => {

    const user = await UserModel.getByEmail(email);
    if (!user) {
        throw new errors.NotFoundError("Usuario no encontrado")
    }

    if (user.status === false) {
        throw new errors.NotFoundError("Usuario eliminado o desactivado")
    }

    const userPassword = user.password;

    const validate = await bcryptUtil.validatePassword(userPassword, password);
    if (validate === false) {
        throw new errors.WrongPassword("La contraseña no coincide")
    }


    return jwtUtil.generateToken(user);
}