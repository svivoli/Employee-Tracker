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

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    queryDepartments();
    queryRoles();
    queryEmployees();
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
                "Update a role",
                "Update an employee",
                "Update an employee manager",
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
            } else if (val.type === "Update a role") {
                updateRole();
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
                    console.log(res.affectedRows + " Database updated.\n");
                    promptAction();
                })
            departments.push(JSON.stringify(val.name));
            console.log(departments);
            // connection.query("SELECT * FROM department WHERE name=?", [val.name], function (err, res) {
            //     if (err) throw err;
            //     departments.push(JSON.stringify(res.name));
            //     console.log(departments);
            // })

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
            console.log(roles);
            connection.query("SELECT * FROM department WHERE name = ?", [val.department], function (err, res) {
                if (err) throw err;
                // console.log(res);
                connection.query("INSERT INTO role SET ?",
                    {
                        title: val.title,
                        salary: val.salary,
                        department_id: res[0].id
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " Database updated.\n");
                        promptAction();
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
            // console.log(val);
            connection.query("SELECT * FROM role WHERE title = ?", [val.role], function (err, res) {
                console.log(res[0].department_id);
                if (err) throw err;
                connection.query("SELECT * FROM employee WHERE first_name + last_name = ?", [val.manager], function (err, res2) {
                    if (err) throw err;
                    connection.query("SELECT d.id, d.name, r.department_id FROM department d INNER JOIN role r ON r.department_id=d.id", function (err, res3) {
                        if (err) throw err;
                        console.log(res3);
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
                                console.log(res.affectedRows + " Database updated.\n");
                                promptAction();
                            })
                    })
                })
                employees.push(JSON.stringify(val.first + " " + val.last));
                // console.log(employees);
            })
        })
};

function viewAllEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        promptAction();
    })
}

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        promptAction();
    })
}

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        promptAction();
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
            for (i = 0; i < departments.length; i++) {
                if (val.empldepartment === departments[i]) {
                    connection.query("SELECT * FROM employee INNER JOIN department ON employee.department=?", [val.empldepartment], function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        promptAction();
                    })
                }
            }
        })
};


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
                console.log("Current role:")
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
                            viewRoles();
                            promptAction();
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
            console.log("Current total utilized budget of " + val.budgetdepartment + " = " + budget);
            promptAction();
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
        })
        .then(val => {
            connection.query("SELECT * FROM department", function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("Database Updated.\n");
                promptAction();
            })
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
            connection.query("SELECT * FROM role", function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("Database updated.\n");
                promptAction();
            })
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
            connection.query("DELETE FROM employee WHERE last_name LIKE ?", [val.deleteemployee], function (err, res) {
                if (err) throw err;
            })
        })
        .then(val => {
            connection.query("SELECT * FROM employee", function (err, res) {
                if (err) throw err;
                console.table(res);
                console.log("Database updated.\n");
                promptAction();
            })
        })
};