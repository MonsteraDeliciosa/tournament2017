function getStrings() {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {

    if (xmlhttp.readyState == XMLHttpRequest.DONE) {

      if (xmlhttp.status == 200) {

        var response = JSON.parse(xmlhttp.responseText);
        var container = document.getElementsByClassName('crossword-container')[0];
        var list = document.getElementsByClassName('answer-list')[0];


        for (var i = 0; i < response.length; i++) {

          var question = response[i].question;
          var answer = response[i].answer;

          var answerNode = document.createElement("P");
          answerNode.className = "question-paragraph";
          var questionStr = document.createTextNode(i + '. ' + question);

          answerNode.appendChild(questionStr);
          list.appendChild(answerNode);

          var answerContainer = document.createElement("DIV");
          container.appendChild(answerContainer);

          if (i % 2 === 0) {
            answerContainer.className = "answer-container horizontal";
          }

          if (i % 2 !== 0) {
            answerContainer.className = "answer-container vertical";
          }

          var numberStr = document.createTextNode(i + '. ');
          answerContainer.appendChild(numberStr);

          for (var j = 0; j < answer.length; j++) {

            var input = document.createElement("input");

            input.className = "answer-box";
            input.setAttribute('type', 'text');
            input.setAttribute('maxLength', '1');

            answerContainer.appendChild(input);
          }
        }

      } else if (xmlhttp.status == 400) {
        console.log("There was an error 400");
      } else {
        console.log("something else other than 200 was returned");
      }
    }
  };

  xmlhttp.open("GET", "https://rocky-shore-45098.herokuapp.com", true);
  xmlhttp.send();

}

getStrings();

//TODO
// function focusNextLetter() {};
// function validateAnswer() {};
