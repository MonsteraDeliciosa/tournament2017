(function drawGrid() {
  var table = document.getElementsByClassName('crossword-table')[0];
  console.log(table);

  for (var y = 0; y < 20; y++) {
    var row = document.createElement("DIV");
    row.className = "answer-row";

    for (var x = 0; x < 20; x++) {
      var box = document.createElement("DIV");
      box.className = "answer-box bordered-gray horizontal";
      box.setAttribute('id', x + '_' + y);
      row.appendChild(box);
    }

    table.appendChild(row);
  }
  // var answerContainer = document.createElement("DIV");
})();

(function getStrings() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {

    if (xmlhttp.readyState == XMLHttpRequest.DONE) {

      if (xmlhttp.status == 200) {
        var response = JSON.parse(xmlhttp.responseText);
        printQuestions(response);
        sortAnswers(response);

      } else if (xmlhttp.status == 400) {
        console.log("There was an error 400");
      } else {
        console.log("something else other than 200 was returned");
      }
    }
  };

  xmlhttp.open("GET", "https://rocky-shore-45098.herokuapp.com", true);
  xmlhttp.send();

})();

function printQuestions(response) {
  var list = document.getElementsByClassName('answer-list')[0];

  for (var i = 0; i < response.length; i++) {

    var question = response[i].question;
    var answer = response[i].answer;

    var questionNode = document.createElement("P");
    questionNode.className = "question-paragraph";
    var questionStr = document.createTextNode(i + '. ' + question);

    console.log(i + '. ' + question);
    console.log(i + '. ' + answer);

    questionNode.appendChild(questionStr);
    list.appendChild(questionNode);
  }
}

function sortAnswers(response) {
  var answerArr = [];

  for (var i = 0; i < response.length; i++) {
    var answer = {
      no: i,
      text: response[i].answer,
      length: response[i].answer.length
    };

    answerArr.push(answer);
  }

  var sortedDesc = answerArr.sort(function(a, b) {
    return b.text.length - a.text.length;
  });

  console.log(sortedDesc);

  placeOnBoard(sortedDesc);
}

function placeOnBoard(wordsArray) {
  var placed = document.getElementsByClassName('letter-box');

  if (!placed.length) {

    // for (var j = 0; j < answer.length; j++) {
    //
    //   var input = document.createElement("input");
    //
    //   input.className = "answer-box";
    //   input.setAttribute('type', 'text');
    //   input.setAttribute('maxLength', '1');
    //
    //   answerContainer.appendChild(input);
    // }

  }
}

//TODO
//
// function checkMatchingLetters(answer) {
//
//   // let previous;
//
//   /*TODO
//   * check if letters match
//   * if so - render in opposite direction:
//     - slice answer: prefix-commonPart-appendix
//
//   */
//
// };
//
// function focusNextLetter() {};
// function validateAnswer() {};
