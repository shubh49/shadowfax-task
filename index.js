var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = [];
var userResponse = {};
var flag = false;
var client_id;
// var clients = io.sockets.clients();

app.use("/static", express.static(__dirname+'/static'));

app.get('/', function(req, res){
        res.sendFile(__dirname+'/homepage.html');
});

app.get('/stage*', function(req, res) {
    res.sendFile(__dirname+'/index.html');
})

io.sockets.on('connection', function(socket){
    // console.log(clients);
    socket.on('create', function(room) {
        //console.log(room);
        socket.join(room);
        // console.log(room);
        clients.push(socket.id);
        // console.log(clients);
        var rom = io.sockets.adapter.rooms[room];
        console.log(rom);
        a = Object.keys(rom).length;
        console.log(a);
        if(a == 1) {
            msg = 'You are the first one here. So you would have to wait till you are paired with someone!'
            socket.emit('roomCreated', msg);
        }
        if(a == 2) {
            msg = 'You have got a pair. Choose your option and proceed.';
            socket.broadcast.to(clients[0]).emit('gotPair', msg);
            msg2 = 'You are paired with someone. So no need to wait. Enjoy!'
            socket.emit('gotPair', msg2);
        }
        if (a > 2) {
            msg = 'Sorry maximum limit reached. Comeback later!'
            socket.emit('limitReached', msg);
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
            // consol e.log(userResponse);
            if(Object.keys(userResponse).length == 1) {
                msg = 'Your choice is registered. Waiting for other user response';
                socket.emit('registered', msg);
            }
            else {
                msg = 'Choices did not match. Try Again.'
                io.emit('misMatch', msg);
            }
        }
        else {
            if(userResponse[choiceNo] != socket.id) {
                msg = 'Choices matched! Enjoy next stage.'
                io.emit('match', msg);
                // console.log('success');
            }
            else {
                msg = 'This choice is already registered by you. Wait for other user.'
                socket.emit('alreadyRegistered', msg);
            }
        }
    });

    socket.on('nextStage', function(room) {
            if (!flag) {
                userResponse = {};
                flag = true;
            }
            else {
                flag = false;
            }
            io.emit('getNextStage', room);
    });

    socket.on('disconnect', function() {
        console.log('disconnet');
        msg = 'Sad! Your pair disconneted so you will be redirected to homepage.';
        console.log(msg);
        for (var i = 0; i < clients.length; i++) {
          if (clients[i] != socket.id) {
            client_id = clients[i];
            break;
          }
        }
        socket.broadcast.to(client_id).emit('disconnected', msg);
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
    });

    socket.on('chat message', function(msg){
            io.emit('chat message', msg);
    });
});

http.listen(process.env.PORT || 3000,function(){
        console.log('listening on *:3000');
});
