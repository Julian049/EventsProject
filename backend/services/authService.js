const bcryptUtil = require('../utils/bcrypt');
const jwtUtil = require('../utils/jwt');
const UserModel = require('../models/userModel');
const errors = require('../exceptions/errors');

exports.login = async (email, password) => {

    const user = await UserModel.getByEmail(email);
    if (!user) {
        throw new errors.NotFoundError("Usuario no encontrado")
    }

    const userPassword = user.password;

    const validate = await bcryptUtil.validatePassword(userPassword, password);
    if (validate === false) {
        throw new errors.WrongPassword("La contraseña no coincide")
    }


    return jwtUtil.generateToken(user);
}