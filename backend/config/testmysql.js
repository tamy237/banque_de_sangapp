// test-mysql.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'appuser',
  password: 'appuserpassword',
  database: 'don_de_sangbd',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL :', err.message);
  } else {
    console.log('✅ Connexion MySQL réussie !');
    connection.end();
  }
});
