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
const data = loadJSON("data.json")[0];
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
  const employee = new Employee(employeeData.name, employeeData.position);
  employees.push(employee);
});

// VARIABLES
let current_user = null;
let commands;

// ----------------------------------------------------------------------------------------------------------------------

// FUNCTIONS

let accountlist = () => {
  console.log("\nACCOUNT  | OWNER                     | BALANCE");
  console.log("---------+---------------------------+---------");
  accounts.forEach((element) => {
    console.log(
      `${
        element.account_number + " ".repeat(9 - element.account_number.length)
      }| ${
        element.customer.name + " ".repeat(26 - element.customer.name.length)
      }| € ${element.balance}`
    );
  });
  console.log();
};

let userlist = () => {
  console.log("\nCUSTOMERS\n=========");
  customers.forEach((element) => {
    console.log("- " + element.name);
  });
  console.log("\nEMPLOYEES\n=========");
  employees.forEach((element) => {
    console.log(`- ${element.name} (${element.position})`);
  });
  console.log();
};

let create = (new_user) => {
  customers.push(new Customer(new_user));
  console.log("New user " + new_user + " has been created.\n");
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
}

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
      console.log(`Account ${element.account_number}: € ${element.balance} `);
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
        `The amount of € ${amount} has been added to your account ${element.account_number}.\nYour new balance is € ${element.balance}.\n`
      );
    }
  });

  if (!account_found) {
    console.log("Accountnumber not found.\n");
  }
};

let withdraw = (account_number, amount) => {
  if (!current_user) {
    console.log("You must be logged in to withdraw.\n");
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
        `The amount of € ${amount} has been withdrawn from your account ${element.account_number}.\nYour new balance is € ${element.balance}.\n`
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
      `The amount of € ${amount} has been successfully transfered from your account ${my_account.account_number} to account ${target_account.account_number}.\nYour new balance is € ${my_account.balance}.\n`
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
    })),
  };

  saveJSON("data.json", [dataToSave]);
  console.log("Data saved to data.json\n");
};

let whoami = () => {
  current_user
    ? console.log("You are logged in as user " + current_user.name + ".\n")
    : console.log("You are not logged in!\n");
}

let help = () => {
  console.log("\nPossible commands are:\n");
  console.log("COMMAND             | DESCRIPTION                             | PARAMETERS | EXAMPLE");
  console.log("--------------------+-----------------------------------------+------------+----------------------------------------------");
  for (let cmd in commands) {
    console.log(
      `${
        cmd + " ".repeat(20 - cmd.length)
      }| ${
        commands[cmd].description + " ".repeat(40 - commands[cmd].description.length)
      }| ${
        commands[cmd].neededParameters  + " ".repeat(11 - commands[cmd].neededParameters.toString.length)
      }| ${
        (commands[cmd].example) ? commands[cmd].example : ""
      }`
    );
  }
  console.log();
}

let exit = () => {
  console.log("Exiting program...\n");
  rl.close();
  process.exit(0);
}

let test = () => {
  console.log("CUSTOMERS:");
  console.log(customers);
  console.log("EMPLOYEES:");
  console.log(employees);
  console.log("DATA:");
  console.log(data);
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
      action: () => accountlist()
    },

    userlist: {
      neededParameters: 0,
      description: "List all customers and employees",
      action: () => userlist()
    },

    create: {
      neededParameters: 1,
      description: "Create a new customer",
      example: "create [username]",
      action: (username) => create(username)
    },

    login: {
      neededParameters: 1,
      description: "Login as a customer",
      example: "login [username]",
      action: (username) => login(username)
    },

    myaccounts: {
      neededParameters: 0,
      description: "List all your accounts",
      action: () => myaccounts()
    },

    open: {
      neededParameters: 0,
      description: "Open a new account",
      action: () => open()
    },

    close: {
      neededParameters: 1,
      description: "Close an existing account",
      example: "close [accountnumber]",
      action: (accountnumber) => close(accountnumber)
    },

    deposit: {
      neededParameters: 2,
      description: "Deposit money into an account",
      example: "deposit [accountnumber] [amount]",
      action: (accountnumber, amount) => deposit(accountnumber, parseFloat(amount))
    },

    withdraw: {
      neededParameters: 2,
      description: "Withdraw money from an account",
      example: "withdraw [accountnumber] [amount]",
      action: (accountnumber, amount) => withdraw(accountnumber, parseFloat(amount))
    },

    transfer: {
      neededParameters: 3,
      description: "Transfer money between accounts",
      example: "transfer [accountnumber1] [accountnumber2] [amount]",
      action: (accountnumber, targetAccount, amount) => transfer(accountnumber, targetAccount, parseFloat(amount))
    },

    whoami: {
      neededParameters: 0,
      description: "Display the logged in user",
      action: () => whoami()
    },

    logout: {
      neededParameters: 0,
      description: "Logout the current user",
      action: () => logout()
    },

    save: {
      neededParameters: 0,
      description: "Save data to JSON file",
      action: () => save()
    },

    help: {
      neededParameters: 0,
      description: "Display this help message",
      action: () => help()
    },

    test: {
      neededParameters: 0,
      description: "[for testing purpose only]",
      action: () => test()
    },

    exit: {
      neededParameters: 0,
      description: "Exit the program",
      action: () => exit()
    }
  };

  if (commands[command.toLowerCase()]) {
    action(commands[command.toLowerCase()].action, commands[command.toLowerCase()].neededParameters, params);
  } else {
    console.log("ERROR: Unknown Command\n");
  }
  
  rl.prompt();
};


// ----------------------------------------------------------------------------------------------------------------------

// COMMAND-LINE

console.log("\nBANK-MANAGEMENT-SYSTEM");
console.log("======================\n");
console.log("INFO: type \"help\" for an overview of the available commands!\n");
rl.setPrompt("Enter command: ");
rl.prompt();

rl.on("line", (input) => {
  executeCommand(input);
});
