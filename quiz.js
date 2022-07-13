import {
    questions,
    checkQuestion,
    addQuestion,
    currentQuestion,
    setCurrentQuestion,
    setAnswer
} from "./game.js";

const renderScreen = (screen, display) => {
    const screens = document.getElementsByTagName("main")[0].children;
    for(let i = 0; i < screens.length; i++) {
        screens[i].style.display = "none";
    }

    document.querySelector(screen).style.display = display;

    window.scrollTo(0, 0);
}

const startQuizButton = document.querySelector(".start-quiz__button");
const addQuestionPageButton = document.querySelector(".add-question-page__button");
const addQuestionBackButton = document.querySelector(".add-question__back-button");
const instructionsButton = document.querySelector(".instructions__button");
const instructionsBackButton = document.querySelector(".instructions__back-button");
const questionNavigation = document.querySelector(".questions");
const questionSection = document.querySelector(".question");
const choicesSection = document.querySelector(".choices");
const gradeButton = document.querySelector(".grade-button");
const addQuestionButton = document.querySelector(".add-question__button");

startQuizButton.addEventListener("click", () => {
    init();
});

addQuestionPageButton.addEventListener("click", () => {
    renderScreen(".add-question__section", "block");
})

addQuestionBackButton.addEventListener("click", () => {
    document.querySelector(".add-question__success").style.display = "none";
    document.querySelector(".add-question__errors").style.display = "none";
    renderScreen(".splash-screen__section", "flex");
})

instructionsButton.addEventListener("click", () => {
    renderScreen(".instructions__section", "block");
});

instructionsBackButton.addEventListener("click", () => {
    renderScreen(".splash-screen__section", "flex");
});

gradeButton.addEventListener("click", () => {
    gradeQuiz();
});

addQuestionButton.addEventListener("click", () => {
    document.querySelector(".add-question__success").style.display = "none";
    document.querySelector(".add-question__errors").style.display = "none";

    const text = document.querySelector(".new-question").value;

    let choices = [];

    const newChoices = document.getElementsByClassName("new-choice");

    for(let i = 0; i < newChoices.length; i++) {
        choices.push(newChoices[i].value);
    }

    let answer;
    const answers = document.getElementsByName("new-answer");
    for(var i = 0; i < answers.length; i++){
        if(answers[i].checked){
            answer = choices[parseInt(answers[i].value)];
        }
    }

    const newQuestion = {
        text,
        choices,
        chosen: "",
        answer
    };

    const errors = checkQuestion(newQuestion);
    if(errors.length === 0) {
        addQuestion(newQuestion);
        document.querySelector(".add-question__success").innerHTML = "<p>Question has been added</p>";
        document.querySelector(".add-question__success").style.display = "block";
    } else {
        let errorText = "";
        for(let i = 0; i < errors.length; i++) {
            errorText += `<p>${errors[i]}</p>`;
        }
        document.querySelector(".add-question__errors-list").innerHTML = errorText;

        document.querySelector(".add-question__errors").style.display = "block";
    }

    window.scrollTo(0, 0);
});

const init = () => {
    setCurrentQuestion(0);
    
    questions.forEach(question => {
        question.chosen = "";
    });

    questionNavigation.innerHTML = "";
    questionSection.innerHTML = "";
    choicesSection.innerHTML = "";

    renderScreen(".testing__section", "block");

    renderNavigationMenu();
    renderQuestion(questions[currentQuestion].text);
    renderChoices(questions[currentQuestion].choices);
}

const renderNavigationMenu = () => {
    questions.forEach((question, i) => {
        const button = document.createElement("button");
        button.innerText = i + 1;
        button.addEventListener("click", () => navigateToQuestion(i));
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
        class="choice__radio-button" value='${choice}' style='vertical-align:baseline; margin-right: 5px'>
            ${choice}</label>`;
        
        const choiceRadioButtons = document.getElementsByClassName("choice__radio-button");
        for(let i = 0; i < choiceRadioButtons.length; i++) {
            choiceRadioButtons[i].addEventListener("change", () => {
                setAnswer(choiceRadioButtons[i].value);
            });
        }
    });
}


// highlight the current question in the navigation menu
const changeSelectedButton = (previous, selected) => {
    const buttons = document.getElementsByClassName("navigation-button");

    buttons[previous].classList.remove("selected");
    buttons[selected].classList.add("selected");
};

const previousButton = document.querySelector(".previous__button");
const nextButton = document.querySelector(".next__button");
previousButton.addEventListener("click", () => {
    changeQuestion(-1);
});
nextButton.addEventListener("click", () => {
    changeQuestion(1);
});

// handle previous and next buttons
const changeQuestion = (value) => {
    questionSection.innerHTML = "";
    choicesSection.innerHTML = "";

    const previousQuestion = currentQuestion;

    setCurrentQuestion(currentQuestion + value);
    if(currentQuestion < 0) { setCurrentQuestion(0) }
    if(currentQuestion > questions.length - 1) { setCurrentQuestion(questions.length - 1) }

    changeSelectedButton(previousQuestion, currentQuestion);

    renderQuestion(questions[currentQuestion].text);
    renderChoices(questions[currentQuestion].choices);
}

// handle navigation menu buttons
const navigateToQuestion = index => {
    if(index !== currentQuestion) {
        changeSelectedButton(currentQuestion, index);

        questionSection.innerHTML = "";
        choicesSection.innerHTML = "";

        setCurrentQuestion(index);

        renderQuestion(questions[currentQuestion].text);
        renderChoices(questions[currentQuestion].choices);
    }
};

const gradeQuiz = () => {
    const testingSection = document.querySelector(".testing__section");
    const gradeSection = document.querySelector(".grade__section");
    const grade = document.querySelector(".grade");

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

    grade.innerHTML += `<button class='retry-button'>Retry</button><button class='grading-back-to-homepage__button'>Homepage</button>`;
    document.querySelector(".retry-button").addEventListener("click", () => {
        init();
    });
    document.querySelector(".grading-back-to-homepage__button").addEventListener("click", () => {
        renderScreen(".splash-screen__section", "flex");
    });
};
