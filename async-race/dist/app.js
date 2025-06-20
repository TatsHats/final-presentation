import { Router } from "./services/router.js";
export class App {
    constructor() {
        const appContainer = document.createElement("div");
        appContainer.classList.add("appContainer");
        document.body.append(appContainer);
        this.router = new Router(appContainer);
    }
    init() {
        this.router.init();
    }
}
