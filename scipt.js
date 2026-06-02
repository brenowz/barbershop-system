


const abrirPopup = document.getElementById("abrir-popup");
const fecharPopup = document.getElementById("fechar-popup");
const popup = document.getElementById("popup-servicos");
const servicos = document.querySelectorAll(".servico");

abrirPopup.addEventListener("click", function () {
  popup.style.display = "flex";
});

fecharPopup.addEventListener("click", function () {
  popup.style.display = "none";
});

servicos.forEach(function (botao) {
  botao.addEventListener("click", function () {
    const servicoEscolhido = botao.getAttribute("data-servico");
    const telefone = "557191846150";

    const mensagem = `Olá, gostaria de agendar: ${servicoEscolhido}`;
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(link, "_blank");
  });
});