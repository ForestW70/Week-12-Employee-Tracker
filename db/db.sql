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
    PRIMARY KEY (id)
    
);

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    has_boss INT NULL,
    manager_id INT NULL,
    PRIMARY KEY (id)
    
);


INSERT INTO departments(id, name)
VALUES 
(1, "CEO"),
(2, "Sales"),
(3, "Engineering"),
(4, "Finance"),
(5, "Legal"),
(6, "HR"),
(7, "None");

INSERT INTO roles(title, salary, department_id)
VALUES
("CEO", 900000, 1),
("Sales person", 34567.89, 2),
("Full Stack Developer", 120000, 3),
("Accountant", 100000, 4),
("Lawyer", 50.99, 5),
("HR", 70000, 6),
("Manager", 166769.05, 7);

INSERT INTO employees (first_name, last_name, role_id, manager_id, has_boss) 
VALUES 
("Forest", "Wilson", 1, 1, NULL), 
("Worest", "Filson", 2, NULL, 4), 
("S'morest", "S'milson", 3, NULL, 3),
("Barack", "Obama", 3, 3, 1),
("Kony", "Twentytwelve", 5, NULL, 5),
("Karen", "McKarensson", 6, NULL, NULL),
("Bebe", "Johnstone", 5, 4, 1),
("Helga", "Zimboski", 2, NULL, 4),
("Montgomry", "McGee", 3, NULL, 3),
("Simple", "John", 4, 6, 1),
("Alyssa", "Kurke", 5, 5, 1);