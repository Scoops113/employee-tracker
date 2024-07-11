INSERT INTO department (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Engineering'),
  ('Finance'),
  ('Human Resources');

INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 70000, 1),
  ('Sales Representative', 50000, 1),
  ('Marketing Manager', 80000, 2),
  ('Marketing Specialist', 60000, 2),
  ('Software Engineer', 90000, 3),
  ('DevOps Engineer', 95000, 3),
  ('Financial Analyst', 75000, 4),
  ('Accountant', 70000, 4),
  ('HR Manager', 85000, 5),
  ('HR Specialist', 65000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Michael', 'Johnson', 3, NULL),
  ('Emily', 'Williams', 4, 3),
  ('David', 'Brown', 5, NULL),
  ('Sarah', 'Miller', 6, 5),
  ('Chris', 'Davis', 7, NULL),
  ('Emma', 'Garcia', 8, 7),
  ('Daniel', 'Martinez', 9, NULL),
  ('Olivia', 'Lopez', 10, 9);