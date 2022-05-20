var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const User = require('./models/index').User;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
  socket.on('users:save', async (data) => {
    
    await User
      .create({
        name: data.name,
        email: data.email,
        password: data.password,
        dob: data.dob
      });
      
      emitAllUser();
  });

  async function emitAllUser() {
    const users = await User.findAll({
      order: [
        ['id', 'ASC'],
      ],
    } 
    );
    socket.emit('users:all', users);
  }
  
  socket.on('users:update', async userdata => {
    console.log("User Data", userdata);
    const user = await User.findByPk(userdata.id);
    if(user) {
      user.name = userdata.name;
      user.email = userdata.email;
      user.dob = userdata.dob;
      await user.save();
      emitAllUser();
    }
  });


  socket.on('users:delete', async userId => {
    const user = await User.findByPk(userId);
    if(user) {
      await user.destroy();
      emitAllUser();
    }
  });

  emitAllUser();
});








http.listen(3000, function(){
   console.log('listening on localhost:3000');
});



















app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
