
//Esenpio w3s connessione db con comando 'node <<nome_file.esetnsione>>'
exports.config = {
  connectionLimit: 10,
  host: 'localhost',
  // Non usiamo *** mai *** root senza password
  user: 'dario',
  password: 'dario123',
  database: 'provadb',
  port: 8889,
  multipleStatements: true // consente query multiple in un'unica istruzione SQL
 
}
    /*Create a table named "customers":*/
    // var sql = "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   console.log("Table created");
    // });
// exports.config = {
//     connectionLimit: 10,
//     host: 'localhost',
//     // Non usiamo *** mai *** root senza password
//     user: 'dario',
//     password: 'dario123',
//     database: 'dario',
//     /*port: 3306,*/
//     multipleStatements: true,
//     connect(function(err) {
//         if (err) throw err;
//         console.log("Connected!");
//       });} // consente query multiple in un'unica istruzione SQL
   


// config.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//   });
  
//mysql://
//be5b046268f205
//:546bce3a
//@eu-cdbr-west-03.cleardb.net
//heroku_251abf3c1b1dffb
//?reconnect=true