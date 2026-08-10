const services = {
    cortes: [
        { name: "Corte Simples", price: "R$ 25" },
        { name: "Máquina + Tesoura", price: "R$ 28" },
        { name: "Corte Tesoura", price: "R$ 35", from: true }
    ],

    barba: [
        { name: "Cavanhaque", price: "R$ 7" },
        { name: "Barba Simples", price: "R$ 10" },
        { name: "Barba Desenhada", price: "R$ 15" },
        { name: "Sobrancelha", price: "R$ 7" },
        { name: "Pezinho", price: "R$ 8" }
    ],

    coloracao: [
        { name: "Nevou", price: "R$ 85", from: true },
        { name: "Luzes", price: "R$ 75", from: true }
    ],

    combos: [
        { name: "Corte Simples + Sobrancelha", price: "R$ 30" },
        { name: "Corte Simples + Pigmentação", price: "R$ 35" },
        { name: "Corte Simples + Pigmentação + Sobrancelha", price: "R$ 40" },
        { name: "Corte Simples + Sobrancelha + Cavanhaque", price: "R$ 35" },
        { name: "Máquina + Tesoura + Sobrancelha", price: "R$ 33" },
        { name: "Máquina + Tesoura + Sobrancelha + Pigmentação", price: "R$ 40" },
        { name: "Máquina + Tesoura + Sobrancelha + Cavanhaque", price: "R$ 37" },
        { name: "Máquina + Tesoura + Sobrancelha + Cavanhaque + Pigmentação", price: "R$ 43" },
        { name: "Corte Tesoura + Sobrancelha", price: "R$ 40" }
    ]
};

const serviceList = document.querySelector("#service-list");
const categoryButtons = document.querySelectorAll(".category-button");

function renderServices(category) {
    serviceList.innerHTML = "";

    services[category].forEach((service) => {
        const item = document.createElement("div");
        item.classList.add("service-item");

        item.innerHTML = `
            <div class="service-name">${service.name}</div>

            <div class="service-price">
                ${service.from ? "<span>a partir de</span>" : ""}
                ${service.price}
            </div>
        `;

        serviceList.appendChild(item);
    });
}

categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        categoryButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        renderServices(button.dataset.category);
    });
});

renderServices("cortes");
