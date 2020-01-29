var mysql = require("mysql");
var inquirer = require('inquirer');
var chalk = require('chalk');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employees_db"
});

const title = `
.xxxxxx .xxx     .xxx .xxxxxx  .xx      .xxxxx  .xx    xx .xxxxxx .xxxxxx
.xx     .xxxxx .xxxxx .xx  .xx .xx     .xx  .xx  .xx  xx  .xx     .xx
.xxxxxx .xx  .xx  .xx .xx  .xx .xx     .xx  .xx   .xxxx   .xxxxxx .xxxxxx
.xx     .xx       .xx .xxxxxx  .xx     .xx  .xx    .xx    .xx     .xx
.xxxxxx .xx       .xx .xx      .xxxxxx  .xxxxx     .xx    .xxxxxx .xxxxxx

.xxxxxxxx .xxxxxx   .xxxxx   .xxxx   .xx  .xx .xxxxxx .xxxxxx
   .xx    .xx  .xx .xx  .xx .xx  .xx .xx .xx  .xx     .xx   xx
   .xx    .xx  .xx .xx  .xx .xx      .xxxx    .xxxxxx .xx   xx
   .xx    .xxxxxx  .xxxxxxx .xx  .xx .xx .xx  .xx     .xxxxxx
   .xx    .xx  .xx .xx  .xx  .xxxx   .xx  .xx .xxxxxx .xx   xx
`

const goodbye = `
 .xxxxx   .xxxxx   .xxxxx  .xxxxx   .xxxxxx  .xx   .xx .xxxxxx
.xx      .xx  .xx .xx  .xx .xx  .xx .xx  .xx  .xx .xx  .xx
.xx .xxx .xx  .xx .xx  .xx .xx  .xx .xxxxxx    .xxxx   .xxxxxx
.xx  .xx .xx  .xx .xx  .xx .xx  .xx .xx  .xx    .xx    .xx
 .xxxxx   .xxxxx   .xxxxx  .xxxxx   .xxxxxx     .xx    .xxxxxx
`

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    queryDepartments();
    queryRoles();
    queryEmployees();
    console.log(chalk.green(title));
    promptAction();
});

const departments = [];

function queryDepartments() {
    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            departments.push(res[i].name);
        }
    })
};

const roles = [];

function queryRoles() {
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            roles.push(res[i].title);
        }
    })
};

const employees = ["Null"];

function queryEmployees() {
    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            employees.push(res[i].first_name + " " + res[i].last_name);
        }
    })
};

function promptAction() {
    return inquirer.prompt([
        {
            type: "list",
            name: "type",
            message: "What would you like to do?",
            choices: [
                "Add a department",
                "Add a role",
                "Add an employee",
                "View all departments",
                "View all roles",
                "View all employees",
                "View employees by department",
                "View employees by manager",
                "Update a role",
                "Update an employee's manager",
                "Update an employee",
                "View the total utilized budget of a department",
                "Delete a department",
                "Delete a role",
                "Delete an employee"
            ]
        }
    ])
        .then(val => {
            if (val.type === "Add a department") {
                addDepartment();
            } else if (val.type === "Add a role") {
                addRole();
            } else if (val.type === "Add an employee") {
                addEmployee();
            } else if (val.type === "View all departments") {
                viewDepartments();
            } else if (val.type === "View all roles") {
                viewRoles();
            } else if (val.type === "View all employees") {
                viewAllEmployees();
            } else if (val.type === "View employees by department") {
                viewEmplByDept();
            } else if (val.type === "View employees by manager") {
                viewEmplByMan();
            } else if (val.type === "Update a role") {
                updateRole();
            } else if (val.type === "Update an employee's manager") {
                updateManager();
            } else if (val.type === "View the total utilized budget of a department") {
                viewBudget();
            } else if (val.type === "Delete a department") {
                deleteDepartment();
            } else if (val.type === "Delete a role") {
                deleteRole();
            } else if (val.type === "Delete an employee") {
                deleteEmployee();
            }
        })
};

function next() {
    inquirer.prompt([
        {
            type: "list",
            name: "next",
            message: "What would you like to do next?",
            choices: [
                "Return to menu",
                "Exit"
            ]
        }
    ])
        .then(val => {
            if (val.next === "Return to menu") {
                promptAction();
            } else if (val.next === "Exit") {
                console.log(chalk.cyan(goodbye));
                console.log(chalk.blue("Thank you for using Employee Tracker!"));
                process.exit();
            }
        })
};

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department?"
        }
    ])
        .then(val => {
            connection.query("INSERT INTO department SET ?",
                {
                    name: val.name
                },
                function (err, res) {
                    if (err) throw err;
                    viewDepartments();
                    console.log(chalk.magenta("Database Updated.\n"));
                    next();
                })
            departments.push(JSON.stringify(val.name));
        })
};

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the title of the role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department",
            message: "What department does the role belong to?",
            choices: departments
        }
    ])
        .then(val => {
            roles.push(JSON.stringify(val.title));
            connection.query("SELECT * FROM department WHERE name = ?", [val.department], function (err, res) {
                if (err) throw err;
                connection.query("INSERT INTO role SET ?",
                    {
                        title: val.title,
                        salary: val.salary,
                        department_id: res[0].id
                    },
                    function (err, res) {
                        if (err) throw err;
                        viewRoles();
                        console.log(chalk.magenta("Database Updated.\n"));
                        next();
                    })
            })
        })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roles
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: employees
        }
    ])
        .then(val => {
            const manName = val.manager.split(" ");
            connection.query("SELECT * FROM role WHERE title = ?", [val.role], function (err, res) {
                if (err) throw err;
                connection.query("SELECT * FROM employee WHERE first_name = ? AND last_name = ?", [manName[0], manName[1]], function (err, res2) {
                    if (err) throw err;
                    connection.query("SELECT d.id, d.name, r.department_id FROM department d INNER JOIN role r ON r.department_id=d.id", function (err, res3) {
                        if (err) throw err;
                        connection.query("INSERT INTO employee SET ?",
                            {
                                first_name: val.first,
                                last_name: val.last,
                                role_id: res[0].id,
                                role: val.role,
                                salary: res[0].salary,
                                department_id: res[0].department_id,
                                department: res3[0].name,
                                manager_id: res2[0].id,
                                manager: val.manager
                            },
                            function (err, res) {
                                if (err) throw err;
                                viewAllEmployees();
                                console.log(chalk.magenta("Database Updated.\n"));
                                next();
                            })
                    })
                })
                employees.push(JSON.stringify(val.first + " " + val.last));
            })
        })
};

function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        next();
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        next();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        next();
    })
};

function viewEmplByDept() {
    inquirer.prompt([
        {
            type: "list",
            name: "empldepartment",
            message: "Which department would you like to view?",
            choices: departments
        }
    ])
        .then(val => {
            connection.query("SELECT * FROM employee WHERE department = ?", [val.empldepartment], function (err, res) {
                if (err) throw err;
                console.table(res);
                next();
            })
        })
};

function viewEmplByMan() {
    inquirer.prompt([
        {
            type: "list",
            name: "emplmanager",
            message: "Which manager would you like to view?",
            choices: employees
        }
    ])
        .then(val => {
            connection.query("SELECT * FROM employee WHERE manager = ?", [val.emplmanager], function (err, res) {
                if (err) throw err;
                console.table(res);
                next();
            })
        })
}


function updateRole() {
    inquirer.prompt([
        {
            type: "list",
            name: "updaterole",
            message: "Which role would you like to update?",
            choices: roles
        }
    ])
        .then(val => {
            connection.query("SELECT * FROM role WHERE title = ?", [val.updaterole], function (err, res) {
                if (err) throw err;
                console.log(chalk.cyan("Current role:"))
                console.table(res);
                inquirer.prompt([
                    {
                        type: "input",
                        name: "title",
                        message: "What is the title of the role?"
                    },
                    {
                        type: "input",
                        name: "salary",
                        message: "What is the salary of the role?"
                    },
                    {
                        type: "list",
                        name: "department",
                        message: "What department does the role belong to?",
                        choices: departments
                    }
                ])
                    .then(val2 => {
                        connection.query("SELECT * FROM department WHERE name = ?", [val2.department], function (err, res2) {
                            if (err) throw err;
                            connection.query("UPDATE role SET title = ?, salary = ?, department_id = ? WHERE title = ?", [val2.title, val2.salary, res2[0].id, val.updaterole])
                            console.log(chalk.magenta("Database Updated.\n"));
                            viewRoles();
                            next();
                        })
                    })
            })
        })
};

function updateManager() {
    inquirer.prompt([
        {
            type: "list",
            name: "managerchange",
            message: "Which employee would you like to make changes to?",
            choices: employees
        }
    ])
        .then(val => {
            const emplName = val.managerchange.split(" ");
            connection.query("SELECT id, first_name, last_name, manager_id, manager FROM employee WHERE first_name = ? AND last_name = ?", [emplName[0], emplName[1]], function (err, res) {
                if (err) throw err;
                console.log(chalk.cyan("Current manager:"));
                console.table(res);
                inquirer.prompt([
                    {
                        type: "list",
                        name: "newmanager",
                        message: "Who is the new manager?",
                        choices: employees
                    }
                ])
                    .then(val2 => {
                        const managerName = val2.newmanager.split(" ");
                        connection.query("SELECT * FROM employee WHERE first_name = ? AND last_name = ?", [managerName[0], managerName[1]], function (err, res4) {
                            if (err) throw err;
                            connection.query("UPDATE employee SET manager_id = ?, manager = ? WHERE id = ?", [res4[0].id, val2.newmanager, res[0].id], function (err, res2) {
                                if (err) throw err;
                                connection.query("SELECT id, first_name, last_name, manager_id, manager FROM employee WHERE id = ?", [res[0].id], function (err, res3) {
                                    if (err) throw err;
                                    console.table(res3);
                                    console.log(chalk.magenta("Database Updated.\n"));
                                    next();
                                })
                            })
                        })
                    })
            })
        })
};

function viewBudget() {
    inquirer.prompt([
        {
            type: "list",
            name: "budgetdepartment",
            message: "Which department's total utilized budget would you like to view?",
            choices: departments
        }
    ])
        .then(val => {
            connection.query("SELECT SUM(salary) FROM employee WHERE department = ?", [val.budgetdepartment], function (err, res) {
                if (err) throw err;
                const budget = res[0]['SUM(salary)'];
                console.log(chalk.blue("Current total utilized budget of " + val.budgetdepartment + " = " + budget));
                next();
            })
        })
};

function deleteDepartment() {
    inquirer.prompt([
        {
            type: "list",
            name: "deletedepartment",
            message: "Which department would you like to delete?",
            choices: departments
        }
    ])
        .then(val => {
            connection.query("DELETE FROM department WHERE name = ?", [val.deletedepartment], function (err, res) {
                if (err) throw err;
            })
            for (i = 0; i < departments.length; i++) {
                if (val.deletedepartment === departments[i]) {
                    departments.splice(i, 1)
                }
            }
            viewDepartments();
            console.log(chalk.magenta("Database Updated.\n"));
            next();
        })
};

function deleteRole() {
    inquirer.prompt([
        {
            type: "list",
            name: "deleterole",
            message: "Which role would you like to delete",
            choices: roles
        }
    ])
        .then(val => {
            connection.query("DELETE FROM role WHERE title = ?", [val.deleterole], function (err, res) {
                if (err) throw err;
            })
            for (i = 0; i < roles.length; i++) {
                if (val.deleterole === roles[i]) {
                    roles.splice(i, 1)
                }
            }
            viewRoles();
            console.log(chalk.magenta("Database Updated.\n"));
            next();
        })
};

function deleteEmployee() {
    inquirer.prompt([
        {
            type: "list",
            name: "deleteemployee",
            message: "Which employee would you like to delete?",
            choices: employees
        }
    ])
        .then(val => {
            const emplName = val.deleteemployee.split(" ");
            connection.query("DELETE FROM employee WHERE first_name = ? AND last_name = ?", [emplName[0], emplName[1]], function (err, res) {
                if (err) throw err;
            })
            for (i = 0; i < employees.length; i++) {
                if (val.deleteemployee === employees[i]) {
                    employees.splice(i, 1)
                }
            }
            viewAllEmployees();
            console.log(chalk.magenta("Database Updated.\n"));
            next();
        })
};