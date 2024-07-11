const inquirer = require('inquirer');
const pool = require('./db/connection'); // Adjust path as necessary
const {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
} = require('./queries');

const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]).then(async (answers) => {
    switch (answers.action) {
      case 'View all departments':
        try {
          const departments = await getDepartments(pool);
          console.table(departments);
        } catch (error) {
          console.error('Error fetching departments:', error.message);
        }
        break;
      case 'View all roles':
        try {
          const roles = await getRoles(pool);
          console.table(roles);
        } catch (error) {
          console.error('Error fetching roles:', error.message);
        }
        break;
      case 'View all employees':
        try {
          const employees = await getEmployees(pool);
          console.table(employees);
        } catch (error) {
          console.error('Error fetching employees:', error.message);
        }
        break;
      case 'Add a department':
        await addDepartmentPrompt();
        break;
      case 'Add a role':
        await addRolePrompt();
        break;
      case 'Add an employee':
        await addEmployeePrompt();
        break;
      case 'Update an employee role':
        await updateEmployeeRolePrompt();
        break;
      case 'Exit':
        process.exit();
    }
    mainMenu();
  });
};

const addDepartmentPrompt = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:'
    }
  ]).then(async (answers) => {
    try {
      await addDepartment(pool, answers.name);
      console.log('Department added!');
    } catch (error) {
      console.error('Error adding department:', error.message);
    }
    mainMenu();
  });
};

const addRolePrompt = async () => {
  try {
    const departments = await getDepartments(pool);
    const departmentChoices = departments.map(department => ({ name: department.name, value: department.id }));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary of the role:'
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the role:',
        choices: departmentChoices
      }
    ]);

    await addRole(pool, answers.title, answers.salary, answers.department_id);
    console.log('Role added!');
  } catch (error) {
    console.error('Error adding role:', error.message);
  }
  mainMenu();
};

const addEmployeePrompt = async () => {
  try {
    const roles = await getRoles(pool);
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const employees = await getEmployees(pool);
    const managerChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
    managerChoices.unshift({ name: 'None', value: null });

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee:'
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee:'
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the role for the employee:',
        choices: roleChoices
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the manager for the employee:',
        choices: managerChoices
      }
    ]);

    await addEmployee(pool, answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
    console.log('Employee added!');
  } catch (error) {
    console.error('Error adding employee:', error.message);
  }
  mainMenu();
};

const updateEmployeeRolePrompt = async () => {
  try {
    const employees = await getEmployees(pool);
    const employeeChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

    const roles = await getRoles(pool);
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employeeChoices
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee:',
        choices: roleChoices
      }
    ]);

    await updateEmployeeRole(pool, answers.employee_id, answers.role_id);
    console.log('Employee role updated!');
  } catch (error) {
    console.error('Error updating employee role:', error.message);
  }
  mainMenu();
};

mainMenu();
