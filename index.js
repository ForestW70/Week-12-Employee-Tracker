const inquirer = require('inquirer');
const mysql = require("mysql");
const consoleTable = require("console.table");


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'hw12_db',
});

connection.connect(err => {
  if (err) throw err;
  console.log(`connected as id ${connection.threadId}\n`);
  initialize();
});

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
                    viewEmployees('all');
                    break;
                case 'View all employees by department':
                    viewEmployees('dept');
                    break;
                case 'View all employees by manager':
                    viewEmployees('mgmt');
                    break;
                case 'Add employees':
                    updateEmployees('add');
                    break;
                case 'Remove employee':
                    updateEmployees('remove');
                    break;
                case 'Update employee role':
                    updateEmployees('role');
                    break;
                case 'Update employee manager':
                    updateEmployees('mgmt');
                    break;
                default:
                    console.log('Error, no selection!');
            }
        })
}

const viewEmployees = (action) => {
    switch (action) {
        case 'all':
            console.log("bing");
            break;
        case 'dept':
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: '',
                        message: 'What would you like to do?',
                    }
                ])
            break;
        case 'mgmt':
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: '',
                        message: 'What would you like to do?',
                    }
                ])
            break;
        default:
            console.log('Error, please specify what you would like to do!')
            initialize();

    }
}

const updateEmployees = (action) => {
    switch (action) {
        case 'add':
            break;
        case 'remove':
            break;
        case 'role':
            break;
        case 'mgmt':
            break;
        default:
            console.log('Error, please specify what you would like to do!')
            initialize();
    }
}

const updateRoles = (action) => {
    switch (action) {
        case 'add':
            break;
        case 'remove':
            break;
    }
}

