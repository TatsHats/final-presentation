import { createButton } from "../utilities/utilities.js";
export class Car {
    constructor(id, name, color, garage) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.garage = garage;
    }
    drawCar() {
        const carContainer = document.createElement("div");
        carContainer.classList.add("carContainer");
        const buttons = this.createButtonsPanel();
        const car = document.createElement("div");
        car.classList.add("car");
        car.style.backgroundColor = this.color;
        const carName = document.createElement("p");
        carName.textContent = this.name;
        carName.classList.add("carName");
        const carImg = document.createElement("img");
        carImg.src = Car.img;
        carImg.alt = `car ${this.name}`;
        car.append(carImg);
        this.carElement = car;
        const finishImg = document.createElement("img");
        finishImg.classList.add("finishImg");
        finishImg.src = "./assets/images/finish.png";
        finishImg.alt = "finish image";
        carContainer.append(buttons, car, carName, finishImg);
        return carContainer;
    }
    getCarElement() {
        return this.carElement;
    }
    createButtonsPanel() {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("line");
        const upperButtons = document.createElement("div");
        const selectButton = createButton("Select", "buttonCar button");
        selectButton.addEventListener("click", () => {
            this.garage.getCar(this.id);
        });
        const startButton = createButton("A", "buttonEngine button");
        startButton.addEventListener("click", () => {
            this.garage.startEngine(this.id, this.getCarElement());
            startButton.classList.add("disabled");
            stopButton.classList.remove("disabled");
        });
        upperButtons.append(selectButton, startButton);
        const lowerButtons = document.createElement("div");
        const removeButton = createButton("Remove", "buttonCar button removeButton");
        removeButton.addEventListener("click", () => {
            this.garage.deleteCar(this.id);
        });
        const stopButton = createButton("B", "buttonEngine button stopButton");
        stopButton.classList.add("disabled");
        stopButton.addEventListener("click", () => {
            this.garage.stopEngine(this.getCarElement());
            startButton.classList.remove("disabled");
            stopButton.classList.add("disabled");
        });
        lowerButtons.append(removeButton, stopButton);
        buttonsContainer.append(upperButtons, lowerButtons);
        return buttonsContainer;
    }
}
Car.img = "./assets/images/car.png";
