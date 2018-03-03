const express = require('express');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

// app.use(express.static(path.join(__dirname, 'public')));

let gameArray = []
let colorArray = ['red', 'blue', 'purple', 'green', 'orange', 'yellow', 'brown', 'gray', 'gold', 'white', 'pink'];
let turn = 0;
let playerassignment=0;
let readyCount=0;


const port = process.env.PORT || 5000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


io.on('connection', function (client) {
  console.log("client connected");

  //New Connection
  client.on('disconnect', function () {
      console.log('user disconnected');
   });

   client.on('gameboardconnected', function () {
       console.log('Gameboard connected');
    });

  // Playe Registers Name
  client.on('setName', function (givenName) {
    console.log("setnmaefired");
    playerassignment++;
    let thisplayer = 'player'+playerassignment;
    let color = colorArray[playerassignment-1];
    thisplayer = {
      playernumber: playerassignment,
      name:givenName,
      tile:0,
      color:color,
      ready:false
    };
    gameArray.push({thisplayer:thisplayer});
    console.log(gameArray);

    client.emit('playerSetup', {
      name: givenName,
      playerassigned: playerassignment,
      playercolor:color
    });

    client.broadcast.emit('userjoined', {
      name: givenName,
      playerassigned: playerassignment,
      playercolor:color
      });

  });

  //New Connection
  client.on('ready', function () {
    readyCount++;
    if(readyCount===playerassignment){
    console.log(readyCount +  'players ready to go');
    }
   });

});
  // // when the client emits 'add user', this listens and executes
  // socket.on('add user', function (username) {
  //   if (addedUser) return;
  //
  //   // we store the username in the socket session for this client
  //   socket.username = username;
  //   ++numUsers;
  //   addedUser = true;
  //   socket.emit('login', {
  //     numUsers: numUsers
  //   });
  //
  //   // echo globally (all clients) that a person has connected

  //
  // // when the client emits 'typing', we broadcast it to others
  // socket.on('typing', function () {
  //   socket.broadcast.emit('typing', {
  //     username: socket.username
  //   });
  // });
  //
  // // when the client emits 'stop typing', we broadcast it to others
  // socket.on('stop typing', function () {
  //   socket.broadcast.emit('stop typing', {
  //     username: socket.username
  //   });
  // });
  //
  // // when the user disconnects.. perform this
  // socket.on('disconnect', function () {
  //   if (addedUser) {
  //     --numUsers;
  //
  //     // echo globally that this client has left
  //     socket.broadcast.emit('user left', {
  //       username: socket.username,
  //       numUsers: numUsers
  //     });
  //   }
  // });
