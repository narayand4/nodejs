var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'qaz#123',
  database : 'test'
});

connection.connect();

//fetch data from table
connection.query('SELECT * from users', function(err, rows, fields) {
  if (err) throw err;

  console.log(rows);
});

//insert data in table
/*connection.query("insert into users(firstname,lastname)values('Golden','Kumar')", function(err, rows, fields) {
  if (err) throw err;
  
  console.log('Insert successfully.');
});*/

connection.end();
