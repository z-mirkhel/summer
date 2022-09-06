//подключение модулей
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//для бд
const mysql2 = require('mysql2');
//config bd
const conn = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'summer_chat',
  password: '',
});

/*
//для получения данных из формы в html блоке
app.use(bodyParser.urlencoded());


//вывод из бд
app.get('/bd', function(req, res) {
  //res.send('BD');
  //
  pool.query('SELECT * FROM chat_clients').then(function(data) {
    const chat_clients = data[0];
    res.send(`<!DOCTYPE html>
    <html>
      <body>
        <ul>
          ${chat_clients.map(chat_clients => `<h3>${chat_clients.name}:</h3><li> ${chat_clients.message}</li>`).join('')}
        </ul>
      </body>
    </html>`);
  });
});
*/

//отслеживание порта и вывод сообщения о начале работы сервера
server.listen(3000, () => {
  console.log('Начало работы сервера...')
});

// Отслеживание url адреса и отображение нужной HTML страницы
app.get('/', function(request, respons) {
	respons.sendFile(__dirname + '/index.html');
});

//для получения статического файла из папки assets
//понадобится для подключения стилей/скриптов/изображений в html файле
app.use(express.static(__dirname + '/assets'));

// Массив со всеми подключениями
connections = [];

// Функция, которая сработает при подключении к странице
// Считается как новый пользователь
io.sockets.on('connection', function(socket) {
	console.log("Успешное соединение");
	// Добавление нового соединения в массив
	connections.push(socket);

  //проверка подключения к бд
  conn.connect(function(err) {
    if (err){
      return console.error("Ошибка" + err.message)
    }
    else{
      console.log("Подключились к бд")
    }
  });

	// Функция, которая срабатывает при отключении от сервера
	socket.on('disconnect', function(data) {
		// Удаления пользователя из массива
		connections.splice(connections.indexOf(socket), 1);
		console.log("Отключились");
    /*conn.end(function(err) {
      if (err){
        return console.error("Ошибка" + err.message)
      }
      else{
        console.log("Отключились от бд")
      }
    });
    */
	});

	// Функция получающая сообщение от какого-либо пользователя
	socket.on('send mess', function(data) {
    //добавление в бд
    /*let sql = "INSERT INTO `chat_clients` (`name`, `message`) VALUES ?";
    conn.query(sql, {'name3','mes3??'}, function(err, results){
      if (err) {
        console.log("Ошибка добавления в бд" + err.message);
      }
      console.log(results);
    });
    */
    conn.query(`INSERT INTO chat_clients SET ?`, {
      name: data.name,
      message: data.mess,
    }, function(err, results){
      if (err) {
        console.log("Ошибка добавления в бд" + err.message);
      }
      console.log(results);
    });

		// Внутри функции мы передаем событие 'add mess',
		// которое будет вызвано у всех пользователей и у них добавиться новое сообщение
		io.sockets.emit('add mess', {mess: data.mess, name: data.name, className: data.className});
	});

});
