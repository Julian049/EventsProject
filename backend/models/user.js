class User {
    constructor({name, email, password, role = null}) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

module.exports = User;