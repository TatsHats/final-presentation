import { generateCarName, getRandomColor } from "../utilities/utilities.js";
import { createButton, createNavigationPanel } from "../utilities/utilities.js";
import { API } from "../services/api.js";
import { Car } from "../components/car.js";
import { Animation } from "../utilities/animation.js";
export class Garage {
    constructor(router, winners) {
        this.carsCount = 0;
        this.currentPage = 1;
        this.limitCars = 7;
        this.isWinner = false;
        this.router = router;
        this.winners = winners;
        this.cars = new Map();
        this.carsContainer = document.createElement("div");
        this.carsContainer.classList.add("carsContainer");
        this.namePageLabel = document.createElement("label");
        this.numberPageLabel = document.createElement("label");
        this.inputUpdate = document.createElement("input");
        this.colorUpdate = document.createElement("input");
        this.buttonUpdate = createButton("Update", "button");
        this.createButtonUpdate();
    }
    async getCarsCount() {
        const response = await fetch(`${API.baseUrl}/garage/count`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        this.carsCount = data.count;
        this.updateInfoPanel();
    }
    async getCars(page, limit = this.carsCount) {
        const response = await fetch(`${API.baseUrl}/garage?_page=${page}&_limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    }
    getCar(carId) {
        const car = this.cars.get(carId);
        if (car) {
            this.inputUpdate.value = car.name;
            this.colorUpdate.value = car.color;
            const clickUpdate = async () => {
                const newName = this.inputUpdate.value || generateCarName();
                const newColor = this.colorUpdate.value || getRandomColor();
                await this.updateCar(carId, newName, newColor);
                this.inputUpdate.value = "";
            };
            this.buttonUpdate.addEventListener("click", clickUpdate, { once: true });
        }
    }
    updateCarList(cars) {
        this.carsContainer.innerHTML = "";
        for (const carElement_ of cars) {
            const car = new Car(carElement_.id, carElement_.name, carElement_.color, this);
            const carElement = car.drawCar();
            this.cars.set(carElement_.id, car);
            this.carsContainer.append(carElement);
        }
        this.carsCount = this.cars.size;
        this.updateInfoPanel();
    }
    async createCar(name, color) {
        try {
            const response = await fetch(`${API.baseUrl}/garage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, color }),
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const createdCar = await response.json();
            const car = new Car(createdCar.id, createdCar.name, createdCar.color, this);
            this.cars.set(createdCar.id, car);
            this.carsCount = this.cars.size;
            if (this.carsCount > this.limitCars * this.currentPage) {
                this.currentPage++;
            }
            this.carsContainer.innerHTML = "";
            const cars = await this.getCars(this.currentPage, this.limitCars);
            this.updateCarList(cars);
            this.updateInfoPanel();
        }
        catch {
            throw new Error("Error");
        }
    }
    async deleteCar(carId) {
        try {
            const response = await fetch(`${API.baseUrl}/garage/${carId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const car = this.cars.get(carId);
            if (car) {
                const carElement = car.getCarElement();
                carElement.remove();
                this.cars.delete(carId);
                this.carsCount = this.cars.size;
                if (this.carsCount < this.limitCars * this.currentPage &&
                    this.currentPage > 1) {
                    this.currentPage--;
                }
                const cars = await this.getCars(this.currentPage, this.limitCars);
                this.updateCarList(cars);
                this.updateInfoPanel();
                this.winners.deleteWinner();
            }
        }
        catch {
            throw new Error("Error");
        }
    }
    async updateCar(carId, name, color) {
        const response = await fetch(`${API.baseUrl}/garage/${carId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, color }),
        });
        if (!response.ok) {
            throw new Error(`Error response`);
        }
        const updatedCar = await response.json();
        const car = this.cars.get(carId);
        if (car) {
            car.name = updatedCar.name;
            car.color = updatedCar.color;
        }
        const cars = await this.getCars(this.currentPage, this.limitCars);
        this.updateCarList(cars);
        this.updateInfoPanel();
    }
    async startEngine(id, carElement) {
        this.isWinner = false;
        try {
            const startResponsePromise = fetch(`${API.baseUrl}/engine?id=${id}&status=started`, { method: "PATCH" });
            const driveResponsePromise = fetch(`${API.baseUrl}/engine?id=${id}&status=drive`, { method: "PATCH" });
            const startResponse = await startResponsePromise;
            if (!startResponse.ok) {
                console.error("Failed to start engine");
                return;
            }
            const { velocity, distance } = await startResponse.json();
            if (!velocity || !distance) {
                console.error("Incorrect engine data", { velocity, distance });
                return;
            }
            const speedFactor = 1000;
            const time = distance / speedFactor / velocity;
            const shift = 200; // car width + buttonsCar width
            const distancePx = this.carsContainer.offsetWidth - shift;
            const speed = distancePx / time;
            Animation.startAnimation(carElement, distancePx, speed);
            const driveResponse = await driveResponsePromise;
            if (!driveResponse.ok) {
                console.error("Failed to drive engine");
                return;
            }
            setTimeout(() => {
                const car = this.cars.get(id);
                if (!this.isWinner) {
                    this.isWinner = true;
                    this.showWinner(car?.name || "Unknown car");
                }
                if (car) {
                    this.winners.updateWinner(car.name, car.color, time * 1000);
                    this.showWinner(car.name);
                }
            }, time * 900);
        }
        catch (error) {
            console.error("Error engine:", error);
        }
    }
    stopEngine(carElement) {
        Animation.stopAnimation();
        carElement.style.transform = "translateX(0px)";
    }
    async changePage(page) {
        this.currentPage += page;
        if (this.currentPage < 1) {
            this.currentPage = 1;
        }
        const cars = await this.getCars(this.currentPage, this.limitCars);
        if (cars.length === 0 && page === 1) {
            this.currentPage--;
            return;
        }
        this.updateCarList(cars);
        this.updateInfoPanel();
    }
    async drawGarage() {
        this.getCarsCount();
        const containerGarage = this.createGarageView();
        const cars = await this.getCars(1, this.limitCars);
        this.updateCarList(cars);
        containerGarage.append(this.carsContainer);
        this.carsCount = this.cars.size;
        this.updateInfoPanel();
        return containerGarage;
    }
    hideWinnerText(winnerText) {
        winnerText.remove();
    }
    updateInfoPanel() {
        this.namePageLabel.textContent = `GARAGE (${this.carsCount} cars)`;
        this.numberPageLabel.textContent = `PAGE ${this.currentPage}`;
    }
    createGarageView() {
        const containerGarage = document.createElement("div");
        containerGarage.classList.add("containerGarage");
        containerGarage.append(createNavigationPanel(this.router), this.createSettingsPanel(), this.createPaginationPanel());
        return containerGarage;
    }
    createSettingsPanel() {
        const settingsEndInfo = document.createElement("div");
        settingsEndInfo.classList.add("settingsEndInfo");
        settingsEndInfo.append(this.createInputsPanel(), this.createInfoPanel(), this.createRaceButtonsPanel());
        return settingsEndInfo;
    }
    createInputsPanel() {
        const inputsPanel = document.createElement("div");
        inputsPanel.classList.add("inputsPanel");
        inputsPanel.append(this.createButtonCreate(), this.createButtonUpdate());
        return inputsPanel;
    }
    createButtonUpdate() {
        const update = document.createElement("div");
        update.classList.add("inputPanel");
        this.inputUpdate.type = "text";
        this.inputUpdate.classList.add("input");
        this.inputUpdate.placeholder = "Enter a name";
        this.colorUpdate.type = "color";
        this.colorUpdate.classList.add("colorInput");
        update.append(this.inputUpdate, this.colorUpdate, this.buttonUpdate);
        return update;
    }
    createButtonCreate() {
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
            await this.createCar(name, color);
            inputCreate.value = "";
        });
        create.append(inputCreate, colorCreate, buttonCreate);
        return create;
    }
    createInfoPanel() {
        const infoOfPage = document.createElement("div");
        infoOfPage.classList.add("infoOfPage");
        infoOfPage.append(this.namePageLabel, this.numberPageLabel);
        this.updateInfoPanel();
        return infoOfPage;
    }
    createRaceButtonsPanel() {
        const raceBts = document.createElement("div");
        raceBts.classList.add("raceBts");
        const raceButton = createButton("Race", "button race");
        raceButton.addEventListener("click", () => {
            for (const car of this.cars.values()) {
                const carElement = car.getCarElement();
                this.startEngine(car.id, carElement);
            }
        });
        const resetButton = createButton("Reset", "button reset");
        resetButton.addEventListener("click", () => {
            for (const car of this.cars.values()) {
                const carElement = car.getCarElement();
                this.stopEngine(carElement);
            }
        });
        const generateCars = createButton("Generate cars", "button buttonGenerateCars");
        generateCars.addEventListener("click", () => {
            const count = 100;
            for (let index = 0; index < count; index++) {
                const name = generateCarName();
                const color = getRandomColor();
                this.createCar(name, color);
            }
        });
        raceBts.append(raceButton, resetButton, generateCars);
        return raceBts;
    }
    createPaginationPanel() {
        const paginationPanel = document.createElement("div");
        paginationPanel.classList.add("paginationPanel");
        const leftButton = createButton("<", "button leftButton");
        leftButton.addEventListener("click", async () => {
            await this.changePage(-1);
            this.updatePaginationPanel(leftButton, rightButton);
        });
        const rightButton = createButton(">", "button rightButton");
        rightButton.addEventListener("click", async () => {
            await this.changePage(1);
            this.updatePaginationPanel(leftButton, rightButton);
        });
        paginationPanel.append(leftButton, rightButton);
        this.updatePaginationPanel(leftButton, rightButton);
        return paginationPanel;
    }
    async updatePaginationPanel(leftButton, rightButton) {
        if (this.currentPage === 1) {
            leftButton.classList.add("disabled");
        }
        else {
            leftButton.classList.remove("disabled");
        }
        const nextPageCars = await this.getCars(this.currentPage + 1, this.limitCars);
        if (nextPageCars.length === 0) {
            rightButton.classList.add("disabled");
        }
        else {
            rightButton.classList.remove("disabled");
        }
    }
    showWinner(winnerName) {
        const winnerText = document.createElement("div");
        winnerText.classList.add("winnerText");
        winnerText.textContent = `winner: ${winnerName}!`;
        document.body.append(winnerText);
        setTimeout(() => {
            this.hideWinnerText(winnerText);
        }, 5000);
    }
}
