const mysql = require('mysql');

const DB = function () {
    const DB = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'db_node'
    });

    DB.connect((err) => {
        if (err) throw new Error(err);
    });
    return DB;
}

module.exports = DB;