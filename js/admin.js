const API_URL = "http://localhost:8000";

// Credenciais locais para o MVP
const USERS = {
    "mauro": "123456",
    "barbeiro": "123456"
};

document.addEventListener("DOMContentLoaded", () => {
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const loginError = document.getElementById('login-error');
    const btnRefresh = document.getElementById('btn-refresh');
    const ordersContainer = document.getElementById('orders-container');

    // Verifica se já está logado na sessão do navegador
    if (sessionStorage.getItem("admin_logged") === "true") {
        showDashboard();
    }

    btnLogin.addEventListener('click', () => {
        const user = document.getElementById('admin-user').value.trim();
        const pass = document.getElementById('admin-pass').value.trim();

        if (USERS[user] && USERS[user] === pass) {
            sessionStorage.setItem("admin_logged", "true");
            loginError.style.display = 'none';
            showDashboard();
        } else {
            loginError.style.display = 'block';
        }
    });

    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem("admin_logged");
        dashboardScreen.style.display = 'none';
        loginScreen.style.display = 'block';
    });

    if (btnRefresh) {
        btnRefresh.addEventListener('click', fetchOrders);
    }

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        fetchOrders();
    }

    async function fetchOrders() {
        try {
            const res = await fetch(`${API_URL}/pedidos`);
            if (!res.ok) throw new Error("Erro ao buscar registros de PIX");
            const data = await res.json();
            
            const pedidos = data.pedidos || [];
            renderOrders(pedidos);
            updateStats(pedidos);
        } catch (err) {
            console.error("Erro ao conectar com a API:", err);
            ordersContainer.innerHTML = '<p style="color: #ff5555;">Não foi possível carregar os pagamentos. Verifique se o servidor Python está ativo em http://localhost:8000.</p>';
        }
    }

    function renderOrders(pedidos) {
        ordersContainer.innerHTML = '';

        if (pedidos.length === 0) {
            ordersContainer.innerHTML = '<p style="color: #888;">Nenhum pagamento PIX registrado até o momento.</p>';
            return;
        }

        // Mostra os mais recentes primeiro
        const sortedPedidos = [...pedidos].reverse();

        sortedPedidos.forEach(pedido => {
            const card = document.createElement('div');
            const statusClass = (pedido.status || 'PENDENTE').toLowerCase();
            card.classList.add('order-card', statusClass);

            const itemsHtml = pedido.itens.map(i => `<li>${i.nome} - R$ ${i.preco.toFixed(2)}</li>`).join('');

            card.innerHTML = `
                <div class="order-header-info">
                    <span>PIX #${pedido.id}</span>
                    <span>${pedido.data_criacao || ''}</span>
                </div>
                <ul class="order-items-list">
                    ${itemsHtml}
                </ul>
                <div class="order-total">Valor: R$ ${pedido.valor_total.toFixed(2).replace('.', ',')}</div>
                <div class="order-actions">
                    <button class="btn-status ${statusClass === 'concluido' ? 'pending' : 'done'}" onclick="toggleOrderStatus(${pedido.id})">
                        ${statusClass === 'concluido' ? 'Pendente' : 'Confirmar Recebimento ✓'}
                    </button>
                </div>
            `;
            ordersContainer.appendChild(card);
        });
    }

    function updateStats(pedidos) {
        const totalCount = pedidos.length;
        const totalVal = pedidos.reduce((acc, p) => acc + p.valor_total, 0);
        const pendingCount = pedidos.filter(p => (p.status || 'PENDENTE') === 'PENDENTE').length;

        document.getElementById('stat-total-count').innerText = totalCount;
        document.getElementById('stat-total-val').innerText = `R$ ${totalVal.toFixed(2).replace('.', ',')}`;
        document.getElementById('stat-pending-count').innerText = pendingCount;
    }

    window.toggleOrderStatus = function(id) {
        alert(`Status do PIX #${id} alterado!`);
        fetchOrders();
    };
});