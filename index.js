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
                    'Update employee manager',
                    'Update departments',
                    'View budget',
                    'exit'
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
                    addEmployee();
                    break;
                case 'Remove employee':
                    removeEmployee();
                    break;
                case 'Update employee role':
                    updateEmployeeRole();
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

    if (action == 'all') {
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
        console.log("whoops something went wrong!")
    }


    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res)
    })
    initialize();
}



const addEmployee = async() => {
    await inquirer.prompt([
        {
            type: 'input',
            name: "first_name",
            message: "Please enter the new employee's first name:",
        },
        {
            type: 'input',
            name: "last_name",
            message: "Please enter the new employee's last name:",
        },
        {
            type: 'list',
            name: "role_id",
            message: "Please enter the new employee's department:",
            choices: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6'
            ]
        },
        {
            type: 'confirm',
            name: "isManager",
            message: "Is this new employee a manager?",

        },
        {
            type: 'list',
            name: "has_boss",
            message: "Who is the new employee's boss?",
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
        let managerId;
        let has_boss = 'NULL';
        if (data.isManager) {
            managerId = data.role_id;
        }
        query = `INSERT INTO employees SET ?`;

        connection.query(query,
            {
                first_name: data.first_name,
                last_name: data.last_name,
                role_id: data.role_id,
                has_boss: data.has_boss,
                manager_id: managerId,

            }, err => {
                if (err) throw err;
                console.log(`Sucessfully added ${data.first_name} to the Team!`)
                initialize();
            })
        })
}

const removeEmployee = async() => {
    await inquirer.prompt([
        {
            type: 'input',
            name: "first_name",
            message: "Please enter the new employee's first name:",
        },
        {
            type: 'input',
            name: "last_name",
            message: "Please enter the new employee's last name:",
        },
        {
            type: 'list',
            name: "role_id",
            message: "Please enter the new employee's department:",
            choices: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6'
            ]
        },
        {
            type: 'confirm',
            name: "isManager",
            message: "Is this new employee a manager?",

        },
        {
            type: 'list',
            name: "has_boss",
            message: "Who is the new employee's boss?",
            choices: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6'
            ]
        }
    ])
}

