const express = require('express');
const app = express();
const WebSocket = require('ws');
const goGetTrivia = require('./goGetTrivia.js');
const jsonfile = require('jsonfile');

var server = require('http').createServer(app);
const wss = new WebSocket.Server({server});
var path = require('path');

// var fileE = './trivia/triviaEasy.json';
// var fileM = './trivia/triviaMedium.json';
// var fileH = './trivia/triviaHard.json';
var easyQs = [];
var hardQs = [];
var mediumQs = [];

let webSockets = {}; // userID: webSocket
let messageBack = "";
let playerArray = [];
let categories = [];
let colorArray = [
  'red',
  'blue',
  'purple',
  'green',
  'orange',
  'yellow',
  'brown',
  'gray',
  'gold',
  'white',
  'pink'
];
let turn = 0;
let playernumber = 0;
let readyCount = 0;
let trivia = [];
let initialSplicePoint;
let thisPlayerDesignation;
let stage;
const port = process.env.PORT || 5000;

server.listen(port, function() {
  console.log('WS Server listening at port %d', port);
});

wss.on('connection', function(client, req) {
  //New Connection

  client.on('close', function() {})

  client.on('message', function incoming(msg) {
    msg = JSON.parse(msg);
    switch (msg.type) {
      case "setName":
        let oldplayer = false;
        playerArray.forEach((player)=>{
            if(player.playername === msg.name){
                thisPlayerDesignation = 'player' + player.playernumber;
                console.log(thisPlayerDesignation+" reconnecting");
                webSockets[thisPlayerDesignation] = client;
                oldplayer = true;
                if(player.playernumber===turn){
                  if (stage === "difficultySelection"){
                    messageBack = '{"type":"YourTurnToSelectDifficulty"}';
                    webSockets[thisPlayerDesignation].send(messageBack);
                  } else {
                    messageBack = '{"type":"YourTurnToSelectAnAnswer"}';
                    webSockets[thisPlayerDesignation].send(messageBack);
                  }
                }
            }
        });

        if(!oldplayer){
      //make a player
      thisPlayerDesignation = 'player' + playernumber;
      console.log(thisPlayerDesignation);
      //record which player uses which socket
      webSockets[thisPlayerDesignation] = client;

        let playercolor = colorArray[playernumber];
        thisplayer = {
          playernumber: playernumber,
          playername: msg.name,
          playerboardposition: 1,
          playercolor: playercolor
        };
        playernumber++;

        //add the player to the game
        playerArray.push(thisplayer);
        //add a type for a message and send it to client and gameboard
        thisplayer['type'] = 'playerSetup';
        messageBack = JSON.stringify(thisplayer);
        client.send(messageBack);
        webSockets["gameboard"].send((messageBack))
        //console player joined
        console.log('connected: ' + thisplayer );
      }
        break;
      case "signalReady":
        goGetTrivia.goGetTrivia(msg.categoryNumber);
        readyCount++;
        //when someone is ready, send their preferred category out
        messageBack = JSON.stringify({type: 'categorySetup', category: msg.category});
        webSockets["gameboard"].send((messageBack));
        //record the category on the server
        categories.push(msg.category);
        //go hit the API to populate the local JSON files with trivia

          if (readyCount === playernumber) {
            turn = Math.floor(Math.random() * (readyCount));

            trivia = goGetTrivia.returnTrivia();
            initialSplicePoint = Math.floor(Math.random() * (trivia[1].length));
            hardquestion = trivia[1].splice(initialSplicePoint, 1);
            console.log(JSON.stringify(hardquestion));
            category = hardquestion[0].category;
            console.log("category: " + category);
            easyquestion = trivia[0].splice(initialSplicePoint, 1);
            mediumquestion = trivia[2].splice(initialSplicePoint, 1);

            messageBack = JSON.stringify({type: 'readyPlayerTurn',
                                          turn: turn,
                                          category:category,
                                          hardquestion:hardquestion[0],
                                          easyquestion:easyquestion[0],
                                          mediumquestion:mediumquestion[0],
                                        });
            webSockets["gameboard"].send((messageBack));
          }

        //if everyone is ready pick who our first player is going to be
        break;
      case "gameboardconnected":
        webSockets["gameboard"] = client;
        console.log('connected: ' + "gameboard");
        break;
      case "submitChoice":
        messageBack = JSON.stringify(msg);
        webSockets["gameboard"].send(messageBack);
        break;
      case "readyForDifficultySelection":
        stage = "difficultySelection";
        thisPlayerDesignation = 'player' + turn;
        console.log("answers from"+thisPlayerDesignation);
        messageBack = '{"type":"YourTurnToSelectDifficulty"}';
        webSockets[thisPlayerDesignation].send(messageBack);
        break;
      case "readyForAnswerSelection":
        stage = "answerSelection";
        thisPlayerDesignation = 'player' + turn;
        messageBack = '{"type":"YourTurnToSelectAnAnswer"}';
        webSockets[thisPlayerDesignation].send(messageBack);
        break;
      case "hard":
        messageBack = '{"type":"hardQuestion"}';
        webSockets["gameboard"].send(messageBack);
        break;
      case "medium":
        console.log("selection is medium");
        messageBack = '{"type":"mediumQuestion"}';
        webSockets["gameboard"].send(messageBack);
      break;
      case "easy":
        messageBack = '{"type":"easyQuestion"}';
        webSockets["gameboard"].send(messageBack);
      break;
      case "A":
        messageBack = '{"type":"A"}';
        webSockets["gameboard"].send(messageBack);
      break;
      case "B":
        messageBack = '{"type":"B"}';
        webSockets["gameboard"].send(messageBack);
      break;
      case "C":
        messageBack = '{"type":"C"}';
        webSockets["gameboard"].send(messageBack);
      break;
      case "D":
        messageBack = '{"type":"D"}';
        webSockets["gameboard"].send(messageBack);
      break;
      case "correctAnswer":
        //update trivia for lag in categories
        trivia = goGetTrivia.returnTrivia();
        turn = msg.turn;
        turn++;
        if(turn > playernumber-1){
          turn = 0;
        }
        //eliminate question already ask
        if(initialSplicePoint){
          trivia[1].splice(initialSplicePoint, 1);
          trivia[0].splice(initialSplicePoint, 1);
          trivia[2].splice(initialSplicePoint, 1);
          initialSplicePoint = false;
        }

        let splicePoint = Math.floor(Math.random() * (trivia[1].length));

        hardquestion = trivia[1].splice(splicePoint, 1);
        easyquestion = trivia[0].splice(splicePoint, 1);
        mediumquestion = trivia[2].splice(splicePoint, 1);
        category = hardquestion[0].category;

        messageBack = JSON.stringify({type: 'readyPlayerTurn',
                                                turn: turn,
                                                category:category,
                                                hardquestion:hardquestion[0],
                                                easyquestion:easyquestion[0],
                                                mediumquestion:mediumquestion[0],
                                              });
        webSockets["gameboard"].send((messageBack));
      break;
      case "wrongAnswer":
        stage = "answerSelection";
        turn++;
        if(turn > playernumber-1){
          turn = 0;
        }
        console.log("wrong answer, turn = " + turn);
        messageBack = '{"type":"YourTurnToSelectAnAnswer"}';
        thisPlayerDesignation = 'player' + turn;
        webSockets[thisPlayerDesignation].send(messageBack);
      break;

      default:
        return;
    }
  });

});

// webSocket.on('message', function(message) {
//   console.log('received from ' + userID + ': ' + message)
//   var messageArray = JSON.parse(message)
//   var toUserWebSocket = webSockets[messageArray[0]]
//   if (toUserWebSocket) {
//     console.log('sent to ' + messageArray[0] + ': ' + JSON.stringify(messageArray))
//     messageArray[0] = userID
//     toUserWebSocket.send(JSON.stringify(messageArray))
//   }
// })
