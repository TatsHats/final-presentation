import { createNavigationPanel, createButton } from "../utilities/utilities.js";
export class Winners {
    constructor(router, garage) {
        this.storageKey = "winnersData";
        this.currentPage = 1;
        this.limitCarsWin = 10;
        this.router = router;
        this.garage = garage;
        this.namePageLabel = document.createElement("label");
        this.numberPageLabel = document.createElement("label");
        this.table = document.createElement("table");
        this.table.classList.add("table");
        const thead = document.createElement("thead");
        thead.innerHTML = `
      <tr>
        <th>Number</th>
        <th>Car</th>
        <th>Name</th>
        <th>Wins</th>
        <th>Best time</th>
      </tr>
    `;
        this.table.append(thead);
        this.tbody = document.createElement("tbody");
        this.table.append(this.tbody);
    }
    async drawWinners() {
        const containerWinners = document.createElement("div");
        containerWinners.classList.add("containerWinners");
        containerWinners.append(createNavigationPanel(this.router));
        await this.createTable();
        containerWinners.append(this.createInfoPanel(), this.table, this.createPaginationPanel());
        return containerWinners;
    }
    getWinners() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }
    updateWinner(name, color, time) {
        const winners = this.getWinners();
        if (winners[name]) {
            winners[name].wins += 1;
            if (time < winners[name].bestTime) {
                winners[name].bestTime = time;
            }
        }
        else {
            winners[name] = {
                name,
                color,
                wins: 1,
                bestTime: time,
            };
        }
        console.log("After update:", winners);
        localStorage.setItem(this.storageKey, JSON.stringify(winners));
    }
    updateInfoPanel() {
        this.namePageLabel.textContent = `GARAGE (${this.garage.carsCount} cars)`;
        this.numberPageLabel.textContent = `PAGE ${this.currentPage}`;
    }
    async createTable() {
        this.tbody.innerHTML = "";
        const allCars = await this.garage.getCars(this.currentPage, this.limitCarsWin);
        if (allCars.length === 0 && this.currentPage > 1) {
            this.currentPage -= 1;
            await this.createTable();
            this.updateInfoPanel();
            return;
        }
        console.log("Loaded cars:", allCars);
        for (const [ind, car] of allCars.entries()) {
            const winnerData = this.getWinners()[car.name] || {
                name: car.name,
                color: car.color,
                wins: 0,
                bestTime: 0,
            };
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${ind + 1 + (this.currentPage - 1) * 10}</td>
        <td>
          <div class='carWin' style='background-color: ${winnerData.color};'>
            <img src='./assets/images/car.png' alt='img car'/>
          </div>
        </td>
        <td>${winnerData.name}</td>
        <td>${winnerData.wins}</td>
        <td>${winnerData.bestTime.toFixed(2)}</td>
      `;
            this.tbody.append(tr);
        }
    }
    deleteWinner() {
        localStorage.removeItem(this.storageKey);
    }
    createPaginationPanel() {
        const paginationPanel = document.createElement("div");
        paginationPanel.classList.add("paginationPanel");
        const leftButton = createButton("<", "button leftButton");
        leftButton.addEventListener("click", async () => {
            await this.changePage(-1);
        });
        const rightButton = createButton(">", "button rightButton");
        rightButton.addEventListener("click", async () => {
            await this.changePage(1);
        });
        paginationPanel.append(leftButton, rightButton);
        return paginationPanel;
    }
    async changePage(page) {
        this.currentPage += page;
        if (this.currentPage < 1) {
            this.currentPage = 1;
        }
        await this.createTable();
        this.updateInfoPanel();
    }
    createInfoPanel() {
        const infoOfPage = document.createElement("div");
        infoOfPage.classList.add("infoOfPage");
        infoOfPage.append(this.namePageLabel, this.numberPageLabel);
        this.updateInfoPanel();
        return infoOfPage;
    }
}
