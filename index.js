const inquirer = require('inquirer');
const mysql = require("mysql");
const consoleTable = require("console.table");
const { Table } = require('console-table-printer');
const GuiTable = require("./lib/tableMaker.js");
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hw12_db',
});
connection.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log(`connected as id ${connection.threadId}\n`);
    initialize();
});



const initialize = async () => {

    await inquirer
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
                    'Exit'
                ],
            },
        ]).then(data => {

            refreshEmployeeList()
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
                    updateEmployeeManager();
                    break;
                case 'Update departments':
                    updateDepartments();
                    break;
                case 'View budget':
                    viewBudget();
                    break;
                case 'Exit':
                    promptExit();
                    break;
                default:
                    console.log('Error, no selection!');
            }
        })
}


let allEmployees = [];

function refreshEmployeeList() {
    connection.query('SELECT * FROM employees;', async(err, res) => {
        if (err) {
            throw err.code;
        }
        let employees = await res
        allEmployees = [];
        employees.forEach(emp => {
            let empInfo = {
                "first_name": emp.first_name,
                "last_name": emp.last_name,
                "emp_id": emp.id,
                "has_boss": emp.has_boss,
                "role_id": emp.role_id,
                "manager_id": emp.manager_id

            };
            allEmployees.push(empInfo);
        })
        
        // console.table(allEmployees);


    })
}

const viewEmployees = async (action) => {
    let search;
    let value;
    let query;

    if (action == 'all') {
        query = 'SELECT * FROM employees';

        // console.table(allEmployees);


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
        console.log("\n" + "~*employees~*" + "\n")
        console.table(res)
        console.log("\n");
    })
    initialize();
}



const addEmployee = async () => {
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

const removeEmployee = () => {
    let allNames = [];
    connection.query('select * from employees;', async (err, res) => {
        if (err) {
            throw new Error(err)
        }
        res.forEach(person => {
            allNames.push(person.first_name + ' ' + person.last_name)
        })

        await inquirer.prompt([
            {
                type: 'list',
                name: "emp_name",
                message: "Please select the employee you would like to remove:",
                choices: allNames
            },

        ]).then(data => {
            let selcEmpFirst = data.emp_name.split(' ')[0];
            let selcEmpLast = data.emp_name.split(' ')[1];

            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'isSure',
                    message: `Are you sure you would like to delete ${data.emp_name}?`
                }
            ]).then(data => {
                if (data.isSure) {
                    let query = 'DELETE FROM employees WHERE first_name = ? AND last_name = ?;'
                    connection.query(query, [selcEmpFirst, selcEmpLast], (err, res) => {
                        if (err) {
                            throw err;
                        }
                        console.log(`${selcEmpFirst} has been removed from the company!`);
                        initialize();
                    })
                } else {
                    console.log("\n" + "Returning...")
                    initialize();
                }
            })
        })
    })
}
const promptExit = () => {
    inquirer
        .prompt([
            {
                type: 'confirm',
                name: "isDone",
                message: "Are you sure you would like to quit?"
            }
        ]).then(data => {
            if (!data.isDone) {
                initialize();
            } else {
                console.log("\n" + "Come back soon!")
                connection.end();
            }
        })
}

