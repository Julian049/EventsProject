const userService = require('../services/userService');

exports.createUser = async (req, res) => {
    const newUser = await userService.createUser(req.body);
    res.json(newUser);
}

exports.viewUsers = async (req, res) => {
    try {
        const users = await userService.viewUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.updateUser = async (req, res) => {
    const {id} = req.params;
    const newUser = await userService.updateUser(req.body, id);
    res.json(newUser);
}

exports.getUserById = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await userService.getUserById(id);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
}