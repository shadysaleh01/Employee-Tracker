DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department
(
   id INT
   UNSIGNED 
   AUTO_INCREMENT PRIMARY KEY,
   d_name VARCHAR
   (30)
);

   CREATE TABLE role
   (
      id INT
      UNSIGNED 
      AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR
      (30),
   salary DECIMAL
      (20,4),
   department_id INT UNSIGNED ,
     INDEX dep_ind
      (department_id),
  CONSTRAINT fk_department FOREIGN KEY
      (department_id) REFERENCES department
      (id) ON
      DELETE CASCADE
);

      CREATE TABLE employee
      (
         id INT
         UNSIGNED 
         AUTO_INCREMENT PRIMARY KEY,
   first_name VARCHAR
         (30),
   last_name VARCHAR
         (30),
   role_id INT UNSIGNED,
     CONSTRAINT fk_role FOREIGN KEY
         (role_id) REFERENCES role
         (id) ON
         DELETE CASCADE,
    INDEX man_ind (manager_id),
   manager_id INT
         UNSIGNED,
     INDEX role_ind
         (role_id),

  CONSTRAINT fk_manager FOREIGN KEY
         (manager_id) REFERENCES employee
         (id) ON
         DELETE
         SET NULL
         );