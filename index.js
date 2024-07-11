const inquirer = require('inquirer');
const { getDepartments, getRoles, getEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./queries');

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
        const departments = await getDepartments();
        console.table(departments);
        break;
      case 'View all roles':
        const roles = await getRoles();
        console.table(roles);
        break;
      case 'View all employees':
        const employees = await getEmployees();
        console.table(employees);
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
    await addDepartment(answers.name);
    console.log('Department added!');
    mainMenu();
  });
};

const addRolePrompt = async () => {
  const departments = await getDepartments();
  const departmentChoices = departments.map(department => ({ name: department.name, value: department.id }));

  inquirer.prompt([
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
  ]).then(async (answers) => {
    await addRole(answers.title, answers.salary, answers.department_id);
    console.log('Role added!');
    mainMenu();
  });
};

const addEmployeePrompt = async () => {
  const roles = await getRoles();
  const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

  const employees = await getEmployees();
  const managerChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));
  managerChoices.unshift({ name: 'None', value: null });

  inquirer.prompt([
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
  ]).then(async (answers) => {
    await addEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
    console.log('Employee added!');
    mainMenu();
  });
};

const updateEmployeeRolePrompt = async () => {
  const employees = await getEmployees();
  const employeeChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

  const roles = await getRoles();
  const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

  inquirer.prompt([
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
  ]).then(async (answers) => {
    await updateEmployeeRole(answers.employee_id, answers.role_id);
    console.log('Employee role updated!');
    mainMenu();
  });
};

mainMenu();
