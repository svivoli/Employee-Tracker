USE employees_db;

INSERT INTO department (name)
VALUES
("Accounting"),
("Marketing"),
("Finance"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
("Sr. Accountant", 70000, 1),
("Jr. Accountant", 55000, 1),
("Marketing Director", 60000, 2),
("Product Manager", 55000, 2),
("Accts Payable", 55000, 3),
("Accts Receivable", 55000, 3),
("Senior Lawyer", 100000, 4),
("Contracts Negotiator", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, role, salary, department_id, department, manager_id, manager)
VALUES
("Bill", "Waters", 1, "Sr. Accountant", 70000, 1, "Accounting", NULL, NULL),
("Stacy", "Quinn", 2, "Jr. Accountant", 55000, 1, "Accounting", 1, "Bill Waters"),
("Tom", "Lincoln", 3, "Marketing Director", 60000, 2, "Marketing", NULL, NULL),
("Jerry", "Johnson", 4, "Product Manager", 55000, 2, "Marketing", 3, "Tom Lincoln"),
("Mary", "Alberts", 5, "Accts Payable", 55000, 3, "Finance", NULL, NULL),
("Pat", "McDuff", 6, "Accts Receivable", 55000, 3, "Finance", 5, "Mary Alberts"),
("Hank", "Olson", 7, "Senior Lawyer", 100000, 4, "Legal", NULL, NULL),
("Reginald", "Obrien", 8, "Contracts Negotiator", 80000, 4 "Legal", 7, "Hank Olson");

