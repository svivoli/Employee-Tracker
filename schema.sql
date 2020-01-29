DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id, name), INDEX(id), INDEX(name)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL(20, 2),
    department_id INT,
    PRIMARY KEY (id, title, salary), INDEX(id), INDEX(title), INDEX(salary),
    CONSTRAINT fk_departmentid FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
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
    CONSTRAINT fk_roleid FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
    CONSTRAINT fk_role FOREIGN KEY (role) REFERENCES role(title) ON DELETE SET NULL,
    CONSTRAINT fk_salary FOREIGN KEY (salary) REFERENCES role(salary) ON DELETE SET NULL,
    CONSTRAINT fk_departmentid2 FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL,
    CONSTRAINT fk_department FOREIGN KEY (department) REFERENCES department(name) ON DELETE SET NULL
);