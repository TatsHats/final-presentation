import { brands, models } from "../constants/constants.js";
import { Page } from "../services/router.js";
export function createButton(text, classNames) {
    const button = document.createElement("button");
    button.classList.add(...classNames.split(" "));
    button.textContent = text;
    return button;
}
export function generateCarName() {
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    return `${randomBrand} ${randomModel}`;
}
export function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
export function createNavigationPanel(router) {
    const navigationPanel = document.createElement("div");
    navigationPanel.classList.add("navigationPanel");
    const buttonToGarage = createButton("TO GARAGE", "button buttonPage");
    buttonToGarage.addEventListener("click", () => {
        router.changePage(Page.Garage);
    });
    const buttonToWinner = createButton("TO WINNER", "button buttonPage");
    buttonToWinner.addEventListener("click", () => {
        router.changePage(Page.Winners);
    });
    navigationPanel.append(buttonToGarage, buttonToWinner);
    return navigationPanel;
}
export function toHex(color) {
    return color.toString(16).padStart(2, "0");
}
