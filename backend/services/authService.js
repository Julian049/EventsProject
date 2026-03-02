const bcryptUtil = require('../utils/bcrypt');
const jwtUtil = require('../utils/jwt');
const UserModel = require('../models/userModel');
const errors = require('../exceptions/errors');

exports.login = async (email, password) => {

    const user = await UserModel.getByEmail(email);
    if (!user) {
        console.log("Usuario no encontrado");
        throw new errors.NotFoundError("Usuario no encontrado")
    }

    console.log("password22" + user);

    const userPassword = user.password;

    console.log("password33" + userPassword);

    const validate = await bcryptUtil.validatePassword(userPassword, password);
    if (validate === false) {
        console.log("La contraseña no coincide");
        throw new errors.WrongPassword("La contraseña no coincide")
    }


    return jwtUtil.generateToken(user);
}