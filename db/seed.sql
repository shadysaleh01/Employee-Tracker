USE employee_tracker;

INSERT INTO department
   (d_name)
VALUES
   ('Sales'),
   ('Engineering'),
   ('Finance'),
   ('Legal');

INSERT INTO role
   (title, salary, department_id)
VALUES
   ('Salesperson', 80000, 1),
   ('Sales Lead', 100000, 1),
   ('Lead Engineer', 150000, 2),
   ('Software Engineer', 120000, 2),
   ('Account Manager', 160000, 3),
   ('Accountant', 125000, 3),
   ('Legal Team Lead', 250000, 4),
   ('Lawyer', 190000, 4);

INSERT INTO employee
   (first_name, last_name, role_id, manager_id)
VALUES
   ('Hadeel', 'Ghra', 1, 1),
   ('Saad', 'Zaghloul', 2, NULL),
   ('Stevie', 'Nicks', 3, NULL),
   ('Shady', 'Saleh', 4, 3),
   ('Ahmed', 'Shalaby', 5, NULL),
   ('Arow', 'Hasona', 6, 5),
   ('Mike', 'Roger', 7, NULL),
   ('Keaten', 'Geabe', 8, 7);