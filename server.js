const app = require('./app');
const debug = require('debug')('paineldereconhecimento:server');
const http = require('http');
//Sql server config
const conString = 'Provider=SQLOLEDB.1;Password=@abc123;Persist Security Info=True;User ID=sa;Initial Catalog=Indigo_Controle_Horas;Data Source=INDSRVHML001';
const sql = require('mssql');

let server = http.createServer(app);

sql.connect(conString)
  .then(conn => {
    global.conn = conn;
    //inicia o servidor
    server.listen(process.env.PORT);
    console.log('API funcionando!');
  })
  .catch(err => console.log(err));