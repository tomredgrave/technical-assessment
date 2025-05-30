(() => {
  // IIFE to encapsulate code and prevent the answer being accessible from the console
  let components = {};

  function generateQuestion() {
    // generates 2 numbers between 1 and 10
    let num1 = Math.ceil(Math.random() * 10);
    const num2 = Math.ceil(Math.random() * 10);

    // creates an object of operation functions that take 2 arguments and return the result
    const equations = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '×': (a, b) => a * b,
      '÷': (a, b) => a / b
    };

    // loads the keys from the equation object into an array
    const operators = Object.keys(equations);
    // randomly selects an operator from the array
    const operator = operators[Math.floor(Math.random() * operators.length)];

    // guarantees the result of the operation will be a whole number if it's a division
    if (operator === '÷') {
      num1 *= num2;
    }

    // generates an answer based off the randomly selected numbers and operator
    const answer = equations[operator](num1, num2);
    // creates a string of the equation
    const question = `${num1} ${operator} ${num2}`;

    return {
      numbers: [num1, num2],
      operator: operator,
      question: question,
      answer: answer,
      falseAnswers: generateFalseAnswers(answer),
    };
  }

  function generateFalseAnswers(answer) {
    const falseAnswers = [];

    // loops until there are 2 false answers
    while (falseAnswers.length < 2) {
      // generates an offset between 1 and 5
      let offset = Math.ceil(Math.random() * 5);

      // 50% chance to either add or subtract the offset from the actual answer
      const falseAnswer = Math.random() < 0.5
        ? answer + offset
        : answer - offset;

      // guarantees the false answers are unique and not equal to the actual answer
      if (falseAnswer !== answer && !falseAnswers.includes(falseAnswer)) {
        falseAnswers.push(falseAnswer);
      }
    }

    return falseAnswers;
  }

  function renderQuestion() {
    // loads the correct answer and 2 false answers into an array
    const answers = [components.answer, components.falseAnswers[0], components.falseAnswers[1]];

    // performs a fisher-yates shuffle to randomise the order of the answers
    for (let i = answers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }

    const quizQuestion = document.querySelector('.quiz__question');
    const quizAnswers = document.querySelectorAll('.quiz__answer');
    // renders the question to the web page
    quizQuestion.textContent = `${components.question} = ?`;

    // renders the shuffled answers to the web page
    quizAnswers.forEach((quizAnswer, i) => {
      quizAnswer.textContent = answers[i];
    })
  }

  function checkAnswer(choice) {
    const quizAnswers = document.querySelectorAll('.quiz__answer');

    // disables input from the user
    quizAnswers.forEach((quizAnswer) => {
      quizAnswer.style.pointerEvents = 'none';
    });

    const quizStreak = document.querySelector('.quiz__streak span');

    if (Number(choice.textContent) === components.answer) {
      // if the answer is correct then correct class is added and streak is incremented by 1
      choice.classList.add('quiz__answer--correct');
      let streak = Number(quizStreak.textContent);
      quizStreak.textContent = ++streak;

      if (streak > localStorage.getItem('quizBest')) {
        // if current streak is greater than best streak then best streak is updated and saved to local storage
        const quizBest = document.querySelector('.quiz__best span');
        quizBest.textContent = streak;
        localStorage.setItem('quizBest', streak);
      }
    } else {
      // if answer is incorrect then incorrect class is added and current streak is reset to 0
      choice.classList.add('quiz__answer--incorrect');
      quizStreak.textContent = 0;
    }

    setTimeout(() => {
      // 500ms timeout so the user can see the outcome of their answer
      quizAnswers.forEach((quizAnswer) => {
        // removes correct/incorrect class and enables user input
        quizAnswer.classList.remove('quiz__answer--correct', 'quiz__answer--incorrect');
        quizAnswer.style.pointerEvents = 'auto';
      })

      quizLoop();
    }, 500)
  }

  function setupEventListeners() {
    const quizAnswers = document.querySelectorAll('.quiz__answer');

    // adds an event listener to each of the answer elements that passes itself to the checkAnswer function on click
    quizAnswers.forEach((quizAnswer) => {
      quizAnswer.addEventListener('click', () => {
        checkAnswer(quizAnswer);
      })
    })
  }

  function loadLocalStorage() {
    const quizBest = document.querySelector('.quiz__best span');

    if (localStorage.getItem('quizBest') !== null) {
      // if there is a best streak stored in local storage then it is rendered to the page
      quizBest.textContent = localStorage.getItem('quizBest');
    }
  }

  function quizLoop() {
    components = generateQuestion();
    renderQuestion();
  }

  setupEventListeners();
  loadLocalStorage();
  quizLoop();
})();
