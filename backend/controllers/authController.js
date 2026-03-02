const authService = require('../services/authService');
const errors = require('../exceptions/errors');

exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const token = await authService.login(email, password);
        res.status(200).json(token);
    } catch (err) {
        if (err instanceof errors.NotFoundError) {
            res.status(204).json({error: err.message});
        }
        if (err instanceof errors.WrongPassword) {
            res.status(401).json({error: err.message});
        }
        console.error(err);
        res.status(500).json({error: err.message});
    }
}
