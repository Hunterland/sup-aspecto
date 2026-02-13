/* =========================================================
   CART STATE
   ========================================================= */

/**
 * Chave única usada no localStorage
 * Garante persistência do carrinho entre sessões
 */
const CART_KEY = "sup_aspecto_cart";

/* =========================================================
   STORAGE (LocalStorage)
   ========================================================= */

/**
 * Recupera o carrinho salvo no localStorage
 * @returns {Array}
 */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/**
 * Salva o carrinho no localStorage
 * @param {Array} cart
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* =========================================================
   CART ACTIONS (Regras de Negócio)
   ========================================================= */

/**
 * Adiciona um produto ao carrinho
 * Se já existir o mesmo produto + tamanho, incrementa a quantidade
 * @param {Object} product
 */
function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(
    (item) => item.id === product.id && item.size === product.size,
  );

  if (existing) {
    existing.quantidade++;
  } else {
    cart.push({ ...product, quantidade: 1 });
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

/**
 * Remove um item do carrinho pelo ID
 * @param {number} id
 */
function removeItem(id) {
  const cart = getCart();
  const newCart = cart.filter((item) => item.id !== parseInt(id));

  saveCart(newCart);
  renderCart();
  updateCartCount();
  showToast("Item removido do carrinho", "success");
}

/**
 * Altera a quantidade de um item
 * @param {number} id
 * @param {number} delta (+1 ou -1)
 */
function changeQty(id, delta) {
  const cart = getCart();
  const itemIndex = cart.findIndex((item) => item.id === parseInt(id));

  if (itemIndex !== -1) {
    cart[itemIndex].quantidade = Math.max(
      1,
      cart[itemIndex].quantidade + delta,
    );

    saveCart(cart);
    renderCart();
    updateCartCount();
  }
}

/* =========================================================
   UI HELPERS
   ========================================================= */

/**
 * Atualiza o contador visual do carrinho (header)
 */
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantidade, 0);

  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}

/**
 * Calcula o valor total do carrinho
 * @returns {number}
 */
function getTotal() {
  return getCart().reduce((sum, item) => sum + item.preco * item.quantidade, 0);
}

/* =========================================================
   RENDERIZAÇÃO DO CARRINHO
   ========================================================= */

/**
 * Renderiza a lista de itens do carrinho no DOM
 * Responsável apenas pela camada de visualização
 */
function renderCart() {
  const cart = getCart();
  const container = document.querySelector(".cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML =
      '<p style="text-align:center;opacity:0.6;padding:2rem 1rem">Carrinho vazio</p>';
    if (totalEl) totalEl.textContent = "R$ 0,00";
    return;
  }

  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.imagem}" alt="${item.nome}" class="cart-item-image">
      <div class="cart-details">
        <h3 class="cart-name">${item.nome}</h3>
        <div class="cart-meta">
          <span>Tamanho: ${item.size}</span>
          <span>R$ ${item.preco.toFixed(2)}</span>
        </div>
      </div>
      <div class="cart-controls-row">
        <div class="cart-qty">
          <button data-action="dec" aria-label="Diminuir">-</button>
          <span>${item.quantidade}</span>
          <button data-action="inc" aria-label="Aumentar">+</button>
        </div>
        <button class="cart-remove" aria-label="Remover ${item.nome}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  `,
    )
    .join("");

  if (totalEl) {
    totalEl.textContent = `R$ ${getTotal().toFixed(2)}`;
  }
}

/* =========================================================
   INIT
   ========================================================= */

/**
 * Inicialização automática ao carregar a página
 */
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  let pendingRemoveId = null; // ID global para modal

  const cartItems = document.querySelector(".cart-items");
  if (cartItems) {
    cartItems.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const item = btn.closest(".cart-item");
      const id = item?.dataset?.id;

      if (!id) return;

      if (btn.dataset.action === "inc") {
        changeQty(id, 1);
      } else if (btn.dataset.action === "dec") {
        changeQty(id, -1);
      } else if (btn.classList.contains("cart-remove")) {
        pendingRemoveId = id; // Armazena ID
        showConfirmModal(); // Abre modal custom
      }
    });
  }

  // NOVAS FUNÇÕES MODAL
  function showConfirmModal() {
    document.getElementById("confirm-modal").classList.add("active");
  }

  function hideConfirmModal() {
    document.getElementById("confirm-modal").classList.remove("active");
    pendingRemoveId = null;
  }

  function confirmRemove() {
    if (pendingRemoveId) {
      removeItem(pendingRemoveId);
      hideConfirmModal();
    }
  }

  // 👈 Event listeners modal 
  document
    .getElementById("confirm-cancel")
    ?.addEventListener("click", hideConfirmModal);
  document
    .getElementById("confirm-remove")
    ?.addEventListener("click", confirmRemove);

  // Fecha modal clicando overlay
  document.getElementById("confirm-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "confirm-modal") hideConfirmModal();
  });
});

/* =========================================================
   FINALIZAR COMPRA - EMAILJS + WHATSAPP
   ========================================================= */
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const checkoutBtn = document.getElementById("checkout-btn");

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", function () {
        const nome = document.getElementById("customer-name")?.value?.trim();
        const pagamento = document.getElementById("payment-method")?.value;
        const carrinho = getCart();
        const total = getTotal();

        // Validações
        if (carrinho.length === 0 || !nome || !pagamento) {
          showToast("Complete todos os campos", "error");
          return;
        }

        // 👈 PRIMEIRO cria itensTexto
        const itensTexto = carrinho
          .map(
            (item) =>
              `👕 ${item.nome}
          Tamanho: ${item.size} | ${item.quantidade}x | R$ ${(item.preco * item.quantidade).toFixed(2)}`,
          )
          .join("\n\n");

        // Template params pro EmailJS
        const templateParams = {
          cliente_nome: nome,
          total: `R$ ${total.toFixed(2)}`,
          pagamento: pagamento.toUpperCase(),
          data_hora: new Date().toLocaleString("pt-BR"),
          itens_texto: itensTexto, // 👈 STRING simples
          email: "alanbarroncas@gmail.com", // 👈 CAMPO OBRIGATÓRIO!
        };

        // EMAILJS
        emailjs
          .send("service_e4ylnlu", "template_6bzg816", templateParams)
          .then((response) => {
            console.log("✅ EMAIL:", response.status);
            showToast("✅ Email enviado!", "success");
          })
          .catch((error) => {
            console.error("EmailJS:", error);
            showToast("WhatsApp enviado", "warning");
          });

        // 2️⃣ WHATSAPP (Abre conversa com mensagem pré-preenchida)
        const mensagem = `🛒 PEDIDO\n${nome}\nR$ ${total.toFixed(2)}\n${pagamento}\n${itensTexto}`;
        window.open(
          `https://wa.me/559293818973?text=${encodeURIComponent(mensagem)}`,
          "_blank",
        );

        // Limpa UI
        localStorage.removeItem(CART_KEY);
        updateCartCount();
        renderCart();
        showToast("✅ Pedido enviado por email + WhatsApp!", "success");

        // Fecha sidebar
        document.getElementById("cart-sidebar")?.classList.remove("open");
        document.getElementById("cart-overlay")?.classList.remove("active");
      });
    }
  }, 100);
});
