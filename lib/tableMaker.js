const { Table } = require('console-table-printer');

class GuiTable extends Table {
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

}

module.exports = GuiTable;