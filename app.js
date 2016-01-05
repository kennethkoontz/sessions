var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var authorization = require('./authorization.js');
var tokenRequired = authorization.tokenRequired;
var mongoose = require('mongoose');
var users = require('./users.js');
var sessions = require('./sessions.js');
var blocks = require('./blocks.js');

mongoose.connect(process.env.MONGO_URI, function(err) {
  if (err)
    throw err;
});

server.listen(process.env.PORT || 8080);

app.use(express.static(__dirname + '/build'));
app.use(bodyParser.json()); // for parsing application/json

app.get('/users', tokenRequired, users.all);
app.post('/users', users.create);
app.get('/users/:id', tokenRequired, users.read);
app.patch('/users/:id', tokenRequired, users.update);
app.delete('/users/:id', tokenRequired, users.destroy);
app.post('/authenticate', users.authenticate);

app.get('/sessions', sessions.all);
app.post('/sessions', sessions.create);
app.get('/sessions/:id', sessions.read);

app.get('/blocks', blocks.all);
app.post('/blocks', blocks.create);
app.get('/blocks/:id', blocks.read);
app.patch('/blocks/:id', blocks.update);

io.on('connection', function (socket) {
  socket.on('enter-room', function(data) {
    var user = {
      user: data.user_id,
      connected: true
    };
    sessions
      .Model
      .findByIdAndUpdate(data.session_id, {$addToSet: {members: user}})
      .exec();
  });
});
