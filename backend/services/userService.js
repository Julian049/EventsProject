const User = require('../models/user');
const UserModel = require('../models/userModel');
const bcryptUtil = require('../utils/bcrypt');

exports.createUser = (user) => {
    const newUser = {
        name: user.name,
        email: user.email,
        password: bcryptUtil.hashPassword(user.password),
        role: user.role,
    }
    return UserModel.create(newUser)
}

exports.viewUsers = () => {
    return UserModel.getAll();
}

exports.updateUser = (user, id) => {
    const newUser = {
        name: user.name,
        email: user.email,
        password: bcryptUtil.hashPassword(user.password),
        role: user.role,
    }
    return UserModel.update(newUser, id);
}

exports.getUserById = (id) => {
    return UserModel.getById(id);
}