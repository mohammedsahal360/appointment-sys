const mysql = require('mysql2');

const pool = mysql.createPool({
      host: 'mydb.cpm0gwq46vit.ap-southeast-2.rds.amazonaws.com',
      user: 'admin',                                             
      password: 'Sahal#2005',                                   
      database: 'mediconnect',                                     
      port: 3306  
});

module.exports = pool.promise();
