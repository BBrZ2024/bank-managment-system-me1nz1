const readline = require("readline");
const fs = require("fs");
const Customer = require("./customerClass");
const Account = require("./accountClass");
const Employee = require("./employeeClass");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ----------------------------------------------------------------------------------------------------------------------

// Load JSON data
const loadJSON = (filename) => {
  return JSON.parse(fs.readFileSync(filename, "utf-8"));
};

// Save JSON data
const saveJSON = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf-8");
};

// CREATE USERS AND ACCOUNTS
const data = loadJSON("data.json");
const customers = [];
const employees = [];
const accounts = [];

data.customers.forEach((customerData) => {
  const customer = new Customer(customerData.name);
  customers.push(customer);
  customerData.accounts.forEach((accountData) => {
    const account = new Account(
      customer,
      accountData.account_number,
      accountData.balance
    );
    accounts.push(account);
  });
});

data.employees.forEach((employeeData) => {
  const employee = new Employee(
    employeeData.name,
    employeeData.position,
    employeeData.salary
  );
  employees.push(employee);
});

// VARIABLES AND CONSTANTS
let current_user = null;
let commands;

const formatCurrency = (number) => {
  return number.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// ----------------------------------------------------------------------------------------------------------------------

// FUNCTIONS

let accountlist = () => {
  let column1Length = 10;
  let column2Length = 25;
  let column3Length = 18;
  let column1Text = "ACCOUNT";
  let column2Text = "OWNER";
  let column3Text = "BALANCE";

  console.log(
    "\n" +
      column1Text +
      " ".repeat(column1Length - column1Text.length) +
      "| " +
      column2Text +
      " ".repeat(column2Length - column2Text.length - 1) +
      "| " +
      column3Text
  );

  console.log(
    "-".repeat(column1Length) +
      "+" +
      "-".repeat(column2Length) +
      "+" +
      "-".repeat(column3Length)
  );

  accounts.forEach((element) => {
    console.log(
      `${
        element.account_number +
        " ".repeat(column1Length - element.account_number.length)
      }| ${
        element.customer.name +
        " ".repeat(column2Length - element.customer.name.length - 1)
      }| € ${formatCurrency(element.balance)}`
    );
  });
  console.log();
};


let employeelist = () => {
  let column1Length = 15;
  let column2Length = 30;
  let column3Length = 18;
  let column1Text = "EMPLOYEE";
  let column2Text = "POSITION";
  let column3Text = "SALARY";

  console.log(
    "\n" +
      column1Text +
      " ".repeat(column1Length - column1Text.length) +
      "| " +
      column2Text +
      " ".repeat(column2Length - column2Text.length - 1) +
      "| " +
      column3Text
  );

  console.log(
    "-".repeat(column1Length) +
      "+" +
      "-".repeat(column2Length) +
      "+" +
      "-".repeat(column3Length)
  );

  employees.forEach((element) => {
    console.log(
      `${element.name + " ".repeat(column1Length - element.name.length)}| ${element.position + " ".repeat(column2Length - element.position.length - 1)}| € ${formatCurrency(element.salary)}`);
  });
  console.log();
};

let customerlist = () => {
  let column1Length = 18;
  let column2Length = 20;
  let column3Length = 18;
  let column1Text = "CUSTOMER";
  let column2Text = "NO. OF ACCOUNTS";
  let column3Text = "TOTAL BALANCE";

  console.log(
    "\n" +
      column1Text +
      " ".repeat(column1Length - column1Text.length) +
      "| " +
      column2Text +
      " ".repeat(column2Length - column2Text.length - 1) +
      "| " +
      column3Text
  );

  console.log(
    "-".repeat(column1Length) +
      "+" +
      "-".repeat(column2Length) +
      "+" +
      "-".repeat(column3Length)
  );

  customers.forEach((element) => {
    let customerAccounts = accounts.filter(
      (account) => account.customer === element
    );
    let accountCount = customerAccounts.length;
    let totalBalance = customerAccounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );

    console.log(
      `${element.name + " ".repeat(column1Length - element.name.length)}| ${
        accountCount +
        " ".repeat(column2Length - accountCount.toString.length - 1)
      }| € ${formatCurrency(totalBalance)}`
    );
  });
  console.log();
};

let create = (role, new_user) => {
  const userExists =
    customers.some((customer) => customer.name === new_user) ||
    employees.some((employee) => employee.name === new_user);

  if (userExists) {
    console.log("ERROR - Username already exists.\n");
    return;
  }

  switch (role) {
    case "customer":
      customers.push(new Customer(new_user));
      console.log("New user " + new_user + " has been created.\n");
      break;
    case "employee":
      employees.push(new Employee(new_user));
      console.log("New employee " + new_user + " has been created.\n");
      break;
    default:
      console.log('ERROR - Accepted roles are "customer" or "employee"!\n');
      break;
  }
};

let setposition = (username, position) => {
  let employee = employees.find((employee) => employee.name == username);
  if (employee) {
    employee.position = position;
    console.log(
      `Position of ${employee.name} changed to ${employee.position}\n`
    );
  } else {
    console.log("Employee not found.\n");
  }
};

let setsalary = (username, salary) => {
  let employee = employees.find((employee) => employee.name == username);
  if (employee) {
    employee.salary = parseFloat(salary);
    console.log(
      `Salary of ${employee.name} changed to € ${formatCurrency(
        employee.salary
      )}\n`
    );
  } else {
    console.log("Employee not found.\n");
  }
};

let login = (username) => {
  if (current_user) {
    console.log("You have to logout first.\n");
    return;
  }
  let user_found = false;
  customers.forEach((element) => {
    if (element.name == username) {
      current_user = element;
      console.log("You are logged in as user " + current_user.name + ".\n");
      user_found = true;
    }
  });

  if (!user_found) {
    console.log("User not found.\n");
  }
};

let logout = () => {
  current_user = null;
  console.log("Logged out.\n");
};

let myaccounts = () => {
  if (!current_user) {
    console.log("You are not logged in!\n");
    return;
  }
  const headline = "\nACCOUNTS FOR USER " + current_user.name.toUpperCase();
  console.log(headline);
  console.log("=".repeat(headline.length - 1));
  numberOfAccounts = 0;
  accounts.forEach((element) => {
    if (element.customer.name == current_user.name) {
      console.log(
        `Account ${element.account_number}: € ${formatCurrency(
          element.balance
        )} `
      );
      numberOfAccounts++;
    }
  });
  if (numberOfAccounts == 0) {
    console.log("You do not have any accounts yet!");
  }
  console.log();
};

let open = () => {
  if (!current_user) {
    console.log("You must be logged in to open a new account.\n");
  } else {
    let new_account_number;
    let unique = false;

    while (!unique) {
      new_account_number = Math.floor(Math.random() * 10000).toString();
      unique = !accounts.some(
        (account) => account.account_number == new_account_number
      );
    }

    accounts.push(new Account(current_user, new_account_number, 0));
    console.log(
      "New account created with account number: " + new_account_number + "\n"
    );
  }
};

let close = (account_number) => {
  if (!current_user) {
    console.log("You must be logged in to close an existing account.\n");
  } else {
    let account_found = false;
    accounts.forEach((element, index) => {
      if (element.account_number == account_number) {
        account_found = true;
        if (element.customer != current_user) {
          console.log("You are not the owner of this account!\n");
          return;
        }
        if (element.balance != 0) {
          console.log(
            "The balance of your account has to be € 0.00 before you can close it.\n"
          );
          return;
        } else {
          accounts.splice(index, 1);
          console.log(`Account ${account_number} has been closed.\n`);
          return;
        }
      }
    });

    if (!account_found) {
      console.log("Accountnumber not found.\n");
    }
  }
};

let deposit = (account_number, amount) => {
  if (!current_user) {
    console.log("You must be logged in to deposit money.\n");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    console.log("ERROR: The amount must be a number greater than 0.\n");
    return;
  }

  let account_found = false;

  accounts.forEach((element) => {
    if (element.account_number == account_number) {
      account_found = true;

      if (element.customer != current_user) {
        console.log("You are not the owner of this account!\n");
        return;
      }

      current_account = element;
      current_balance = element.balance;
      new_balance = current_balance += amount;
      element.balance = new_balance;

      console.log(
        `The amount of € ${formatCurrency(
          amount
        )} has been added to your account ${
          element.account_number
        }.\nYour new balance is € ${formatCurrency(element.balance)}.\n`
      );
    }
  });

  if (!account_found) {
    console.log("Accountnumber not found.\n");
  }
};

let withdraw = (account_number, amount) => {
  if (!current_user) {
    console.log("You must be logged in to withdraw money.\n");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    console.log("ERROR: The amount must be a number greater than 0.\n");
    return;
  }

  let account_found = false;

  accounts.forEach((element) => {
    if (element.account_number == account_number) {
      account_found = true;

      if (element.customer != current_user) {
        console.log("You are not the owner of this account!\n");
        return;
      }

      current_account = element;
      current_balance = element.balance;
      new_balance = current_balance -= amount;
      element.balance = new_balance;

      console.log(
        `The amount of € ${formatCurrency(
          amount
        )} has been withdrawn from your account ${
          element.account_number
        }.\nYour new balance is € ${formatCurrency(element.balance)}.\n`
      );
    }
  });

  if (!account_found) {
    console.log("Accountnumber not found.\n");
  }
};

let transfer = (my_account_number, target_account_number, amount) => {
  if (!current_user) {
    console.log("You must be logged in to transfer money.\n");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    console.log("ERROR: The amount must be a number greater than 0.\n");
    return;
  }

  let my_account_found = false;
  let target_account_found = false;
  let my_account = null;
  let target_account = null;

  accounts.forEach((element) => {
    if (element.account_number == my_account_number) {
      my_account_found = true;

      if (element.customer != current_user) {
        console.log("You are not the owner of this account!\n");
        return;
      }

      my_account = element;
    }
  });

  accounts.forEach((element) => {
    if (element.account_number == target_account_number) {
      target_account_found = true;

      target_account = element;
    }
  });

  if (my_account && target_account) {
    my_account.balance -= amount;
    target_account.balance += amount;

    console.log(
      `The amount of € ${formatCurrency(
        amount
      )} has been successfully transfered from your account ${
        my_account.account_number
      } to account ${
        target_account.account_number
      }.\nYour new balance is € ${formatCurrency(my_account.balance)}.\n`
    );
  }

  if (!my_account_found) {
    console.log("Accountnumber not found.\n");
  } else if (!target_account_found) {
    console.log("Target Account does not exist.\n");
  }
};

let save = () => {
  const dataToSave = {
    customers: customers.map((customer) => ({
      name: customer.name,
      accounts: accounts
        .filter((account) => account.customer === customer)
        .map((account) => ({
          account_number: account.account_number,
          balance: account.balance,
        })),
    })),
    employees: employees.map((employee) => ({
      name: employee.name,
      position: employee.position,
      salary: employee.salary,
    })),
  };

  saveJSON("data.json", dataToSave);
  console.log("Data saved to data.json\n");
};

let whoami = () => {
  current_user
    ? console.log("You are logged in as user " + current_user.name + ".\n")
    : console.log("You are not logged in!\n");
};

let help = () => {
  console.log("\nPossible commands are:\n");

  let column1Length = 17;
  let column2Length = 45;
  let column3Length = 12;
  let column4Length = 55;
  let column1Text = "COMMAND";
  let column2Text = "DESCRIPTION";
  let column3Text = "PARAMETERS";
  let column4Text = "EXAMPLE";

  console.log(
      column1Text +
      " ".repeat(column1Length - column1Text.length) +
      "| " +
      column2Text +
      " ".repeat(column2Length - column2Text.length - 1) +
      "| " +
      column3Text +
      " ".repeat(column3Length - column3Text.length - 1) +
      "| " +
      column4Text
  );

  console.log(
    "-".repeat(column1Length) +
      "+" +
      "-".repeat(column2Length) +
      "+" +
      "-".repeat(column3Length) +
      "+" +
      "-".repeat(column4Length)
  );

  for (let cmd in commands) {
    console.log(
      `${cmd + " ".repeat(column1Length - cmd.length)}| ${
        commands[cmd].description +
        " ".repeat(column2Length - commands[cmd].description.length - 1)
      }| ${
        commands[cmd].neededParameters +
        " ".repeat(column3Length - commands[cmd].neededParameters.toString.length - 1)
      }| ${commands[cmd].example ? commands[cmd].example : ""}`
    );
  }
  console.log();
};

let exit = () => {
  console.log("Exiting program...\n");
  rl.close();
  process.exit(0);
};

// TEST HILFSFUNKTION FÜR TABELLEN
let test = () => {
  const createTable = (headers, columnLengths, rows) => {

    let headerRow = headers
      .map((header, index) => header + " ".repeat(columnLengths[index] - header.length))
      .join(" | ");
    console.log("\n" + headerRow);
  

    let separatorRow = columnLengths.map(length => "-".repeat(length)).join("-+-");
    console.log(separatorRow);
  

    rows.forEach(row => {
      let rowText = row
        .map((cell, index) => cell + " ".repeat(columnLengths[index] - cell.length))
        .join(" | ");
      console.log(rowText);
    });
  
    console.log();
  };
  
    let headers = ["CUSTOMER", "NO. OF ACCOUNTS", "TOTAL BALANCE"];
    let columnLengths = [18, 20, 18];
    let rows = customers.map(customer => {
      let customerAccounts = accounts.filter(account => account.customer === customer);
      let accountCount = customerAccounts.length;
      let totalBalance = customerAccounts.reduce((sum, account) => sum + account.balance, 0);
      return [
        customer.name,
        accountCount.toString(),
        `€ ${formatCurrency(totalBalance)}`
      ];
    });
  
    createTable(headers, columnLengths, rows);
};

// ----------------------------------------------------------------------------------------------------------------------

// CHECK PARAMETERS AND RUN ACTION

const parameterError = "ERROR - wrong number of parameters!\n";

const action = (runAction, neededParameters, parameters) => {
  if (parameters.length == neededParameters) {
    runAction(...parameters);
  } else {
    console.log(parameterError);
  }
};

// COMMANDS

let executeCommand = (input) => {
  const [command, ...params] = input.trim().split(" ");

  commands = {
    accountlist: {
      neededParameters: 0,
      description: "List all accounts",
      action: () => accountlist(),
    },

    employees: {
      neededParameters: 0,
      description: "List all employees",
      action: () => employeelist(),
    },

    customers: {
      neededParameters: 0,
      description: "List all customers",
      action: () => customerlist(),
    },

    create: {
      neededParameters: 2,
      description: "Create a new customer or employee",
      example: "create customer/employee [username]",
      action: (role, username) => create(role, username),
    },

    login: {
      neededParameters: 1,
      description: "Login as a customer",
      example: "login [username]",
      action: (username) => login(username),
    },

    myaccounts: {
      neededParameters: 0,
      description: "List all your accounts",
      action: () => myaccounts(),
    },

    open: {
      neededParameters: 0,
      description: "Open a new account",
      action: () => open(),
    },

    close: {
      neededParameters: 1,
      description: "Close an existing account",
      example: "close [accountnumber]",
      action: (accountnumber) => close(accountnumber),
    },

    deposit: {
      neededParameters: 2,
      description: "Deposit money into an account",
      example: "deposit [accountnumber] [amount]",
      action: (accountnumber, amount) =>
        deposit(accountnumber, parseFloat(amount)),
    },

    withdraw: {
      neededParameters: 2,
      description: "Withdraw money from an account",
      example: "withdraw [accountnumber] [amount]",
      action: (accountnumber, amount) =>
        withdraw(accountnumber, parseFloat(amount)),
    },

    transfer: {
      neededParameters: 3,
      description: "Transfer money between accounts",
      example: "transfer [accountnumber1] [accountnumber2] [amount]",
      action: (accountnumber, targetAccount, amount) =>
        transfer(accountnumber, targetAccount, parseFloat(amount)),
    },

    whoami: {
      neededParameters: 0,
      description: "Display the logged in user",
      action: () => whoami(),
    },

    logout: {
      neededParameters: 0,
      description: "Logout the current user",
      action: () => logout(),
    },

    save: {
      neededParameters: 0,
      description: "Save data to JSON file",
      action: () => save(),
    },

    setposition: {
      neededParameters: 2,
      description: "Changes the position of an employee",
      example: "setposition [username] [new_position]",
      action: (username, position) => setposition(username, position),
    },

    setsalary: {
      neededParameters: 2,
      description: "Changes the salary of an employee",
      example: "setsalary [username] [new_salary]",
      action: (username, salary) => setsalary(username, salary),
    },

    help: {
      neededParameters: 0,
      description: "Display this help message",
      action: () => help(),
    },

    // test: {
    //   neededParameters: 0,
    //   description: "[for testing purpose only]",
    //   action: () => test(),
    // },

    exit: {
      neededParameters: 0,
      description: "Exit the program",
      action: () => exit(),
    },
  };

  if (commands[command.toLowerCase()]) {
    action(
      commands[command.toLowerCase()].action,
      commands[command.toLowerCase()].neededParameters,
      params
    );
  } else {
    console.log("ERROR: Unknown Command\n");
  }

  rl.prompt();
};

// ----------------------------------------------------------------------------------------------------------------------

// COMMAND-LINE

console.log("\nBANK-MANAGEMENT-SYSTEM");
console.log("======================\n");
console.log('INFO: type "help" for an overview of the available commands!\n');
rl.setPrompt("Enter command: ");
rl.prompt();

rl.on("line", (input) => {
  executeCommand(input);
});
