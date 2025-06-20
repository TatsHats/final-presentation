import { GarageView } from "./garage-view.js";
import { API } from "./api.js";
import { Car } from "./car.js";
export class Garage {
    constructor(router) {
        this.view = new GarageView(router, this);
        this.router = router;
        this.cars = new Map();
    }
    async drawGarage() {
        const containerGarage = this.view.createGarageWiew();
        const carsContainer = document.createElement("div");
        carsContainer.classList.add("carsContainer");
        try {
            const limitCars = 7;
            const cars = await this.getCars(1, limitCars);
            for (const carData of cars) {
                const car = new Car(carData.id, carData.name, carData.color, this);
                const carElement = car.drawCar();
                this.cars.set(carData.id, carElement);
                carsContainer.append(carElement);
            }
        }
        catch (error) {
            const errorMessage = document.createElement("p");
            errorMessage.textContent =
                error instanceof Error ? `Error: ${error.message}` : "Error";
            carsContainer.append(errorMessage);
        }
        containerGarage.append(carsContainer);
        return containerGarage;
    }
    async getCars(page, limit) {
        const response = await fetch(`${API.baseUrl}/garage?_page=${page}&_limit=${limit}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return response.json();
    }
    getCar() {}
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
            const newCar = car.drawCar();
            this.cars.set(createdCar.id, newCar);
            let carsContainer = document.querySelector(".carsContainer");
            if (!carsContainer) {
                carsContainer = document.createElement("div");
                carsContainer.classList.add("carsContainer");
                document.body.append(carsContainer);
            }
            carsContainer.append(newCar);
        }
        catch {
            throw new Error("error:");
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
                car.remove();
                this.cars.delete(carId);
            }
        }
        catch {
            throw new Error("Error");
        }
    }
    updateCar() {}
    startEngine() {}
    stopEngine() {}
    switchEngine() {}
}
