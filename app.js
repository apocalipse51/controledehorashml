const passport = require('passport')  
const session = require('express-session')  
//const MongoStore = require('connect-mongo')(session)
//Sql server config
const conString = 'Provider=SQLOLEDB.1;Password=@abc123;Persist Security Info=True;User ID=sa;Initial Catalog=Indigo_Controle_Horas;Data Source=INDSRVHML001';
const sql = require('mssql');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();
const debug = require('debug')('paineldereconhecimento:server');
const http = require('http');


let server = http.createServer(app);

global.authenticationMiddleware = () => {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login?fail=true')
  }
};

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var adicionarRouter = require('./routes/adicionar');

//autenticação
require('./auth')(passport);
app.use(session({  
  secret: "INDIGO.2018",//configure um segredo seu aqui
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/adicionar', adicionarRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

sql.connect(conString)
  .then(conn => {
    global.conn = conn;
    //inicia o servidor
    server.listen(process.env.PORT || 3000);
    console.log('API funcionando!');
  })
  .catch(err => console.log(err));

module.exports = app;
