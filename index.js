var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [];
var userResponse = {};
// var clients = io.sockets.clients();

app.use("/static", express.static(__dirname+'/static'));

app.get('/', function(req, res){
    res.sendFile(__dirname+'/homepage.html');
});

app.get('/stage*', function(req, res) {
  res.sendFile(__dirname+'/index.html');
})

io.on('connection', function(socket){
    // console.log(clients);
    socket.on('create', function(room) {
      //console.log(room);
      socket.join(room);
      console.log(room);
      clients.push(socket.id);
      console.log(clients);
      var rom = io.sockets.adapter.rooms[room];
      // console.log(io.sockets.adapter.rooms);
      // console.log(rom);
      a = Object.keys(rom).length;
      if(a == 1) {
        msg = 'You are the first one here. So you would have to wait till you are paired with someone!'
        socket.emit('room_created', msg);
      }
      if(a == 2) {
        msg = 'You have got a pair. Choose your option and proceed.';
        socket.broadcast.to(clients[0]).emit('got_pair', msg);
      }
      if (a > 2) {
        msg = 'Sorry maximum limit reached. Comeback later!'
        socket.emit('limit_reached', msg);
        socket.leave(room);
      }
    });

    socket.on('choice', function(choiceNo) {
      // console.log(choiceNo);
      if(!userResponse[choiceNo]) {
        for (var i = 0; i < 4; i++) {
          if(userResponse[i] == socket.id) {
            delete userResponse[i];
          }
        }
        userResponse[choiceNo] = socket.id;
        if(Object.keys(userResponse).length == 1) {
          msg = 'Your choice is registered. Waiting for other user response';
          socket.emit('registered', msg);
        }
        else {
          msg = 'Choices did not match. Try Again.'
          io.emit('mismatch', msg);
        }
      }
      else {
        if(userResponse[choiceNo] != socket.id) {
          msg = 'Choices matched! Enjoy next stage.'
          io.emit('match', msg);
          // console.log('success');
        }
      }
      // userResponse[choiceNo] = socket.id;
      // console.log(userResponse);
      // console.log(userResponse.indexOf(choiceNo));
    });

    socket.on('nextStage', function(room) {
        io.emit('getNextStage', room);
    })

    socket.on('disconnet', function() {
      msg = 'Sad! Your pair disconneted so you will be redirected to homepage.';
      console.log(msg);
      for (var i = 0; i < clients.length; i++) {
        if (clients[i] != socket.id) {
          client_id = clients[i];
          break;
        }
      }
      socket.broadcast.to(client_id).emit('disconneted', msg);
    });

  //   socket.onclose = function() {
  //   var client_id;
  //   msg = 'Sad! Your pair disconneted so you will be redirected to homepage.';
  //   console.log(msg);
  //   for (var i = 0; i < clients.length; i++) {
  //     if (clients[i] != socket.id) {
  //       client_id = clients[i];
  //       break;
  //     }
  //   }
  //   socket.broadcast.to(client_id).emit('disconneted', msg);
  // };

    socket.on('join', function(room) {
      console.log(room);
      io.emit('join', room);
    })

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(3000,function(){
    console.log('listening on *:3000');
});
