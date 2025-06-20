import { getId } from "../utilities/utilities.js";
let socket;
export function connectWebSocket() {
    return new Promise((resolve) => {
        socket = new WebSocket("ws://localhost:4000");
        socket.addEventListener("open", () => {
            resolve(socket);
        });
    });
}
export function getSocket() {
    return socket;
}
export function sendMessage(mess) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(mess));
    }
}
export function loginUserSocket(login, password) {
    return new Promise((done, error) => {
        const currentSocket = getSocket();
        if (!currentSocket)
            return error(new Error("ws not connected"));
        const id = getId();
        const message = {
            id,
            type: "USER_LOGIN",
            payload: {
                user: { login, password },
            },
        };
        sendMessage(message);
        const response = (event) => {
            let message;
            try {
                message = JSON.parse(event.data);
            }
            catch {
                return error(new Error("Error JSON response"));
            }
            if (message.id === id) {
                currentSocket.removeEventListener("message", response);
                if (message.type === "USER_LOGIN" &&
                    message.payload?.user?.isLogined === true) {
                    done({ success: true });
                }
                else {
                    done({
                        success: false,
                        message: message.payload?.message ||
                            message.payload?.error ||
                            "Authentication Error",
                    });
                }
            }
        };
        currentSocket.addEventListener("message", response);
    });
}
export function getUsers(type) {
    return new Promise((done, error) => {
        const socket = getSocket();
        if (!socket)
            return error(new Error("not connected"));
        const id = getId();
        const requestActiv = { id, type, payload: {} };
        sendMessage(requestActiv);
        const response = (event) => {
            const mess = JSON.parse(event.data);
            if (mess.id !== id)
                return;
            socket.removeEventListener("message", response);
            if (mess.type === type && Array.isArray(mess.payload?.users)) {
                done(mess.payload.users);
            }
            else {
                error(new Error("Invalid server response"));
            }
        };
        socket.addEventListener("message", response);
    });
}
export function getUsersActive() {
    return getUsers("USER_ACTIVE");
}
export function getUsersInactive() {
    return getUsers("USER_INACTIVE");
}
