import { createLoginPage } from "../pages/login-page.js";
import { createMainPage } from "../pages/main-page.js";
import { createInfoPage } from "../pages/info-page.js";
import { createErrorPage } from "../pages/error-page.js";
export var Page;
(function (Page) {
    Page["Login"] = "login";
    Page["Main"] = "main";
    Page["Info"] = "info";
    Page["Error"] = "error";
})(Page || (Page = {}));
export async function changePage(page) {
    document.body.replaceChildren();
    const username = sessionStorage.getItem("username");
    if (page === Page.Main && !username) {
        document.body.append(createLoginPage());
        history.pushState({ page: Page.Login }, "", `?page=${Page.Login}`);
        return;
    }
    switch (page) {
        case Page.Login: {
            document.body.append(createLoginPage());
            history.pushState({ page }, "", `?page=${page}`);
            break;
        }
        case Page.Main: {
            const mainPage = await createMainPage();
            document.body.append(mainPage);
            history.pushState({ page }, "", `?page=${page}`);
            break;
        }
        case Page.Info: {
            document.body.append(createInfoPage());
            history.pushState({ page }, "", `?page=${page}`);
            break;
        }
        default: {
            document.body.append(createErrorPage());
            history.pushState({ page: Page.Error }, "", `?page=${Page.Error}`);
        }
    }
}
