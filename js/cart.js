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
    (item) => item.id === product.id && item.size === product.size
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
  const cart = getCart().filter((item) => item.id !== id);

  saveCart(cart);
  updateCartCount();
  renderCart();
}

/**
 * Altera a quantidade de um item
 * @param {number} id
 * @param {number} delta (+1 ou -1)
 */
function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === id);

  if (!item) return;

  item.quantidade += delta;

  if (item.quantidade <= 0) {
    removeItem(id);
    return;
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
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
  return getCart().reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );
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

  container.innerHTML = "";

  cart.forEach((item) => {
    container.innerHTML += `
      <article class="cart-item">
        <img src="${item.imagem}" alt="${item.nome}" />

        <div class="cart-info">
          <h3>${item.nome}</h3>

          <p class="cart-size">
            Tamanho: <strong>${item.size}</strong>
          </p>

          <span>R$ ${item.preco.toFixed(2)}</span>
        </div>

        <div class="cart-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.quantidade}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>

        <button class="cart-remove" onclick="removeItem(${item.id})">
          Remover
        </button>
      </article>
    `;
  });

  if (totalEl) {
    totalEl.innerText = `R$ ${getTotal().toFixed(2)}`;
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
});
