//для бд
const mysql2 = require('mysql2/promise');
//config bd
const conn = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'summer_chat',
  password: '',
});
//проверка подключения к бд
conn.connect(function(err) {
  if (err){
    return console.error("Ошибка" + err.message)
  }
  else{
    console.log("Подключились к бд")
  }
});
