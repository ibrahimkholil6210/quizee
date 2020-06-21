const quizContainer = document.querySelector('#quiz-container');
const questionContainer = document.querySelector('#question-container');
const startBtn = document.querySelector('#start_btn');
const submitBtn = document.querySelector('#next_btn');
const questionElement = document.querySelector('#question-element');
const answerbtnsContainer = document.querySelector('#answer-btn-container');

let shuffledQustion, currentQuestion = 0, checkedAnswerArray = [];

startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', checkAnswer);


async function startQuiz(e) {
    submitBtn.classList.remove('hide');
    startBtn.classList.add("hide");
    const fetchQuestion = await fetch('http://localhost:3000/api/quizs');
    const questionData = await fetchQuestion.json();
    shuffledQustion = questionData.sort(() => Math.random() - .5);
    setNextQuestion();
}

function setNextQuestion() {
    showNextQuestion(shuffledQustion[currentQuestion]);
}

function showNextQuestion(question) {
    questionElement.textContent = question.question;
    const options = question.options.split(',');
    options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add('btn-primary');
        btn.classList.add('btn-answer');
        btn.dataset.id = index;
        btn.dataset.question = question.id;
        btn.textContent = option;
        if (index === parseInt(question.answer)) {
            btn.dataset.correct = question.answer;
        }
        btn.addEventListener('click', toggleActive);
        answerbtnsContainer.appendChild(btn);
    });
}

function toggleActive(e) {
    const btnId = e.target.dataset.id;
    const questionId = e.target.dataset.answer;
    const nodeList = document.querySelectorAll('.btn-answer');
    const nodeArray = Array.from(nodeList);
    nodeArray.forEach((node, index) => {
        if (node.dataset.id === btnId) {
            node.classList.toggle('active');
        } else {
            node.classList.remove('active');
        }
    });
}

function checkAnswer(e) {
    const answerBtn = document.querySelectorAll('.btn-answer');
    const answerBtnArray = Array.from(answerBtn);
    answerBtnArray.forEach(answer => {
        const checkActive = answer.classList.contains('active');
        if (checkActive) {
            if (answer.dataset.correct) {
                const resultObj = Object.assign({}, { qid: answer.dataset.question, check: true });
                checkedAnswerArray.push(resultObj);
                console.log("Anwer is correct!");
            } else {
                const resultObj = Object.assign({}, { qid: answer.dataset.question, check: false });
                checkedAnswerArray.push(resultObj);
                console.log("Answer is not correct!");
            }
        }
    });
    console.log(checkedAnswerArray);
}