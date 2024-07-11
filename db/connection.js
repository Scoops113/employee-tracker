const { Pool } = require('pg');

const pool = new Pool({
  user: 'Stephen C',
  host: 'localhost',
  database: 'employee_tracker',
  password: 'password',
  port: 5432,
});

module.exports = pool;

