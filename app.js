var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "surfv1D@",
    database: "employees_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    promptType();
});

function promptType() {
    return inquirer.prompt([
        {
            type: "list",
            name: "type",
            message: "What would you like to add?",
            choices: [
                "Department",
                "Role",
                "Employee"
            ]
        }
    ])
        .then(val => {
            if (val.type === "Department") {
                promptDepartment();
            } else if (val.type === "Role") {
                promptRole();
            } else if (val.type === "Employee") {
                promptEmployee();
            }
        })
};

const departments = [];
const departmentid = [];
function queryDepartments() {
    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        for (i=0; i<res.length; i++) {
            departments.push(res[i].name);
        }
    })
};
queryDepartments();

function promptDepartment() {
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
                    // Call updateProduct AFTER the INSERT completes
                })
                departments.push(JSON.stringify(val.name));
                console.log(departments);
            // connection.query("SELECT * FROM department WHERE name=?", [val.name], function (err, res) {
            //     if (err) throw err;
            //     departments.push(JSON.stringify(res.name));
            //     console.log(departments);
                promptType();
            // })

        })
};

function promptRole() {
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
            connection.query("SELECT * FROM department WHERE name=?", [val.department], function (err, res) {
                if (err) throw err;
                for (i=0; i<res.length; i++) {
                departmentid.unshift(JSON.stringify(res[i].id));
                }
                console.log(departmentid);
            })
            connection.query("INSERT INTO role SET ?",
                {
                    title: val.title,
                    salary: val.salary,
                    department_id: departmentid[0]
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " Database updated.\n");
                    // Call updateProduct AFTER the INSERT completes
                    promptType();
                })
        })
}