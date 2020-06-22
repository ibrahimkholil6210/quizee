const quizContainer = document.querySelector('#quiz-container');
const questionContainer = document.querySelector('#question-container');
const startBtn = document.querySelector('#start_btn');
const submitBtn = document.querySelector('#next_btn');
const questionElement = document.querySelector('#question-element');
const answerbtnsContainer = document.querySelector('#answer-btn-container');
const restartBtn = document.querySelector('#restart_btn');
const resultContainer = document.querySelector('.result-container');

let shuffledQustion, currentQuestion = 0, checkedAnswerArray = [];

startBtn.addEventListener('click', startQuiz);
submitBtn.addEventListener('click', checkAnswer);
restartBtn.addEventListener('click', restartQuiz);



async function startQuiz(e) {
    while (resultContainer.hasChildNodes()) {
        resultContainer.removeChild(resultContainer.lastChild);
    }
    resultContainer.classList.add('hide');
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
    currentQuestion++;
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
            } else {
                const resultObj = Object.assign({}, { qid: answer.dataset.question, check: false });
                checkedAnswerArray.push(resultObj);
            }
        }
    });

    resetUI();

    if (shuffledQustion.length > currentQuestion) {
        setNextQuestion();
    } else {
        endQuizWithMsg();
    }
}

function resetUI() {
    questionElement.textContent = "";
    while (answerbtnsContainer.hasChildNodes()) {
        answerbtnsContainer.removeChild(answerbtnsContainer.lastChild);
    }
}

function endQuizWithMsg() {

    let totalScore = 0, totalNumberOfCorrectAnswer = 0;

    checkedAnswerArray.forEach(answer => {
        if (answer.check) {
            totalScore += 10;
            totalNumberOfCorrectAnswer += 1;
        }
    });
    const Layout = `
        <div class="total-numberof-question">
            <p class="result-title">Total Number of Question<span
                    class="material-icons ml-8p">card_giftcard</span></p>
            <p class="score">${shuffledQustion.length}</p>
        </div>
        <div class="answer-true-false">
            <p class="result-title"><span>Correct <span
                        class="material-icons ml-8p">check_circle_outline</span></span>
                <span class="material-icons mlr-5">code</span> <span>Wrong <span
                        class="material-icons ml-10p">delete_forever</span></span></p>
            <p class="score d-flex"><span>${totalNumberOfCorrectAnswer}</span> <span class="material-icons mlr-5">code</span>
                <span>${shuffledQustion.length}</span></p>
        </div>
        <div class="total-score">
            <p class="result-title"><span>Score </span><span
                    class="material-icons ml-8p">verified</span>
            </p>
            <p class="score">${totalScore}</p>
        </div>
    `;
    resultContainer.classList.remove('hide');
    resultContainer.innerHTML = Layout;
    submitBtn.classList.add('hide');
    restartBtn.classList.remove('hide');
}

function restartQuiz(e) {
    currentQuestion = 0;
    checkedAnswerArray = [];
    submitBtn.classList.remove('hide');
    restartBtn.classList.add('hide');
    startQuiz(e);
}