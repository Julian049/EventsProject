class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "Value not found";
    }
}
class WrongPassword extends Error {
    constructor(message) {
        super(message);
        this.name = "Wrong Password";
    }
}


module.exports = { NotFoundError, WrongPassword };