const User = require('./userClass');

class Employee extends User {
    constructor(name, position) {
        super(name, "Employee");
        this._position = position;
    }

    get position() {
        return this._position;
    }
}

module.exports = Employee;