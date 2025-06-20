import { Garage } from "./garage.js";
import { Winners } from "./winners.js";
export var Page;
(function (Page) {
    Page["Garage"] = "garage";
    Page["Winners"] = "winners";
})(Page || (Page = {}));
export class Router {
    constructor(appContainer) {
        this.garage = new Garage(this);
        this.winners = new Winners();
        this.appContainer = appContainer;
    }
    async init() {
        // переключение в браузере веперед и назад
        globalThis.addEventListener("popstate", () => {
            this.loadPageFromURL();
        });
        this.loadPageFromURL();
    }
    async changePage(page) {
        this.appContainer.replaceChildren();
        if (page === Page.Garage) {
            const cont = await this.garage.drawGarage();
            this.appContainer.append(cont);
        }
        else if (page === Page.Winners) {
            const cont = await this.winners.drawWinners();
            this.appContainer.append(cont);
        }
        globalThis.history.pushState({ page }, "", `?page=${page}`);
    }
    loadPageFromURL() {
        const urlParameters = new globalThis.URLSearchParams(globalThis.location.search);
        const pageUrl = urlParameters.get("page");
        let page = Page.Garage;
        if (pageUrl === Page.Winners) {
            page = Page.Winners;
        }
        this.changePage(page);
    }
}
