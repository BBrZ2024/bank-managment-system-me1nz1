const User = require('./userClass');

class Employee extends User {
    constructor(name, position = "new Employee", salary = 0) {
        super(name, "Employee");
        this._position = position;
        this._salary = salary;
    }

    get position() {
        return this._position;
    }

    set position(newPosition) {
        this._position = newPosition;
    }

    get salary() {
        return this._salary;
    }

    set salary(newSalary) {
        this._salary = newSalary
    }

}

module.exports = Employee;