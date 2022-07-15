let questions = [
    {
        text: "8 % 3 = ____",
        choices: [
            "2",
            "3",
            "4",
            "6"
        ],
        chosen: "",
        answer: "2"
    },
    {
        text: "HTML stands for ____ Markup Language",
        choices: [
            "Hotswap",
            "HyperText",
            "Helper",
            "Hypermedia"
        ],
        chosen: "",
        answer: "HyperText"
    },
    {
        text: "1 === '1' evaluates to ____",
        choices: [
            "true",
            "false",
            "1",
            "None of the above"
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

const checkQuestion = (newQuestion) => {
    let errors = [];

    if(newQuestion.text === "") {
        errors.push("Question is required");
    }

    let choicesProvided = true;
    for(let i = 0; i < newQuestion.choices.length; i++) {
        if(newQuestion.choices[i] === "") {
            errors.push("4 choices are required");
            choicesProvided = false;
            break;
        }
    }

    if(choicesProvided && new Set(newQuestion.choices).size !== newQuestion.choices.length) {
        errors.push("No duplicate answers allowed")
    }

    return errors;
};

const addQuestion = (newQuestion) => {
    document.querySelector(".new-question").value = "";

    document.getElementsByName("new-answer")[0].checked = true;

    const newChoices = document.getElementsByClassName("new-choice");
    for(let i = 0; i < newChoices.length; i++) {
        newChoices[i].value = "";
    }

    questions.push(newQuestion);
};

const editQuestion = (questionToEdit, { text, choices, answer}) => {
    questions = questions.map(question => {
        if(question.text === questionToEdit) {
            return {
                text,
                choices,
                chosen: "",
                answer
            }
        }

        return question;
    });

    console.log(questions);
};

let currentQuestion = 0;

const setCurrentQuestion = (newQuestion) => {
    currentQuestion = newQuestion;
};

const setAnswer = (answer) => {
    questions[currentQuestion].chosen = answer;
};

export {
    questions,
    editQuestion,
    checkQuestion,
    addQuestion,
    currentQuestion,
    setCurrentQuestion,
    setAnswer
};