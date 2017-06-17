var placedOnBoard = [];

(function drawGrid() {
  // var size = prompt('Enter grid size') || 20;
  var size = 25;
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
  // xmlhttp.open("GET", "mock-response.json", true);

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
      text: response[i].answer.toLowerCase(),
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

function createLetterInput(tile, firstWord, letter) {

  if (tile.classList.value.indexOf('empty') >= 0) {
    tile.classList.remove('empty');
  } else {
    tile.classList.add('blocked');
    // return;
  }

  var input = document.createElement("input");

  input.className = "letter-box";
  input.setAttribute('type', 'text');
  input.setAttribute('data-number', firstWord.no);
  input.setAttribute('maxLength', '1');
  input.setAttribute('value', letter);

  //uncomment when debugged
  // input.addEventListener('click', toggleHighlight(input));

  tile.appendChild(input);
}

function getDistance(sortedAnswers, direction) {
  var word1 = sortedAnswers[0].text;
  var word2 = sortedAnswers[1].text;

  for (var i = 0; i < word2.length; i++) {
    var indexOf = word1.indexOf(word2[i]);
    var matchingWordLen = word2.length;

    if (indexOf >= 0) {
      return i;
    }
  }
}

function placeWords(sortedAnswers, direction, randXY, dist) {
  if (!sortedAnswers.length) {
    return;
  }

  var firstWord = sortedAnswers[0];
  var nextWord = sortedAnswers[1];
  var rowsColsAmount = document.getElementsByClassName('answer-row').length;
  var dir = direction || setDirection();
  var randXY = randXY || getDistance(sortedAnswers);
  var maxDist = dist || 0;

  if (dir === 'horizontal') {

    for (var x = 0; x < firstWord.length; x++) {
      var tile = document.querySelectorAll('[data-x="' + (maxDist + x) + '"][data-y="' + randXY + '"]')[0];
      var letter = firstWord.text[x];

      createLetterInput(tile, firstWord, letter);
    }
    searchLetterMatches(sortedAnswers, maxDist, randXY, 'vertical');
  }

  if (dir === 'vertical') {
    for (var y = 0; y < firstWord.length; y++) {
      var tile = document.querySelectorAll('[data-y="' + (maxDist + y) + '"][data-x="' + randXY + '"]')[0];
      var letter = firstWord.text[y];

      createLetterInput(tile, firstWord, letter);
    }
    searchLetterMatches(sortedAnswers, maxDist, randXY, 'horizontal');
  }
}

function searchLetterMatches(sortedAnswers, maxDist, randXY, direction) {
  var word1 = sortedAnswers[0].text;
  var rowsColsAmount = document.getElementsByClassName('answer-row').length;

  if (sortedAnswers.length > 1) {
    var word2 = sortedAnswers[1].text;
  }

  for (var i = 0; i < word2.length; i++) {
    var indexOf = word1.indexOf(word2[i]);
    var spaceLeft = rowsColsAmount - randXY;
    var matchingWordLen = word2.length;

    if (indexOf > 0 && spaceLeft >= matchingWordLen) {

      // console.log(word1 + ', ' + word2 + ', ' + indexOf);

      //TODO
      // count if enogh space to place next word
      //if not enough - iterate through next matching letters
      // if no matches in current word - skip to next word
      //if no space to place word legally - place randomly on board

      sortedAnswers = sortedAnswers.slice(1);
      placeWords(sortedAnswers, direction, indexOf, randXY - i);

      return;

    }
  }
}

//   //Math.rand choose one of previous words and place on board crossing with it
}

//
// function focusNextLetter() {};
// function validateAnswer() {};
