
//Esenpio w3s connessione db con comando 'node <<nome_file.esetnsione>>'
exports.config = {
  connectionLimit: 10,
  host: 'dariobirtone.mysql.database.azure.com',
  // Non usiamo *** mai *** root senza password
  user: 'DarioBirtone@dariobirtone',
  password: 'Dario123',
  database: 'provadb',
  multipleStatements: true // consente query multiple in un'unica istruzione SQL
 
} 
 

   