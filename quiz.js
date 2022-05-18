const questions = [
    {
        text: "8 % 3 = ____",
        choices: [
            "2",
            "3",
            "4",
            "6"
        ],
        answer: "2",
        chosen: "",
        hint: "Remainder"
    },
    {
        text: "HTML stands for ____ Markup Language",
        choices: [
            "Hotswap",
            "Hypertext",
            "Helper",
            "Hypermedia"
        ],
        chosen: "",
        answer: "Hypertext"
    },
    {
        text: "1 === '1' evaluates to ____",
        choices: [
            "true",
            "false"
        ],
        chosen: "",
        answer: "false"
    },
    {
        text: "In a Redux application, the entire state tree is contained in the ____",
        choices: [
            "consumer",
            "action",
            "reducer",
            "store"
        ],
        chosen: "",
        answer: "store"
    },
    {
        text: "The Django framework is based on ____",
        choices: [
            "Java",
            "PHP",
            "Python",
            "None of the above"
        ],
        chosen: "",
        answer: "Python"
    }
];
let currentQuestion = 0;
const questionNavigation = document.querySelector(".questions");
const questionSection = document.querySelector(".question");
const choicesSection = document.querySelector(".choices");
const gradeButton = document.querySelector('.grade-button');

gradeButton.addEventListener('click', () => {
    gradeQuiz();
});

const init = () => {
    currentQuestion = 0;
    questions.forEach(question => {
        question.chosen = "";
    });

    questionNavigation.innerHTML = "";
    questionSection.innerHTML = "";
    choicesSection.innerHTML = "";

    const testingSection = document.querySelector('.testing__section');
    const gradeSection = document.querySelector('.grade__section');

    testingSection.style.display = "block";
    gradeSection.style.display = "none";

    renderNavigationMenu();
    renderQuestion(questions[currentQuestion].text);
    renderChoices(questions[currentQuestion].choices);
}

const renderNavigationMenu = () => {
    questions.forEach((question, i) => {
        const button = document.createElement("button");
        button.innerText = i + 1;
        button.addEventListener('click', () => navigateToQuestion(i));
        button.classList.add("navigation-button");
        if(i === 0) { button.classList.add("selected"); };
        questionNavigation.append(button);
    });
};

const renderQuestion = question => {
    questionSection.innerHTML = `<p class="md">Question ${currentQuestion + 1}<p> ${question}`;
}

const renderChoices = choices => {
    choices.forEach(choice => {
        let checked = "";
        if(choice === questions[currentQuestion].chosen) { checked = "checked"; };
        choicesSection.innerHTML += `<label><input type='radio' name='choice' ${checked}
        onChange='setAnswer("${choice}")' value='${choice}' style='vertical-align:baseline; margin-right: 5px'>
            ${choice}</label><br><br>`;
    });
}

const setAnswer = answer => {
    questions[currentQuestion].chosen = answer;
}

// highlight the current question in the navigation menu
const changeSelectedButton = (previous, selected) => {
    const buttons = document.getElementsByClassName("navigation-button");

    buttons[previous].classList.remove("selected");
    buttons[selected].classList.add("selected");
};

// handle previous and next buttons
const changeQuestion = value => {
    questionSection.innerHTML = '';
    choicesSection.innerHTML = '';

    const previousQuestion = currentQuestion;

    currentQuestion += value;
    if(currentQuestion < 0) { currentQuestion = 0; }
    if(currentQuestion > questions.length - 1) { currentQuestion = questions.length - 1; }

    changeSelectedButton(previousQuestion, currentQuestion);

    renderQuestion(questions[currentQuestion].text);
    renderChoices(questions[currentQuestion].choices);
}

// handle navigation menu buttons
const navigateToQuestion = index => {
    if(index !== currentQuestion) {
        changeSelectedButton(currentQuestion, index);

        questionSection.innerHTML = '';
        choicesSection.innerHTML = '';

        currentQuestion = index;

        renderQuestion(questions[currentQuestion].text);
        renderChoices(questions[currentQuestion].choices);
    }
};

const gradeQuiz = () => {
    const testingSection = document.querySelector('.testing__section');
    const gradeSection = document.querySelector('.grade__section');
    const grade = document.querySelector('.grade');

    testingSection.style.display = "none";
    gradeSection.style.display = "block";

    let score = 0;
    questions.forEach(question => {
        if(question.chosen === question.answer) {
            score++;
        }
    });

    grade.innerHTML = `<h2 class="results-heading">Results</h2>`
    grade.innerHTML += `<p>You answered ${score} out of ${questions.length} questions correctly</p>`;

    grade.innerHTML += `<h2 class="review-heading">Review</h2>
        <p>Below are all the questions and their correct answers</p>`;
    
    questions.forEach((question, index) => {
        grade.innerHTML += `<p style='font-size:20px'>${question.text}</p>
            <p style='margin-left: 20px'>${question.answer}
            <i class='fas fa-check' style='color:green'></i></p>`;

        if(question.chosen === "") {
            grade.innerHTML += `<p style='margin-left: 20px'>No answer chosen
                <i class="fas fa-times" style="color:red"></i></p>`;
        }
        else if(question.chosen !== question.answer) {
            grade.innerHTML += `<p style='margin-left: 20px'>${question.chosen}
            <i class="fas fa-times" style="color:red"></i></p>`;
        }

        if(index !== questions.length - 1) {
            grade.innerHTML += `<hr style = 'margin-bottom: 20px'>`;
        }
    });

    grade.innerHTML += `<button class='retry-button' onclick='init()'>Retry</button>`;
};

init();