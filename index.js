const inquirer = require('inquirer');


const initialize = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'path',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View all employees by department',
                    'View all employees by manager',
                    'Add employees',
                    'Remove employee',
                    'Update employee role',
                    'Update employee manager'
                ],
            },
        ]).then(data => {
            switch (data.path) {
                case 'View all employees':
                    viewEmployees();
                    break;
                case 'View all employees by department':
                    viewEmployeesByDept();
                    break;
                case 'View all employees by manager':
                    viewEmployeesByMgmt();
                    break;
                case 'Add employees':
                    addEmployees();
                    break;
                case 'Remove employee':
                    removeEmployee();
                    break;
                case 'Update employee role':
                    updateEmployee();
                    break;
                case 'Update employee manager':
                    updateEmployeeMgmt();
                    break;
                default:
                    console.log("Error, no selection!");
            }
        })
}

const viewEmployees = () => {
    inquirer
        .prompt([
            {
                type: 'list',
                name: '',
                message: 'What would you like to do?',
            }
        ])
}

initialize();