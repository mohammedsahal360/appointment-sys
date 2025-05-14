const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Sahal@2005', // Replace with your MySQL password
    database: 'appointmentsystem',
    socketPath: '/tmp/mysql.sock', // For macOS with Homebrew-installed MySQL
    port: 3306
});

module.exports = pool.promise();