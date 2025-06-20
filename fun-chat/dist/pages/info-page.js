import { createButton } from "../utilities/utilities.js";
import { changePage, Page } from "../services/router.js";
export function createInfoPage() {
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("infoContainer");
    const namePage = document.createElement("h2");
    namePage.classList.add("namePage");
    namePage.textContent = "About Fun chat";
    const content = document.createElement("div");
    content.classList.add("contentInfo");
    const textInfo = document.createElement("div");
    textInfo.classList.add("textInfo");
    textInfo.innerHTML = `
    <p>Welcome to <strong>Fun Chat</strong> — your cozy corner on 
    the internet, where conversations bloom and smiles are passed 
    around!</p>

    <p>Whether it's chatting with old friends or meeting new ones, 
    Fun Chat makes it easy and fun. With our bubblegum-style design 
    and playful atmosphere, chatting here feels like passing notes 
    in class — just way more fun!</p>

    <p><strong>Features you'll love:</strong></p>
    <ul>
    <li>🎨 Bright and cute interface</li>  
    <li>🔒 Safe and private conversations</li>  
    <li>💬 Instant messages with no hassle</li>  
    <li>🌍 Chatting with people around the world</li>  
    </ul>

    <p>So grab your favorite emoji and join the conversation!</p>
    <p>Because here, every message is a little burst of joy. 💖</p>
    `;
    const linkGitHubAutor = document.createElement("a");
    linkGitHubAutor.href = "https://github.com/TatsHats";
    linkGitHubAutor.textContent = "Tatsiana Hatskaya";
    linkGitHubAutor.target = "_blank";
    linkGitHubAutor.classList.add("linkGitHubAutor");
    content.append(textInfo, linkGitHubAutor);
    const buttonReturn = createButton("return", "button buttonReturn");
    buttonReturn.addEventListener("click", () => {
        changePage(Page.Login);
    });
    infoContainer.append(namePage, content, buttonReturn);
    return infoContainer;
}
