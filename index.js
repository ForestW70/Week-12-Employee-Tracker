const inquirer = require('inquirer');


const initialize = () => {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your name?',
            }
        ])
}