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

let depatmentList = [];
let namesList = [];
let managerList = [];
let fullList = [];


const initialize = async () => {
    refreshLists();
    updateManagerList();
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

            switch (data.path) {
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'View all employees by department':
                    viewEmployeesBy('dept');
                    break;
                case 'View all employees by manager':
                    viewEmployeesBy('mgmt');
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

const viewAllEmployees = () => {
    console.log("\n" + "*~All employees~*" + "\n")
    console.table(fullList);
    initialize();
}

const viewEmployeesBy = async (action) => {
    let query;
    let header;

    if (action == 'dept') {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'What department would you like to search?',
                choices: depatmentList,
            }
        ]).then(data => {
            header = `Here are all ${data.department_id.split("-")[1]}'s employees.`
            const search = 'role_id';
            const value = Number(data.department_id.split("-")[0]);
            query = `SELECT * FROM employees WHERE ${search} = ${value}`;
        })


    } else if (action == 'mgmt') {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'manager_id',
                message: 'Which manager would you like to search?',
                choices: managerList,
            }
        ]).then(data => {
            header = `Here is ${data.manager_id.split("-")[1]}'s underlings.`;
            const search = 'has_boss';
            const value = Number(data.manager_id.split("-")[0]);
            query = `SELECT * FROM employees WHERE ${search} = ${value}`;
        })

    } else {
        console.log("whoops something went wrong!")
    }


    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("\n\n" + header + "\n")
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

const updateEmployeeRole = () => {
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
                message: "Please select the employee you would like to update:",
                choices: allNames
            },
            {
                type: 'list',
                name: "toUpdate",
                message: "What role would you like to re-assign them to?",
                choices: [
                    'First name',
                    'Last name',
                    'Role',
                    'Who their boss is',
                    'Who is a manager'
                ]
            },
        ]).then(data => {
            const selcEmployee = data.emp_name.split(' ');
            switch (data.toUpdate) {
                case 'First name':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'newFName',
                            message: "please enter the employee's modified first name:"
                        }
                    ]).then(data => {
                        let newVal = data.newFName;
                        updateQuery('first_name', newVal, selcEmployee);
                    })
                    break;
                case 'Last name':
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'newLName',
                            message: "please enter the employee's modified last name:"
                        }
                    ]).then(data => {
                        let newVal = data.newLName;
                        updateQuery('last_name', newVal, selcEmployee);
                    })
                    break;
                case 'Role':
                    updateQuery('role_id', newVal, selcEmployee);
                    break;
                case 'Who their boss is':
                    updateQuery('has_boss');
                    break;
                case 'Who is a manager':
                    updateQuery('manager_id');
                    break;
            }
        })
    })
}

const updateQuery = (colName, newVal, emp) => {
    const query = `UPDATE employees SET ${colName} = ? WHERE first_name = ? AND last_name = ?;`
    // let col = colName
    connection.query(query, [
        { newVal },
        [
            emp[0]
        ],
        [
            emp[1]
        ]
    ], (err, res) => {
        if (err) {
            throw err;
        }
        console.log(`sucessfully changed ${emp[0]}'s ${colName}!`)
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
                console.log("Returning to nav...")
                initialize();
            } else {
                console.log("\n" + "Come back soon!")
                connection.end();
            }
        })
}

const refreshLists = () => {
    connection.query("SELECT first_name, last_name, employees.id, employees.role_id, departments.name, roles.title, roles.salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON employees.role_id = departments.id ORDER BY employees.role_id;",
        async (err, res) => {
            if (err) {
                throw err.code;
            }
            // let peeps = await res;
            fullList = [];
            namesList = [];
            depatmentList = [];
            res.forEach(people => {
                let person = {
                    "first_name": people.first_name,
                    "last_name": people.last_name,
                    "id": people.id,
                    "dept_name": people.name,
                    "role_title": people.title,
                    "role_salary": people.salary,
                }
                fullList.push(person);
                namesList.push(person.first_name + ' ' + person.last_name);
                if (!depatmentList.includes(`${people.role_id}-${person.dept_name}`)) {
                    depatmentList.push(`${people.role_id}-${person.dept_name}`);
                }
            })

        })

}

const updateManagerList = () => {
    connection.query("SELECT first_name, last_name, manager_id, r.title FROM employees e INNER JOIN roles r ON e.manager_id = r.id AND e.manager_id > 0;",
        (err, res) => {
            if (err) {
                throw err;
            }

            managerList = [];
            res.forEach(people => {
                let manager = {
                    "first_name": people.first_name,
                    "last_name": people.last_name,
                    "mgmt_id": people.manager_id,
                    "mgmt_title": people.title,
                }
                managerList.push(`${manager.mgmt_id}-${manager.first_name}, ${manager.mgmt_title}`);

            })
        })
}



