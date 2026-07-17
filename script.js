// ==========================================
// MENU MOBILE
// ==========================================

const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
});

// Fecha o menu ao clicar em um link
document.querySelectorAll("#nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});


// ==========================================
// HEADER AO ROLAR
// ==========================================

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.background = "#0b0b0b";
        header.style.boxShadow = "0 8px 25px rgba(0,0,0,.35)";

    } else {

        header.style.background = "rgba(0,0,0,.85)";
        header.style.boxShadow = "none";

    }

});


// ==========================================
// POPUP
// ==========================================

const popup = document.getElementById("popup");
const abrirPopup = document.getElementById("abrir-popup");
const fecharPopup = document.getElementById("fechar-popup");

abrirPopup.addEventListener("click", () => {

    popup.style.display = "flex";

});

fecharPopup.addEventListener("click", () => {

    popup.style.display = "none";

});

// Fecha clicando fora

popup.addEventListener("click", (e) => {

    if (e.target === popup) {

        popup.style.display = "none";

    }

});

// Fecha com ESC

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        popup.style.display = "none";

    }

});


// ==========================================
// WHATSAPP
// ==========================================

const telefone = "557191846150";

document.querySelectorAll(".servico").forEach(botao => {

    botao.addEventListener("click", () => {

        const servico = botao.dataset.servico;

        const mensagem =
`Olá! Gostaria de agendar o serviço:

${servico}`;

        const url =
`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");

    });

});


// ==========================================
// BOTÃO FLUTUANTE
// ==========================================

const whatsappFloat = document.getElementById("whatsapp-float");

if (whatsappFloat) {

    whatsappFloat.addEventListener("click", (e) => {

        e.preventDefault();

        const mensagem =
"Olá! Gostaria de agendar um horário.";

        const url =
`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");

    });

}


// ==========================================
// ANIMAÇÃO AO ROLAR
// ==========================================

const elementos = document.querySelectorAll(
    ".service-card, .gallery-grid img, .contact-card, .about-container"
);

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.15

});

elementos.forEach(el => observer.observe(el));