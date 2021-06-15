// CONNECTION =============================================
const inquirer = require('inquirer');
const mysql = require("mysql");
const consoleTable = require("console.table");
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
connection.connect(err => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log(`connected as id ${connection.threadId}\n`);
    initialize();
});


// UPDATED LISTS ==========================================
let departmentList = [];
let rolesList = [];
let namesList = [];
let managerList = [];
let fullList = [];


// ========================================================
// HOME
const initialize = async () => {
    // creates up to date lists to use as prompt list-choices.
    refreshLists();
    updateDepartmentList();
    updateManagerList();
    updateRoleList();

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
                    'Add departments',
                    'Remove departments',
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
                case 'Add departments':
                    updateDepartments();
                    break;
                case 'Remove departments':
                    removeDepartments();
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


// ========================================================
// VIEW EMPLOYEES BY
// all
const viewAllEmployees = async () => {
    await refreshLists();
    console.log("\n" + "*~All employees~*" + "\n")
    console.table(fullList);
    initialize();
}

// view by deprtment or by manager
const viewEmployeesBy = async (action) => {
    let query;
    let header;

    if (action == 'dept') {
        await inquirer.prompt([
            {
                type: 'list',
                name: 'department_id',
                message: 'What department would you like to search?',
                choices: departmentList,
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
        console.log("\n\n" + header)
        console.table(res)
        console.log("\n");
    })
    initialize();
}


// ========================================================
// ADD EMPLOYEE
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
            choices: departmentList
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
            choices: managerList
        }
    ]).then(data => {
        let roleId = data.role_id.split("-")[0];
        let hasBoss = data.has_boss.split("-")[0];
        let managerId;
        if (data.isManager) {
            managerId = roleId;
        }
        query = `INSERT INTO employees SET ?`;

        connection.query(query,
            {
                first_name: data.first_name,
                last_name: data.last_name,
                role_id: roleId,
                has_boss: hasBoss,
                manager_id: managerId,

            }, err => {
                if (err) throw err;
                console.log(`\n Sucessfully added ${data.first_name} to the Team!\n`)
                initialize();
            })
    })
}


// ========================================================
// REMOVE EMPLOYEE
const removeEmployee = async () => {

    await inquirer.prompt([
        {
            type: 'list',
            name: "emp_name",
            message: "Please select the employee you would like to remove:",
            choices: namesList
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
                    console.log(`\n${selcEmpFirst} has been removed from the company!\n`);
                    initialize();
                })
            } else {
                console.log(`\nReturning...\n`)
                initialize();
            }
        })
    })
}



// ========================================================
// UPDATE EMPLOYEE
// update role
const updateEmployeeRole = async () => {
    await inquirer.prompt([
        {
            type: 'list',
            name: "emp_name",
            message: "Please select the employee you would like to update:",
            choices: namesList,
        },
        {
            type: 'list',
            name: "newRole",
            message: "What role would you like to re-assign them to?",
            choices: rolesList,
        },
    ]).then(data => {
        const selcFName = data.emp_name.split(' ')[0];
        const selcLName = data.emp_name.split(' ')[1];
        const newRoleId = data.newRole.split("-")[0];
        updateQuery("role_id", selcFName, selcLName, newRoleId);
        console.log(`\n sucessfully changed ${selcFName}'s roles!\n`)
        initialize();
    })

}

// update manager
const updateEmployeeManager = async () => {
    await inquirer.prompt([
        {
            type: 'list',
            name: "emp_name",
            message: "Please select the employee you would like to update:",
            choices: namesList,
        },
        {
            type: 'list',
            name: "newMgmt",
            message: "What manager would you like to re-assign them to?",
            choices: managerList,
        },
    ]).then(data => {
        const selcFName = data.emp_name.split(' ')[0];
        const selcLName = data.emp_name.split(' ')[1];
        const newBossId = data.newMgmt.split("-")[0];
        updateQuery("has_boss", selcFName, selcLName, newBossId);
        console.log(`\n sucessfully changed ${selcFName}'s manager!\n`)
        initialize();
    })
}


// ========================================================
// UPDATE DEPARTMENT LIST
const updateDepartments = async () => {

    await inquirer.prompt([
        {
            type: 'input',
            name: "dept",
            message: "What department would you like to add?",
        },
        {
            type: 'input',
            name: "role",
            message: "What will their roll be called?",

        },
        {
            type: 'number',
            name: "salary",
            message: "What will their salary be?",

        }
    ]).then(data => {
        const newDept = data.dept.trim();
        const query = 'INSERT INTO departments SET ?;'
        connection.query(query, {
            "name": newDept,
        }, (err, res) => {
            if (err) {
                throw err
            }
            console.log(`\nSucessfully added ${newDept} to active departments!`);
            initialize();
        })

        const newRole = data.role.trim();
        const salary = Number(data.salary);
        const query2 = 'INSERT INTO roles SET ?;'
        const pretty = numberWithCommas(salary);
        connection.query(query2, {
            "title": newRole,
            "salary": salary,
        }, (err, res) => {
            if (err) {
                throw err
            }
            console.log(`\nNew position: ${newRole}, making $${pretty} a year!\n`)
        })

    })
}

const removeDepartments = async () => {
    await inquirer.prompt([
        {
            type: 'list',
            name: "dept",
            message: "Which department would you like to remove?",
            choices: departmentList
        },
        {
            type: 'confirm',
            name: "isSure",
            message: "Are you sure you want to delete this role? All assigned employess will lose their home :("
        }
    ]).then(data => {
        if (data.isSure) {
            const query = 'DELETE FROM departments WHERE ?'
            const dptId = data.dept.split("-")[0];
            const dptName = data.dept.split("-")[1];
            connection.query(query, {
                "name": dptName,
            }, (err, res) => {
                if (err) {
                    throw err
                }
                console.log(`\nsucessfully removed ${dptName} from your active departments!\n`)
            })

            connection.query(`UPDATE employees SET role_id = NULL, has_boss = NULL, manager_id = NULL WHERE role_id = ?;`, [dptId], (err, res) => {
                if (err) {
                    throw err
                }
                console.log(`\nyou may have lost ${res.changedRows} employees! Go back to reassign them!\n`)

            })
            initialize();
        } else {
            console.log(`\nReturning...\n`)
            initialize();
        }
    })
}




// ========================================================
// VIEW BUDGET
const viewBudget = () => {
    let salaryArray = [];
    fullList.forEach(data => {
        salaryArray.push(data.role_salary);
    })
    let totalNum = salaryArray.reduce((a, b) => a + b, 0)
    let prettyNum = numberWithCommas(totalNum);
    console.log(`\nThe current employee salary overhead is $${prettyNum}!\n`);
    initialize();
}


// ========================================================
// EXIT PROMPT
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
                console.log(`\nReturning to nav...\n`)
                initialize();
            } else {
                console.log(`\nCome back soon!\n`)
                connection.end();
            }
        })
}


// ========================================================
// UTILITY FUNCTIONS
// update name and full lists query
const refreshLists = () => {
    connection.query("SELECT first_name, last_name, employees.id, employees.role_id, employees.has_boss, employees.manager_id, departments.name, roles.title, roles.salary FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON employees.role_id = departments.id ORDER BY employees.role_id;",
        async (err, res) => {
            if (err) {
                throw err.code;
            }

            fullList = [];
            namesList = [];
            res.forEach(people => {
                let person = {
                    "id": people.id,
                    "first_name": people.first_name,
                    "last_name": people.last_name,
                    "role_id": people.role_id,
                    "dept_name": people.name,
                    "role_title": people.title,
                    "manager_id": people.manager_id,
                    "assigned_to": people.has_boss,
                    "role_salary": people.salary,
                }
                fullList.push(person);
                namesList.push(person.first_name + ' ' + person.last_name);
                
            })

        })
}

// update departments list.
const updateDepartmentList = () => {
    connection.query('SELECT * FROM departments', (err, res) => {
        if (err) {
            throw err
        }
        departmentList = [];
        res.forEach(dept => {
            let department = {
                "dept_name": dept.name,
                "dept_id": dept.id,
            }
            departmentList.push(`${department.dept_id}-${department.dept_name}`);
        })
    })
}

// update roles list.
const updateRoleList = () => {
    connection.query(`SELECT id, title, salary FROM roles`, (err, res) => {
        if (err) {
            throw err
        }
        rolesList = [];
        res.forEach(role => {
            let roleInfo = {
                "id": role.id,
                "title": role.title,
                "salary": role.salary
            }
            rolesList.push(`${roleInfo.id}-${roleInfo.title}-${roleInfo.salary}`);
        })
    })
}

// update manager list.
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

// update employee by * query
const updateQuery = (colName, fName, lName, newVal) => {
    const query = `UPDATE employees SET ${colName} = ? WHERE first_name = ? AND last_name = ?;`
    connection.query(query, [newVal, fName, lName], (err, res) => {
        if (err) {
            throw err;
        }
    })
}

// regex function that returns a formatted number for total salary
// Taken from "https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript" bc I dont understand the regex stuff yet...
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



