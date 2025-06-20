import { createButton } from "../utilities/utilities.js";
import { changePage, Page } from "../services/router.js";
export function createErrorPage() {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("errorContainer");
    const errorPage = document.createElement("h2");
    errorPage.classList.add("errorPage");
    errorPage.textContent = "Oops... something's wrong!";
    const buttonReturn = createButton("return", "button buttonReturn");
    buttonReturn.addEventListener("click", () => {
        changePage(Page.Login);
    });
    errorContainer.append(errorPage, buttonReturn);
    return errorContainer;
}
