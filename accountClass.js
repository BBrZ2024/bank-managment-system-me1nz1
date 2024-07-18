class Account {
  constructor(customer, account_number, balance) {
    this._customer = customer;
    this._account_number = account_number;
    this._balance = balance;
  }

  get account_number() {
    return this._account_number;
  }

  get balance() {
    return this._balance;
  }

  set balance(new_balance) {
    this._balance = new_balance;
  }

  get customer() {
    return this._customer;
  }

  showAccountnumber() {
    console.log("Accountnumber: " + this.account_number);
  }

  showAccountDetails() {
    console.log(
      `Accountnumber: ${this.account_number}, User: ${this.customer.name}, Balance: ${this.balance}`
    );
  }
}

module.exports = Account;
