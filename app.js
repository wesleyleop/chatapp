var express = require('express')
  , app = express()
  , bodyParser = require('body-parser')
  , session = require('express-session')
  , config = require('config')
  , port = config.get('port');

var http = require('http');
var socketIO = require('socket.io');
var ioCookieParser = require('socket.io-cookie');
var Chat = require('./server/chat');
var db = require('./models/db/base');

app.set('views', __dirname + '/views');
app.set('models', __dirname + '/models');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(session({
  secret: "mysqc",
  name: "mycookie",
  resave: true,
  proxy: true,
  saveUninitialized: true,
  duration: config.get('session_time'),
  activeDuration: config.get('session_time'),
  httpOnly: true,
  secure: true,
  ephemeral: true,
  cookie: {
    secure: false,
    maxAge: config.get('session_time')
  }
}));

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/models'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('./controllers'));
app.use(function (req, res, next) {
  delete req.headers['content-encoding']
  next()
});
app.listen(port, function () {
  console.log('Listening on port ' + port)
});

var server = http.createServer(app);
var io = socketIO(server); //Socket io must be after the lat app.use
io.use(ioCookieParser);

io.use(function(socket, next) {
  debug('incoming socket connection');

  var sessionId = (socket.request.headers.cookie)? socket.request.headers.cookie.id : null;

  //If no session id or wrong the user is a guest
  if(!sessionId || !lib.isUUIDv4(sessionId)) {
      socket.user = false;
      return next();
  }

  db.query.getUserBySessionId(sessionId, function(err, user) {

      //The error is handled manually to avoid sending it into routes
      if (err) {
          if (err === 'NOT_VALID_SESSION') {
              //socket.emit('err', 'NOT_VALID_SESSION');
              next(new Error('NOT_VALID_SESSION'));
          } else {
              console.error('[INTERNAL_ERROR] Unable to get user in socket by session ' + sessionId + ':', err);
              next(new Error('Unable to get the session on the server, logged as a guest.'));
              //return socket.emit('err', 'INTERNAL_ERROR');
          }
          socket.user = false;
          return next();
      }

      //Save the user info in the socket connection object
      socket.user = user;
      socket.user.admin = user.userclass === 'admin';
      socket.user.moderator = user.userclass === 'admin' || user.userclass === 'moderator';
      next();
  });
});


var chatServer = new Chat(io);

server.listen(config.PORT, function() {
  console.log('Listening on port ', config.PORT);
});

/** Log uncaught exceptions and kill the application **/
process.on('uncaughtException', function (err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});
