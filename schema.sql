DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL(20, 2) NOT NULL,
    department_id INT,
    PRIMARY KEY (id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INT,
    role VARCHAR(100),
    salary DECIMAL(20, 2),
    department_id INT,
    department VARCHAR(100),
    manager_id INT,
    manager VARCHAR(100),
    PRIMARY KEY (id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUE("Accounting");

INSERT INTO role (title, salary, department_id)
VALUE("Sr. Accountant", 70000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id, salary, department)
VALUE("Bill", "Waters", 1, NULL, 70000, "Accounting");

