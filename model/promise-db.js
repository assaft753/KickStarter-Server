var mysql = require('sync-mysql');
/*var pool = mysql.createPool({
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    password: "Assaf1234567",
    database: "KickStarter"
});*/

var pool = new mysql({
    host: '127.0.0.1',
    user: 'root',
    password: 'Assaf1234567',
    database: 'KickStarter'
  });
module.exports = pool;