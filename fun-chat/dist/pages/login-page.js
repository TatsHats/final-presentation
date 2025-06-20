import { changePage, Page } from "../services/router.js";
import { createLabelWithInput, createButton } from "../utilities/utilities.js";
import { loginUserSocket, connectWebSocket } from "../services/web-socket.js";
connectWebSocket();
export function createLoginPage() {
    const loginContainer = document.createElement("div");
    loginContainer.classList.add("loginContainer");
    const namePage = document.createElement("h2");
    namePage.classList.add("namePage");
    namePage.textContent = "Authorization";
    const { label: inputNameLabel, input: inputName } = createLabelWithInput("Name", "text", "Enter your name", "name", "inputName");
    const { label: inputPassLabel, input: inputPass } = createLabelWithInput("Password", "password", "Enter your password", "password", "inputPassword");
    const errorField = document.createElement("div");
    errorField.classList.add("errorField");
    const buttonEnter = createButton("Enter", "button buttonEnter error");
    const buttonInfo = createButton("Info", "button buttonInfo");
    buttonInfo.addEventListener("click", () => {
        changePage(Page.Info);
    });
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttonsContainer");
    buttonsContainer.append(buttonEnter, buttonInfo);
    loginContainer.append(namePage, inputNameLabel, inputPassLabel, errorField, buttonsContainer);
    let validName = false;
    let validPass = false;
    inputName.addEventListener("input", () => {
        validName = checkValidName(inputName.value, errorField);
        updateButtonState(validName, validPass, buttonEnter);
    });
    inputPass.addEventListener("input", () => {
        validPass = checkValidPass(inputPass.value, errorField);
        updateButtonState(validName, validPass, buttonEnter);
    });
    buttonEnter.addEventListener("click", () => {
        if (!validName || !validPass)
            return;
        const login = inputName.value;
        const password = inputPass.value;
        loginUserSocket(login, password).then((response) => {
            if (response.success) {
                sessionStorage.setItem("username", login);
                changePage(Page.Main);
            }
            else {
                errorField.textContent = response.message || "Login failed.";
            }
        });
    });
    if (validName && validPass) {
        buttonEnter.classList.remove("error");
    }
    return loginContainer;
}
function checkValidName(value, errorField) {
    let nameIsValid = false;
    if (value.length < 5 || value.length > 15) {
        errorField.textContent =
            "The name must be between 5 and 14 characters long.";
    }
    else if (value.length === 0) {
        errorField.textContent = "Please enter your name!";
    }
    else {
        nameIsValid = true;
        errorField.textContent = "";
    }
    return nameIsValid;
}
function checkValidPass(value, errorField) {
    let passIsValid = false;
    if (value.length < 6 || value.length > 11) {
        errorField.textContent =
            "The password must be between 6 and 10 characters long.";
    }
    else if (value.length === 0) {
        errorField.textContent = "Please enter your password!";
    }
    else {
        passIsValid = true;
        errorField.textContent = "";
    }
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    if (!hasLetter || !hasNumber) {
        errorField.textContent =
            "The password must contain numbers and Latin letters.";
    }
    return passIsValid;
}
function updateButtonState(validName, validPass, buttonEnter) {
    if (validName && validPass) {
        buttonEnter.classList.remove("error");
        buttonEnter.removeAttribute("disabled");
    }
    else {
        buttonEnter.classList.add("error");
        buttonEnter.setAttribute("disabled", "true");
    }
}
