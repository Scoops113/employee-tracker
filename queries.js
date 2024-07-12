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
  try {
    await pool.query('BEGIN');
    const res = await pool.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name]);
    await pool.query('COMMIT');
    console.log('Department added:', res.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
};

const addRole = async (title, salary, department_id) => {
  try {
    await pool.query('BEGIN');
    const res = await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, department_id]);
    await pool.query('COMMIT');
    console.log('Role added:', res.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
};

const addEmployee = async (first_name, last_name, role_id, manager_id) => {
  try {
    await pool.query('BEGIN');
    const res = await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [first_name, last_name, role_id, manager_id]);
    await pool.query('COMMIT');
    console.log('Employee added:', res.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
};

const updateEmployeeRole = async (employee_id, role_id) => {
  try {
    await pool.query('BEGIN');
    const res = await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [role_id, employee_id]);
    await pool.query('COMMIT');
    console.log('Employee role updated:', res.rows[0]);
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
};

module.exports = { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole };
