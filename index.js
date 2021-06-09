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

const viewEmployees = async (action) => {
    let search;
    let value;
    let query;

    if (action == 'all'){
        query = 'SELECT * FROM employees';


    } else if (action == 'dept') {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'What department would you like to search?',
                choices: [
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6'
                ]
            }
        ]).then(data => {
            search = 'role_id';
            value = Number(data.department_id);
            query = `SELECT * FROM employees WHERE ${search} = ${value}`;
        })
        

    } else if (action == 'mgmt') {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'manager_id',
                message: 'Which manager would you like to search?',
                choices: [
                    '1',
                    '2',
                    '3',
                    '4'
                ]
            }
        ]).then(data => {
            search = 'manager_id';
            value = Number(data.manager_id);
            query = `SELECT * FROM employees WHERE ${search} = ${value}`;
        })
        
    } else {
        console.log("whoops")
    }

    
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res)
    })
    initialize();
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

