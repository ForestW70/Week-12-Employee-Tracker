DROP DATABASE IF EXISTS hw12_db;
CREATE DATABASE hw12_db;
USE hw12_db;


CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(9,2),
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);


INSERT INTO departments(name)
VALUES 
("Manager"),
("Sales"),
("Engineering"),
("Finance"),
("Legal"),
("HR");

INSERT INTO roles(title, salary, department_id)
VALUES
("Manager", 900000, 1),
("Sales person", 34567.89, 2),
("Full Stack Developer", 120000, 3),
("Accountant", 100000, 4),
("Lawyer", 50.99, 5),
("HR", 70000, 6);

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES 
("Forest", "Wilson", 1, 1), 
("Worest", "Filson", 2, NULL), 
("S'morest", "S'milson", 3, NULL),
("Barack", "Obama", 4, 2),
("Kony", "Twentytwelve", 5, NULL),
("Karen", "McKarensson", 6, 3),
("Bebe", "Johnstone", 1, NULL),
("Helga", "Zimboski", 2, NULL),
("Montgomry", "McGee", 3, NULL),
("Simple", "John", 4, NULL),
("Alyssa", "Kurke", 5, 4);