export function createButton(text, classNames) {
    const button = document.createElement("button");
    button.classList.add(...classNames.split(" "));
    button.textContent = text;
    return button;
}
export function generateCarName() {
    const brands = [
        "Toyota",
        "Ford",
        "BMW",
        "Mercedes",
        "Honda",
        "Audi",
        "Chevrolet",
        "Nissan",
        "Hyundai",
        "Volkswagen",
        "Kia",
        "Subaru",
        "Volvo",
        "Mazda",
        "Lexus",
        "Jeep",
        "Dodge",
        "Tesla",
        "Ferrari",
        "Porsche",
    ];
    const models = [
        "Corolla",
        "Mustang",
        "X6",
        "C-Class",
        "Civic",
        "A4",
        "Camaro",
        "Altima",
        "Tucson",
        "Golf",
        "Sport",
        "Outback",
        "XC90",
        "CX-5",
        "RX-350",
        "Model-1",
        "Model-2",
        "Mod-3",
        "Model-4",
        "Mod-5",
    ];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomModel = models[Math.floor(Math.random() * models.length)];
    return `${randomBrand} ${randomModel}`;
}
export function getRandomColor() {
    return `rgb(
    ${Math.floor(Math.random() * 256)}, 
    ${Math.floor(Math.random() * 256)}, 
    ${Math.floor(Math.random() * 256)}
  )`;
}
