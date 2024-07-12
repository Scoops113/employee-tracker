const inquirer = require('inquirer');
const {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
} = require('./queries');

const waitForKeyPress = () => {
  return new Promise(resolve => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve();
    });
  });
};

const mainMenu = async () => {
  try {
    const answers = await inquirer.prompt([
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
    ]);

    switch (answers.action) {
      case 'View all departments':
        await viewAllDepartments();
        break;
      case 'View all roles':
        await viewAllRoles();
        break;
      case 'View all employees':
        await viewAllEmployees();
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

    await waitForKeyPress();
    mainMenu();
  } catch (error) {
    console.error('Error:', error.message);
    mainMenu();
  }
};

const viewAllDepartments = async () => {
  try {
    const departments = await getDepartments();
    printDepartmentsTable(departments);
  } catch (error) {
    console.error('Error fetching departments:', error.message);
  }
};

const viewAllRoles = async () => {
  try {
    const roles = await getRoles();
    printRolesTable(roles);
  } catch (error) {
    console.error('Error fetching roles:', error.message);
  }
};

const viewAllEmployees = async () => {
  try {
    const employees = await getEmployees();
    printEmployeesTable(employees);
  } catch (error) {
    console.error('Error fetching employees:', error.message);
  }
};

const printDepartmentsTable = (departments) => {
  console.log('Departments:');
  departments.forEach(department => {
    console.log(`ID: ${department.id} | Name: ${department.name}`);
  });
  console.log('\nPress any key to continue...');
};

const printRolesTable = (roles) => {
  console.log('Roles:');
  roles.forEach(role => {
    console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department: ${role.department}`);
  });
  console.log('\nPress any key to continue...');
};

const printEmployeesTable = (employees) => {
  console.log('Employees:');
  employees.forEach(employee => {
    const manager = employee.manager ? ` | Manager: ${employee.manager}` : '';
    console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Job Title: ${employee.job_title} | Department: ${employee.department} | Salary: ${employee.salary}${manager}`);
  });
  console.log('\nPress any key to continue...');
};

const addDepartmentPrompt = async () => {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
      }
    ]);

    await addDepartment(answers.name);
    console.log('Department added successfully.');
  } catch (error) {
    console.error('Error adding department:', error.message);
  }
};

const addRolePrompt = async () => {
  try {
    const departments = await getDepartments();
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

    await addRole(answers.title, answers.salary, answers.department_id);
    console.log('Role added successfully.');
  } catch (error) {
    console.error('Error adding role:', error.message);
  }
};

const addEmployeePrompt = async () => {
  try {
    const roles = await getRoles();
    const roleChoices = roles.map(role => ({ name: role.title, value: role.id }));

    const employees = await getEmployees();
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

    await addEmployee(answers.first_name, answers.last_name, answers.role_id, answers.manager_id);
    console.log('Employee added successfully.');
  } catch (error) {
    console.error('Error adding employee:', error.message);
  }
};

const updateEmployeeRolePrompt = async () => {
  try {
    const employees = await getEmployees();
    const employeeChoices = employees.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

    const roles = await getRoles();
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

    await updateEmployeeRole(answers.employee_id, answers.role_id);
    console.log('Employee role updated successfully.');
  } catch (error) {
    console.error('Error updating employee role:', error.message);
  }
};

mainMenu();
