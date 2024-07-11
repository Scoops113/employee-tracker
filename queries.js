const { ReadStream } = require('fs');


ReadStream.setMaxListeners(30); 

const pool = require('./db/connection');

const getDepartments = async () => {
  const res = await pool.query('SELECT * FROM department');
  return res.rows;
};

const getRoles = async () => {
  const res = await pool.query(`
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `);
  return res.rows;
};

const getEmployees = async () => {
  const res = await pool.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title,
           department.name AS department, role.salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `);
  return res.rows;
};

const addDepartment = async (name) => {
  await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
};

const addRole = async (title, salary, department_id) => {
  await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
};

const addEmployee = async (first_name, last_name, role_id, manager_id) => {
  await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
};

const updateEmployeeRole = async (employee_id, role_id) => {
  await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
};

module.exports = { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };
