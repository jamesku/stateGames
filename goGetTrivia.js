const getJSON = require('get-json');
var jsonfile = require('jsonfile');
var fileE = './trivia/triviaEasy.json';
var fileM = './trivia/triviaMedium.json';
var fileH = './trivia/triviaHard.json';

var easyQs = [];
var hardQs = [];
var mediumQs = [];

var exports = module.exports = {};


exports.goGetTrivia = function(triviaCategory){

  function shuffleArray(array){
    for (var i = array.length -1; i>0; i--){
      var j = Math.floor(Math.random() * (i+1));
      var temp = array[i];
      array[i]=array[j];
      array[j]=temp;
    }
    return(array);
  }

  let webAddressEasy = "https://opentdb.com/api.php?amount=5&category="+ triviaCategory + "&difficulty=easy&type=multiple";
  let webAddressMed = "https://opentdb.com/api.php?amount=5&category="+triviaCategory+"&difficulty=medium&type=multiple";
  let webAddressHard = "https://opentdb.com/api.php?amount=5&category="+triviaCategory+"&difficulty=hard&type=multiple";

 getJSON(webAddressEasy,function(error, response){
    easyQs = easyQs.concat(response.results);
    // jsonfile.writeFile(fileE, obj, {flag: 'a'}, function (err) {
    //   if(err){console.error(err)};
    // })
    easyQs.forEach(function(obj){
      var correctAnswer = obj.correct_answer;
      var answerArray = obj.incorrect_answers;
      answerArray.push(correctAnswer);
      answerArray = shuffleArray(answerArray);
      obj.incorrect_answers = answerArray;
    });
    console.log(easyQs);

  });

  getJSON(webAddressMed,function(error, response){
    mediumQs = mediumQs.concat(response.results);
    // jsonfile.writeFile(fileM, obj, {flag: 'a'}, function (err) {
    //   if(err){console.error(err)};
    // })
    mediumQs.forEach(function(obj){
      var correctAnswer = obj.correct_answer;
      var answerArray = obj.incorrect_answers;
      answerArray.push(correctAnswer);
      answerArray = shuffleArray(answerArray);
      obj.incorrect_answers = answerArray;
    });
  });

  getJSON(webAddressHard,function(error, response){
    hardQs = hardQs.concat(response.results);
    // jsonfile.writeFile(fileH, obj, {flag: 'a'}, function (err) {
    //   if(err){console.error(err)};
    // })
    hardQs.forEach(function(obj){
      var correctAnswer = obj.correct_answer;
      var answerArray = obj.incorrect_answers;
      answerArray.push(correctAnswer);
      answerArray = shuffleArray(answerArray);
      obj.incorrect_answers = answerArray;
    });
  });


}

exports.returnTrivia = function(){
  return([easyQs, hardQs, mediumQs]);
}
