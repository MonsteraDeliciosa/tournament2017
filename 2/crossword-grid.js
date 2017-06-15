(function drawGrid() {
  // var size = prompt('Enter grid size') || 20;
  var size = 20;
  var table = document.getElementsByClassName('crossword-table')[0];

  for (var y = 0; y < size; y++) {
    var row = document.createElement("DIV");
    row.className = "answer-row";

    for (var x = 0; x < size; x++) {
      var box = document.createElement("DIV");
      box.className = "answer-box bordered-gray empty";
      box.setAttribute('data-x', x);
      box.setAttribute('data-y', y);
      box.setAttribute('id', x + '_' + y);
      row.appendChild(box);
    }

    table.appendChild(row);
  }
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
        console.log("error 400");
      } else {
        console.log("something else other than 200 was returned");
      }
    }
  };

  xmlhttp.open("GET", "https://rocky-shore-45098.herokuapp.com", true);
  xmlhttp.send();

})();

function toggleHighlight(element) {
  var no = element.getAttribute('data-number');
  var question = document.querySelectorAll('[data-answer-number="' + no + '"]')[0];

  if (question.classList === 'question-paragraph highlighted') {
    question.classList.remove('highlighted');
  } else {
    question.classList.add('highlighted');
  }
}

function printQuestions(response) {
  var list = document.getElementsByClassName('answer-list')[0];

  for (var i = 0; i < response.length; i++) {

    var question = response[i].question;
    var answer = response[i].answer;

    var questionNode = document.createElement("P");
    questionNode.className = "question-paragraph";
    questionNode.setAttribute('data-answer-number', i);
    var questionStr = document.createTextNode(i + '. ' + question);

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

  placeWords(sortedDesc);
}

function setDirection() {
  var toss = Math.round(Math.random());

  if (toss) {
    return 'horizontal';
  } else {
    return 'vertical';
  }
}

function createLetterInput(input, tile, firstWord, letter) {
  input.className = "letter-box";
  input.setAttribute('type', 'text');
  input.setAttribute('data-number', firstWord.no);
  input.setAttribute('maxLength', '1');
  input.setAttribute('value', letter);
  // input.addEventListener('click', toggleHighlight(input));

  tile.appendChild(input);
  tile.classList.remove('empty');
}

function placeWords(sortedAnswers, direction) {
  var firstWord = sortedAnswers[0];
  var otherWords = sortedAnswers.slice(1);
  var dir = direction || setDirection();
  var rows = document.getElementsByClassName('answer-row').length;
  var randomXY = Math.floor(Math.random() * rows);

  if (!sortedAnswers.length) {
    return;
  }

  if (dir === 'horizontal') {

    var num = Math.floor(Math.random() * (rows - firstWord.length));

    for (var x = 0; x < firstWord.length; x++) {
      var tile = document.querySelectorAll('[data-x="' + (num + x) + '"][data-y="' + randomXY + '"]')[0];
      var input = document.createElement("input");
      var letter = firstWord.text[x];

      createLetterInput(input, tile, firstWord, letter);
    }

    sortedAnswers = sortedAnswers.slice(1);
    placeWords(sortedAnswers, 'vertical');
  }

  if (dir === 'vertical') {

    var num = Math.floor(Math.random() * (rows - firstWord.length));

    for (var y = 0; y < firstWord.length; y++) {
      var tile = document.querySelectorAll('[data-y="' + (num + y) + '"][data-x="' + randomXY + '"]')[0];
      var input = document.createElement("input");
      var letter = firstWord.text[y];

      createLetterInput(input, tile, firstWord, letter);
    }

    sortedAnswers = sortedAnswers.slice(1);
    placeWords(sortedAnswers, 'horizontal');
  }
}

function placeOtherWords(words, direction) {
  var firstWord = words[0];
  var otherWords = words.slice(1);
}

function placeOnBoard(wordsArray) {
  var placed = document.getElementsByClassName('letter-box');

  function findEmptySpace(word, axis, axisNo) {

    var rowAxis = document.querySelectorAll('[data-' + axis + '="' + axisNo + '"]');
    var filtered = [];

    function findEmptyTile() {
      var firstEmpty = rowAxis.querySelectorAll('.empty')[0];
    }

    for (var i = 0; i < rowAxis.length; i++) {
      if (rowAxis[i].childNodes.length === 0) {
        filtered.push(rowAxis[i]);
      } else {
        filtered = [];
        //start the loop with next empty element
      }
    }
  }

  //
  // else {
  //   //for every letter of current word check if matches any of previous word
  //   //Math.rand choose one of previous words and place on board crossing with it
  //
  //   if (!matches.length) {
  //     //find random n empty tiles where n === word length
  //   }
  // }
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
