const User = require('./userClass');

class Customer extends User {
    constructor(name) {
        super(name, "Customer");
    }

}

module.exports = Customer;