
document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quiz-form');
    const difficultySelect = document.getElementById('difficulty');
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const resultContainer = document.getElementById('result');
    const resultMessage = document.getElementById('result-message');
    let quizData = [];
    let currentQuestionIndex = 0;
    let score = 0;

    quizForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const difficulty = difficultySelect.value;
        quizData = await fetchQuizData(difficulty);
        startQuiz();
    });

    async function fetchQuizData(difficulty) {
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            alert('Error fetching quiz questions. Please try again.');
            console.error(error);
        }
    }

    function startQuiz() {
        quizForm.style.display = 'none';
        questionContainer.style.display = 'block';
        loadNextQuestion();
    }

    function loadNextQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionElement.innerText = currentQuestion.question;
        answersElement.innerHTML = '';
        shuffleAnswers([currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]).forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.addEventListener('click', () => checkAnswer(answer === currentQuestion.correct_answer));
            answersElement.appendChild(button);
        });
    }

    function shuffleAnswers(answers) {
        return answers.sort(() => Math.random() - 0.5);
    }

    function checkAnswer(isCorrect) {
        if (isCorrect) {
            score++;
            resultMessage.innerText = 'Correct!';
        } else {
            resultMessage.innerText = 'Wrong Answer.';
        }
        currentQuestionIndex++;
        setTimeout(() => {
            if (currentQuestionIndex < quizData.length) {
                loadNextQuestion();
            } else {
                endQuiz();
            }
        }, 1000);
    }

    function endQuiz() {
        questionContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        resultMessage.innerText = `Quiz finished! Your score: ${score} out of ${quizData.length}`;
    }
});
