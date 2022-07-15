import {
    questions,
    editQuestion,
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
const viewQuestionsButton = document.querySelector(".view-questions__button");
const questionsBackButton = document.querySelector(".questions__back-button");
const questionsContainer = document.querySelector(".questions__container");
const editQuestionBackButton = document.querySelector(".edit-question__back-button");
const editQuestionButton = document.querySelector(".edit-question__button");
const addQuestionPageButton = document.querySelector(".add-question-page__button");
const addQuestionButton = document.querySelector(".add-question__button");
const addQuestionBackButton = document.querySelector(".add-question__back-button");
const instructionsButton = document.querySelector(".instructions__button");
const instructionsBackButton = document.querySelector(".instructions__back-button");
const questionNavigation = document.querySelector(".questions");
const questionSection = document.querySelector(".question");
const choicesSection = document.querySelector(".choices");
const gradeButton = document.querySelector(".grade-button");
const grade = document.querySelector(".grade");

startQuizButton.addEventListener("click", () => {
    init();
});

const buildQuestionsPage = () => {
    questionsContainer.innerHTML = "";

    let questionsContainerString = "<h2>Questions and Answers</h2>";
    for(let i = 0; i < questions.length; i++) {
        questionsContainerString += `<div class="questions__entry"><p class="questions__entry-question">${questions[i].text}</p>`;
        
        for(let j = 0; j < questions[i].choices.length; j++) {
            questionsContainerString += `<p class="questions__entry-choice">${questions[i].choices[j]}`;

            if(questions[i].choices[j] === questions[i].answer) {
                questionsContainerString += ` <i class='fas fa-check' style='color:green'></i>`;
            }
            
            questionsContainerString += `</p>`;
        }

        questionsContainerString += `<button class="edit-question-page__button">Edit Question</button>`;

        questionsContainerString += `</div>`;
    }

    questionsContainer.innerHTML += questionsContainerString;

    const editQuestionPageButtons = document.getElementsByClassName("edit-question-page__button");

    for(let i = 0; i < editQuestionPageButtons.length; i++) {
        editQuestionPageButtons[i].addEventListener("click", () => {
            questionToEdit = questions[i].text;

            renderScreen(".edit-question__section", "block");

            // fill in inputs with current values of question and choices to be updated

            document.querySelector(".edit-question").value = questions[i].text;
            
            const editChoiceTextboxes = document.getElementsByClassName("edit-choice");
            for(let j = 0; j < questions[i].choices.length; j++) {
                editChoiceTextboxes[j].value = questions[i].choices[j];
                if(questions[i].choices[j] === questions[i].answer) {
                    document.getElementsByName("edit-answer")[j].checked = true;
                }
            }
        });
    }
}

viewQuestionsButton.addEventListener("click", () => {
    buildQuestionsPage();

    renderScreen(".questions__section", "block");
});

let questionToEdit = "";

questionsBackButton.addEventListener("click", () => {
    renderScreen(".splash-screen__section", "flex");
});

editQuestionBackButton.addEventListener("click", () => {
    buildQuestionsPage();

    renderScreen(".questions__section", "block");
});

editQuestionButton.addEventListener("click", () => {
    document.querySelector(".edit-question__success").style.display = "none";
    document.querySelector(".edit-question__errors").style.display = "none";

    let choices = [];
    let choiceTextboxes = document.getElementsByClassName("edit-choice");
    for(let i = 0; i < choiceTextboxes.length; i++) {
        choices.push(choiceTextboxes[i].value);
    }

    let answer = "";
    let choiceRadioButtons = document.getElementsByName("edit-answer");
    for(let i = 0; i < choiceRadioButtons.length; i++) {
        if(choiceRadioButtons[i].checked === true) {
            answer = choiceTextboxes[i].value;
        }
    }

    const errors = checkQuestion({
        text: document.querySelector(".edit-question").value,
        choices,
        chosen: "",
        answer
    });
    if(errors.length === 0) {
        editQuestion(questionToEdit, {
            text: document.querySelector(".edit-question").value,
            choices,
            answer
        });
        document.querySelector(".edit-question__success").innerHTML = "<p>Question has been updated</p>";
        document.querySelector(".edit-question__success").style.display = "block";
    } else {
        let errorText = "";
        for(let i = 0; i < errors.length; i++) {
            errorText += `<p>${errors[i]}</p>`;
        }
        document.querySelector(".edit-question__errors-list").innerHTML = errorText;

        document.querySelector(".edit-question__errors").style.display = "block";
    }

    window.scrollTo(0, 0);
});

addQuestionPageButton.addEventListener("click", () => {
    renderScreen(".add-question__section", "block");
});

addQuestionBackButton.addEventListener("click", () => {
    document.querySelector(".add-question__success").style.display = "none";
    document.querySelector(".add-question__errors").style.display = "none";
    renderScreen(".splash-screen__section", "flex");
});

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
};

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
    questionSection.innerHTML = `<p class="question-number">Question ${currentQuestion + 1}<p> ${question}`;
};

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
};

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
    grade.innerHTML = "";

    renderScreen(".grade__section", "block");

    // calculate score
    let score = 0;
    questions.forEach(question => {
        if(question.chosen === question.answer) {
            score++;
        }
    });

    // display score
    grade.innerHTML += `<p class="score">Score: ${score} / ${questions.length}</p>`;

    if(score === questions.length) {
        grade.innerHTML += `<p class="score">Perfect</p>`
    }
    
    // display correct answers
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

    // retry button
    grade.innerHTML += `<button class='retry-button'>Retry</button><button class='grading-back-to-homepage__button'>Homepage</button>`;
    document.querySelector(".retry-button").addEventListener("click", () => {
        init();
    });

    // back to homepage button
    document.querySelector(".grading-back-to-homepage__button").addEventListener("click", () => {
        renderScreen(".splash-screen__section", "flex");
    });

    window.scrollTo(0, 0);
};
