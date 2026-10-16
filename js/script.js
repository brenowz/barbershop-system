const services = {
    cortes: {
        image: "imgs/corte-simples.png",
        items: [
            { name: "Corte Simples", price: "R$ 25" },
            { name: "Máquina + Tesoura", price: "R$ 28" },
            { name: "Corte Tesoura", price: "R$ 35", from: true }
        ]
    },
    barba: {
        image: "imgs/corte-barba.png",
        items: [
            { name: "Cavanhaque", price: "R$ 7" },
            { name: "Barba Simples", price: "R$ 10" },
            { name: "Barba Desenhada", price: "R$ 15" },
            { name: "Sobrancelha", price: "R$ 7" },
            { name: "Pezinho", price: "R$ 8" }
        ]
    },
    coloracao: {
        image: "imgs/corte-coloracao.png",
        items: [
            { name: "Nevou", price: "R$ 85", from: true },
            { name: "Luzes", price: "R$ 75", from: true }
        ]
    },
    combos: {
        image: "imgs/corte-combos.png",
        items: [
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
    }
};

const serviceList = document.querySelector("#service-list");
const categoryButtons = document.querySelectorAll(".category-button");

function renderServices(category) {
    serviceList.innerHTML = "";
    const selectedCategory = services[category];
    
    const categoryImage = document.createElement("img");
    categoryImage.src = selectedCategory.image;
    categoryImage.alt = `Exemplo de ${category}`;
    categoryImage.classList.add("category-image");
    serviceList.appendChild(categoryImage);

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

renderServices("cortes");

/* =========================
   CARRINHO E PIX
========================= */
const PIX_CHAVE = "+5571991846150"; 
const PIX_NOME = "Mauro Cortes"; 
const PIX_CIDADE = "SALVADOR"; 

let cart = [];
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

function addToCart(name, price) {
    cart.push({ id: Date.now(), name, price });
    updateCartUI();
    
    cartFab.style.transform = "scale(1.2)";
    setTimeout(() => cartFab.style.transform = "scale(1)", 200);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    cartCount.innerText = cart.length;
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">O seu carrinho está vazio.</p>';
        btnGeneratePix.disabled = true;
        pixResult.style.display = 'none';
        cartTotal.innerText = "0,00";
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

    cartTotal.innerText = total.toFixed(2).replace('.', ',');
    btnGeneratePix.disabled = false;
    pixResult.style.display = 'none';
}

cartFab.addEventListener('click', () => cartOverlay.classList.add('active'));
closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('active'));
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) cartOverlay.classList.remove('active');
});

btnGeneratePix.addEventListener('click', () => {
    const totalValue = cart.reduce((acc, item) => acc + item.price, 0);
    const pixPayload = generatePixPayload(PIX_CHAVE, PIX_NOME, PIX_CIDADE, totalValue);
    
    pixCodeTextarea.value = pixPayload;
    pixResult.style.display = 'block';
});

btnCopyPix.addEventListener('click', () => {
    pixCodeTextarea.select();
    document.execCommand('copy');
    btnCopyPix.innerText = "Copiado! ✓";
    setTimeout(() => btnCopyPix.innerText = "Copiar Código PIX", 2000);
});

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