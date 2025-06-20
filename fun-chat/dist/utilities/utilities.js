export function createButton(text, classNames) {
    const button = document.createElement("button");
    button.classList.add(...classNames.split(" "));
    button.textContent = text;
    return button;
}
export function createLabelWithInput(labelText, type, placeholder, name, classNames) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.classList.add(...classNames.split(" "));
    label.append(input);
    return { label, input };
}
export function createInput(type, placeholder, name, classNames) {
    const input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.placeholder = placeholder;
    input.classList.add(...classNames.split(" "));
    return input;
}
export function getId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
