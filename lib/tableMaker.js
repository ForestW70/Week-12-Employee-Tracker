const { Table } = require('console-table-printer');

class EmpTable extends Table {
    constructor(id, fName, lName, bossNum, roleNum, mgmtNum) {
        this.id = id;
        this.first_name = fName;
        this.last_name = lName;
        this.has_boss = bossNum;
        this.role_id = roleNum;
        this.manager_id = mgmtNum;
    }

    createAllTable() {
        console.table(...args)
    }

    createOneTable() {

    }

    joinWithDepartment() {
        let query = "SELECT first_name, last_name, departments.name FROM employees LEFT JOIN departments ON employees.role_id = departments.id ORDER BY employees.role_id";

        connection.query("SELECT first_name, last_name, departments.name FROM employees LEFT JOIN departments ON employees.role_id = departments.id ORDER BY employees.role_id;", 
            (err, res) => {
                if (err) {
                    throw err.code;
                }
            console.log(res);
        })
    }

}

module.exports = EmpTable;