DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department
(
   id INT PRIMARY KEY,
   d_name VARCHAR(30)
);

CREATE TABLE role
(
   id INT PRIMARY KEY,
   title VARCHAR(30),
   salary DECIMAL,
   department_id INT
);

CREATE TABLE employee
(
   id INT PRIMARY KEY,
   first_name VARCHAR,
   last_name VARCHAR,
   role_id INT,
   manager_id INT
);