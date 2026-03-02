const User = require('../models/user');
const UserModel = require('../models/userModel');

exports.createUser = (user) => {
    const newUser = new User(user);
    return UserModel.create(newUser)
}

exports.viewUsers = () => {
    return UserModel.getAll();
}

exports.updateUser = (newUser, id) => {
    return UserModel.update(newUser, id);
}

exports.getUserById = (id) => {
    return UserModel.getById(id);
}