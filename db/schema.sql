DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department
(
   id INT

   AUTO_INCREMENT PRIMARY KEY,
   d_name VARCHAR
   (30)
);

   CREATE TABLE role
   (
      id INT
      AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR
      (30),
   salary DECIMAL
      (20,4),
   department_id INT
);

      CREATE TABLE employee
      (
         id INT

         AUTO_INCREMENT PRIMARY KEY,
   first_name VARCHAR
         (30),
   last_name VARCHAR
         (30),
   role_id INT ,
     
   manager_id INT ,

         );