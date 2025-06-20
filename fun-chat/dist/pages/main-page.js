import { createButton, createInput, getId } from "../utilities/utilities.js";
import { changePage, Page } from "../services/router.js";
import { connectWebSocket, getUsersActive, getUsersInactive, } from "../services/web-socket.js";
let selectedUser;
let nameLabel = document.createElement("label");
export async function createMainPage() {
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("mainContainer");
    let socket;
    try {
        socket = await connectWebSocket();
    }
    catch (error) {
        console.error("WebSocket connect:", error);
        return document.createElement("div");
    }
    const header = createHeader();
    const main = document.createElement("div");
    main.classList.add("main");
    main.append(createUsersField(), createChatField(socket));
    const footer = createFooter();
    mainContainer.append(header, main, footer);
    return mainContainer;
}
function createHeader() {
    const container = document.createElement("div");
    container.classList.add("mainHeader");
    const userName = sessionStorage.getItem("username") || "Unknown";
    const userLabel = document.createElement("h2");
    userLabel.classList.add("userLabel");
    userLabel.textContent = `User: ${userName}`;
    const mainLabel = document.createElement("h2");
    mainLabel.classList.add("mainLabel");
    mainLabel.textContent = "Fun chat";
    const buttonsContainerMain = document.createElement("div");
    buttonsContainerMain.classList.add("buttonsContainerMain");
    const buttonInfo = createButton("Info", "button buttonInfo");
    buttonInfo.addEventListener("click", () => {
        changePage(Page.Info);
    });
    const buttonReturn = createButton("Return", "button buttonReturn");
    buttonReturn.addEventListener("click", () => {
        sessionStorage.removeItem("username");
        changePage(Page.Login);
    });
    buttonsContainerMain.append(buttonInfo, buttonReturn);
    container.append(userLabel, mainLabel, buttonsContainerMain);
    return container;
}
function createUsersField() {
    const container = document.createElement("div");
    container.classList.add("usersField");
    const searchInput = createInput("text", "Search user...", "searchInput", "searchInput");
    let allUsers = [];
    const users = document.createElement("div");
    users.classList.add("users");
    container.append(searchInput, users);
    Promise.all([getUsersActive(), getUsersInactive()]).then(([activeUsers, inactiveUsers]) => {
        const currentUser = sessionStorage.getItem("username");
        const active = activeUsers
            .filter((user) => user.login !== currentUser)
            .map((user) => ({ ...user, isActive: true }));
        const inactive = inactiveUsers
            .filter((user) => user.login !== currentUser)
            .map((user) => ({ ...user, isActive: false }));
        allUsers = [...active, ...inactive];
        renderUsersList(users, allUsers);
    });
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = allUsers.filter((user) => user.login.toLowerCase().includes(query));
        renderUsersList(users, filtered);
    });
    return container;
}
function createChatField(socket) {
    const container = document.createElement("div");
    container.classList.add("chatField");
    const headerChat = document.createElement("div");
    headerChat.classList.add("headerChat");
    const chat = document.createElement("div");
    chat.classList.add("chat");
    const inputContainer = document.createElement("div");
    inputContainer.classList.add("inputContainer");
    const inputMessage = createInput("text", "Write here...", "inputMessage", "inputMessage");
    const buttonSend = createButton("Send", "button buttonSend");
    buttonSend.addEventListener("click", () => {
        sendCurrentMessage(chat, inputMessage, socket);
    });
    inputMessage.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendCurrentMessage(chat, inputMessage, socket);
        }
    });
    headerChat.append(nameLabel);
    inputContainer.append(inputMessage, buttonSend);
    container.append(headerChat, chat, inputContainer);
    updateNameLabel(nameLabel);
    getIncomingMessages(socket, chat);
    return container;
}
function createFooter() {
    const container = document.createElement("div");
    container.classList.add("mainFooter");
    const linkSchool = document.createElement("a");
    linkSchool.href = "https://rs.school";
    linkSchool.textContent = "RSSchool";
    linkSchool.target = "_blank";
    const linkGitHub = document.createElement("a");
    linkGitHub.href = "https://github.com/TatsHats";
    linkGitHub.textContent = "GitHub";
    linkGitHub.target = "_blank";
    const year = document.createElement("label");
    year.textContent = "2025";
    container.append(linkSchool, linkGitHub, year);
    return container;
}
function renderUsersList(users, usersField) {
    users.textContent = "";
    for (const user of usersField) {
        const userBlock = document.createElement("div");
        userBlock.classList.add("userBlock");
        userBlock.classList.add(user.isActive ? "activeUser" : "inactiveUser");
        userBlock.textContent = user.login;
        userBlock.addEventListener("click", () => {
            selectedUser = user;
            updateNameLabel(nameLabel);
        });
        users.append(userBlock);
    }
}
function updateNameLabel(nameLabel) {
    if (selectedUser) {
        const login = selectedUser.login;
        const status = selectedUser.isActive ? "online" : "offline";
        nameLabel.textContent = `${login} (${status})`;
    }
    else {
        nameLabel.textContent = "Select user...";
    }
}
function sendMessage(socket, message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "message", data: message }));
    }
}
function sendCurrentMessage(chat, inputMessage, socket) {
    const text = inputMessage.value;
    if (!text || !selectedUser)
        return;
    const message = {
        id: getId(),
        from: sessionStorage.getItem("username"),
        to: selectedUser.login,
        text: text,
        time: new Date().toISOString(),
    };
    sendMessage(socket, message);
    drawMessage(chat, message, true, socket);
    inputMessage.value = "";
}
function drawMessage(container, message, myMessage, socket) {
    const messageBlock = document.createElement("div");
    messageBlock.classList.add(myMessage ? "myMessage" : "incomingMessage");
    const time = new Date(message.time).toLocaleTimeString();
    const date = document.createElement("span");
    date.textContent = time;
    date.classList.add("dateMessage");
    const text = document.createElement("span");
    text.textContent = `${message.text}`;
    messageBlock.append(date, text);
    if (myMessage) {
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("messageIcons");
        const delivered = document.createElement("img");
        delivered.alt = "img delivered";
        delivered.src = "./assets/images/success.png";
        delivered.classList.add("imgMessage");
        messageBlock.append(delivered);
        const editButton = document.createElement("img");
        editButton.src = "./assets/images/edit.png";
        editButton.alt = "Edit";
        editButton.title = "Edit message";
        editButton.classList.add("editButton");
        editButton.addEventListener("click", () => {
            const newText = prompt(text.textContent || '');
            if (newText && newText !== text.textContent) {
                text.textContent = newText;
                socket.send(JSON.stringify({
                    type: "MSG_EDIT",
                    message: { id: message.id, text: newText },
                }));
            }
        });
        const deleteButton = document.createElement("img");
        deleteButton.src = "./assets/images/delete.png";
        deleteButton.alt = "Delete";
        deleteButton.title = "Delete message";
        deleteButton.classList.add("deleteButton");
        deleteButton.addEventListener("click", () => {
            messageBlock.remove();
            socket.send(JSON.stringify({
                type: "MSG_DELETE",
                message: { id: message.id },
            }));
        });
        buttonsContainer.append(editButton, deleteButton);
        messageBlock.append(buttonsContainer);
    }
    container.append(messageBlock);
    container.scrollTop = container.scrollHeight; // для прокрутки
}
function getIncomingMessages(socket, chat) {
    socket.addEventListener("message", (event) => {
        const parsed = JSON.parse(event.data);
        if (parsed?.type !== "message")
            return;
        const message = parsed.data;
        if (!message?.from)
            return;
        if (selectedUser && message.from === selectedUser.login) {
            drawMessage(chat, message, false, socket);
        }
    });
}
