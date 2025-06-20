import { createButton } from "./utilities.js";
import { generateCarName, getRandomColor } from "./utilities.js";
import { Page } from "./router.js";
export class GarageView {
    constructor(router, garage) {
        this.currentPage = 1;
        this.router = router;
        this.garage = garage;
        this.carsContainer = document.createElement("div");
        this.carsContainer.classList.add("carsContainer");
    }
    createGarageWiew() {
        const containerGarage = document.createElement("div");
        containerGarage.classList.add("containerGarage");
        const buttonsPages = document.createElement("div");
        buttonsPages.classList.add("buttonsPages");
        const buttonToGarage = createButton("TO GARAGE", "button buttonPage");
        buttonToGarage.addEventListener("click", () => {
            this.router.changePage(Page.Garage);
        });
        const buttonToWinner = createButton("TO WINNER", "button buttonPage");
        buttonToWinner.addEventListener("click", () => {
            this.router.changePage(Page.Winners);
        });
        buttonsPages.append(buttonToGarage, buttonToWinner);
        const settingsEndInfo = document.createElement("div");
        settingsEndInfo.classList.add("settingsEndInfo");
        const createBts = this.inputsPanel();
        const infoOfPage = this.createInfoPanel();
        const raceBts = this.createRaceBtsPanel();
        const paginationPanel = this.createPaginationPanel();
        settingsEndInfo.append(createBts, infoOfPage, raceBts);
        containerGarage.append(buttonsPages, settingsEndInfo, paginationPanel);
        return containerGarage;
    }
    inputsPanel() {
        const inputsPanel = document.createElement("div");
        inputsPanel.classList.add("inputsPanel");
        // ----- create
        const create = document.createElement("div");
        create.classList.add("inputPanel");
        const inputCreate = document.createElement("input");
        inputCreate.type = "text";
        inputCreate.classList.add("input");
        inputCreate.placeholder = "Enter a name";
        const colorCreate = document.createElement("input");
        colorCreate.type = "color";
        colorCreate.classList.add("colorInput");
        const buttonCreate = createButton("Create", "button");
        buttonCreate.addEventListener("click", async () => {
            const name = inputCreate.value.trim() || generateCarName();
            const color = colorCreate.value || getRandomColor();
            this.garage.createCar(name, color);
            inputCreate.value = "";
        });
        create.append(inputCreate, colorCreate, buttonCreate);
        // ----- update
        const update = document.createElement("div");
        update.classList.add("inputPanel");
        const inputUpdate = document.createElement("input");
        inputUpdate.type = "text";
        inputUpdate.classList.add("input");
        inputUpdate.placeholder = "Enter a name";
        const colorUpdate = document.createElement("input");
        colorUpdate.type = "color";
        colorUpdate.classList.add("colorInput");
        const buttonUpdate = createButton("Update", "button");
        buttonUpdate.addEventListener("click", () => {});
        update.append(inputUpdate, colorUpdate, buttonUpdate);
        inputsPanel.append(create, update);
        return inputsPanel;
    }
    createInfoPanel() {
        const infoOfPage = document.createElement("div");
        infoOfPage.classList.add("infoOfPage");
        const namePage = document.createElement("label");
        namePage.textContent = "GARAGE";
        const numberPage = document.createElement("label");
        numberPage.textContent = "PAGE 1";
        infoOfPage.append(namePage, numberPage);
        return infoOfPage;
    }
    createRaceBtsPanel() {
        const raceBts = document.createElement("div");
        raceBts.classList.add("raceBts");
        const raceButton = createButton("Race", "button race");
        raceButton.addEventListener("click", () => {});
        const resetButton = createButton("Reset", "button reset");
        resetButton.addEventListener("click", () => {});
        const generateCars = createButton("Generate cars", "button buttonGenerateCars");
        generateCars.addEventListener("click", () => {});
        raceBts.append(raceButton, resetButton, generateCars);
        return raceBts;
    }
    createPaginationPanel() {
        const paginationPanel = document.createElement("div");
        paginationPanel.classList.add("paginationPanel");
        const leftButton = createButton("<", "buttonPagination race");
        leftButton.addEventListener("click", () => {
            this.changePage(-1, labelPagination);
        });
        const labelPagination = document.createElement("label");
        labelPagination.textContent = "1";
        labelPagination.classList.add("labelPagination");
        const rightButton = createButton(">", "buttonPagination reset");
        rightButton.addEventListener("click", () => {
            this.changePage(1, labelPagination);
        });
        const generateCars = createButton("Generate cars", "button buttonGenerateCars");
        generateCars.addEventListener("click", () => {});
        paginationPanel.append(leftButton, labelPagination, rightButton);
        return paginationPanel;
    }
    changePage(page, labelPagination) {
        if (this.currentPage + page < 1)
            return;
        this.currentPage += page;
        labelPagination.textContent = this.currentPage.toString();
    }
}
