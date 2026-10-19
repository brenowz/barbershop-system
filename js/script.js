/* =========================
   TABELA DE SERVIÇOS & PREÇOS
========================= */
const services = {
    cortes: {
        image: "imgs/corte-simples.png",
        items: [
            { name: "Corte Máquina", price: "R$ 25" },
            { name: "Corte Tesoura", price: "R$ 35" },
            { name: "Corte Tesoura + Máquina", price: "R$ 30", from: true }
        ]
    },
    barba: {
        image: "imgs/corte-barba.png",
        items: [
            { name: "Barba", price: "R$ 12", from: true },
            { name: "Sobrancelha", price: "R$ 8" },
            { name: "Pezinho", price: "R$ 7" }
        ]
    },
    coloracao: {
        image: "imgs/corte-coloracao.png",
        items: [
            { name: "Pigmentação", price: "R$ 15" },
            { name: "Luzes", price: "R$ 75", from: true },
            { name: "Nevou", price: "R$ 85", from: true }
        ]
    },
    combos: {
        image: "imgs/corte-combos.png",
        items: [
            { name: "Corte + Sobrancelha", price: "R$ 30", from: true },
            { name: "Corte + Pigmentação", price: "R$ 37", from: true }
        ]
    }
};

/* =========================
   CONFIGURAÇÕES PIX E API
========================= */
const PIX_CHAVE = "+5571991846150"; 
const PIX_NOME = "Mauro Cortes"; 
const PIX_CIDADE = "SALVADOR"; 
const API_URL = "http://localhost:8000";

let cart = JSON.parse(localStorage.getItem("mauro_cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    const serviceList = document.querySelector("#service-list");
    const categoryButtons = document.querySelectorAll(".category-button");

    const cartOverlay = document.getElementById('cart-overlay');
    const cartFab = document.getElementById('cart-fab');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const btnGeneratePix = document.getElementById('btn-generate-pix');
    const pixResult = document.getElementById('pix-result');
    const pixCodeTextarea = document.getElementById('pix-code');
    const btnCopyPix = document.getElementById('btn-copy-pix');

    function renderServices(category) {
        if (!serviceList) return;
        serviceList.innerHTML = "";
        const selectedCategory = services[category];
        
        if (selectedCategory && selectedCategory.image) {
            const categoryImage = document.createElement("img");
            categoryImage.src = selectedCategory.image;
            categoryImage.alt = `Exemplo de ${category}`;
            categoryImage.classList.add("category-image");
            serviceList.appendChild(categoryImage);
        }

        if (selectedCategory && selectedCategory.items) {
            selectedCategory.items.forEach((service) => {
                const item = document.createElement("div");
                item.classList.add("service-item");

                const cleanPrice = parseFloat(service.price.replace("R$ ", "").replace(",", "."));

                item.innerHTML = `
                    <div class="service-name">${service.name}</div>
                    <div class="service-row-actions">
                        <div class="service-price">
                            ${service.from ? "<span>a partir de</span>" : ""}
                            ${service.price}
                        </div>
                        <button class="add-to-cart" data-name="${service.name}" data-price="${cleanPrice}">+</button>
                    </div>
                `;
                serviceList.appendChild(item);
            });
        }

        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.getAttribute('data-name');
                const price = parseFloat(e.target.getAttribute('data-price'));
                addToCart(name, price);
            });
        });
    }

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            categoryButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            renderServices(button.dataset.category);
        });
    });

    function saveCartToStorage() {
        localStorage.setItem("mauro_cart", JSON.stringify(cart));
    }

    function addToCart(name, price) {
        cart.push({ id: Date.now(), name, price });
        saveCartToStorage();
        updateCartUI();
        
        if (cartFab) {
            cartFab.style.transform = "scale(1.2)";
            setTimeout(() => cartFab.style.transform = "scale(1)", 200);
        }
    }

    window.removeFromCart = function(id) {
        cart = cart.filter(item => item.id !== id);
        saveCartToStorage();
        updateCartUI();
    };

    function updateCartUI() {
        if (!cartCount || !cartItemsContainer) return;

        cartCount.innerText = cart.length;
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">O seu carrinho está vazio.</p>';
            if (btnGeneratePix) btnGeneratePix.disabled = true;
            if (pixResult) pixResult.style.display = 'none';
            if (cartTotal) cartTotal.innerText = "0,00";
            return;
        }

        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong><br>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remover</button>
                </div>
                <div>R$ ${item.price.toFixed(2).replace('.', ',')}</div>
            `;
            cartItemsContainer.appendChild(div);
        });

        if (cartTotal) cartTotal.innerText = total.toFixed(2).replace('.', ',');
        if (btnGeneratePix) btnGeneratePix.disabled = false;
        if (pixResult) pixResult.style.display = 'none';
    }

    if (cartFab) cartFab.addEventListener('click', () => cartOverlay.classList.add('active'));
    if (closeCartBtn) closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) cartOverlay.classList.remove('active');
        });
    }

    if (btnGeneratePix) {
        btnGeneratePix.addEventListener('click', async () => {
            const totalValue = cart.reduce((acc, item) => acc + item.price, 0);

            // Envia o pedido para o backend Python sem exigir dados do cliente
            try {
                await fetch(`${API_URL}/pedidos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cliente_nome: "Cliente Web",
                        valor_total: totalValue,
                        metodo_pagamento: "PIX",
                        itens: cart.map(i => ({ nome: i.name, preco: i.price }))
                    })
                });
            } catch (err) {
                console.warn("Backend ainda offline ou sem conexão.", err);
            }

            // Gera a payload Pix na tela
            const pixPayload = generatePixPayload(PIX_CHAVE, PIX_NOME, PIX_CIDADE, totalValue);
            pixCodeTextarea.value = pixPayload;
            pixResult.style.display = 'block';
        });
    }

    if (btnCopyPix) {
        btnCopyPix.addEventListener('click', () => {
            pixCodeTextarea.select();
            document.execCommand('copy');
            btnCopyPix.innerText = "Copiado! ✓";
            setTimeout(() => btnCopyPix.innerText = "Copiar Código PIX", 2000);
        });
    }

    renderServices("cortes");
    updateCartUI();
});

/* =========================
   GERAÇÃO EMV PIX & CRC16
========================= */
function generatePixPayload(chave, nome, cidade, valor) {
    const formatLength = (val) => String(val.length).padStart(2, '0');
    const valorTxt = valor.toFixed(2);
    
    let payload = `000201`; 
    const merchantInfo = `0014br.gov.bcb.pix01${formatLength(chave)}${chave}`;
    payload += `26${formatLength(merchantInfo)}${merchantInfo}`;
    
    payload += `52040000`; 
    payload += `5303986`; 
    payload += `54${formatLength(valorTxt)}${valorTxt}`; 
    payload += `5802BR`; 
    payload += `59${formatLength(nome)}${nome}`; 
    payload += `60${formatLength(cidade)}${cidade}`; 
    
    const txid = "MCORTES" + Date.now().toString().slice(-4);
    const addData = `05${formatLength(txid)}${txid}`;
    payload += `62${formatLength(addData)}${addData}`;
    
    payload += `6304`; 
    return payload + calculateCRC16(payload);
}

function calculateCRC16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
            else crc <<= 1;
        }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}