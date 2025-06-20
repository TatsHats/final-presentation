import { changePage, Page } from "./services/router.js";
import { connectWebSocket } from "./services/web-socket.js";
connectWebSocket();
document.addEventListener("DOMContentLoaded", () => {
    changePage(Page.Login);
});
