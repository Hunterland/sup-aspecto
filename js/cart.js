/* =========================================================
   CONFIGURAÇÕES GLOBAIS
   =========================================================
   Tudo que é estático/configurável do sistema fica aqui
   ========================================================= */

const CART_KEY = "sup_aspecto_cart";

/* Payload PIX fixo (QR estático) */
const PIX_PAYLOAD = `00020126430014BR.GOV.BCB.PIX0121sup.aspecto@gmail.com5204000053039865802BR5901N6001C62070503***63045D10`;

/* Caminho da imagem QR */
const PIX_QR_IMAGE = "assets/qrcode-pix.png";
/* Dados do merchant */
const MERCHANT = "SUP ASPECTO";
const CITY = "MANAUS";

/* =========================================================
   ESTADO LOCAL — CONTROLE DE REMOÇÃO
   =========================================================
   Guarda temporariamente qual item será removido
   até o usuário confirmar no modal
   ========================================================= */

let pendingRemoveKey = null;

/* =========================================================
   STORAGE — ABSTRAÇÃO DO LOCALSTORAGE
   ========================================================= */

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/* =========================================================
   AÇÕES DE CARRINHO
   ========================================================= */

/* Adiciona produto ou incrementa quantidade */
function addToCart(product) {
  const cart = getCart();

  const uniqueKey = `${product.id}-${product.size}`;
  const existing = cart.find((i) => i.uniqueKey === uniqueKey);

  if (existing) {
    existing.quantidade++;
  } else {
    cart.push({ ...product, uniqueKey, quantidade: 1 });
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
  showToast("Produto adicionado", "success");
}

/* Remove item após confirmação */
function removeItemConfirmed() {
  if (!pendingRemoveKey) return;

  const cart = getCart().filter((i) => i.uniqueKey !== pendingRemoveKey);

  saveCart(cart);
  pendingRemoveKey = null;

  updateCartCount();
  renderCart();
}

/* Solicita confirmação antes de remover */
function requestRemoveItem(key) {
  pendingRemoveKey = key;
  document.getElementById("confirm-modal")?.classList.add("active");
}

/* Ajusta quantidade */
function changeQty(key, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.uniqueKey === key);

  if (!item) return;

  item.quantidade = Math.max(1, item.quantidade + delta);

  saveCart(cart);
  updateCartCount();
  renderCart();
}

/* =========================================================
   UI HELPERS
   ========================================================= */

/* Atualiza contador visual do carrinho */
function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.quantidade, 0);
  const el = document.getElementById("cart-count");
  if (el) el.innerText = count;
}

/* Calcula total monetário */
function getTotal() {
  return getCart().reduce((s, i) => s + i.preco * i.quantidade, 0);
}

/* =========================================================
   RESET CHECKOUT FORM
   ========================================================= */

function resetCheckoutForm() {
  const nomeInput = document.getElementById("customer-name");
  const paymentSelect = document.getElementById("payment-method");

  if (nomeInput) nomeInput.value = "";

  if (paymentSelect) {
    paymentSelect.selectedIndex = 0;
    // ou:
    // paymentSelect.value = "";
  }
}

/* =========================================================
   RENDERIZAÇÃO DO CARRINHO
   ========================================================= */

function renderCart() {
  const cart = getCart();
  const container = document.querySelector(".cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container) return;

  /* Carrinho vazio */
  if (!cart.length) {
    container.innerHTML = `<p style="text-align:center;opacity:.6;padding:2rem 1rem">
        Carrinho vazio
      </p>`;
    if (totalEl) totalEl.textContent = "R$ 0,00";
    return;
  }

  /* Monta HTML dos itens */
  container.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item" data-unique-key="${item.uniqueKey}">

      <img src="${item.imagem}" class="cart-item-image">

      <div class="cart-details">
        <h3>${item.nome}</h3>
        <div>
          <span>Tamanho: ${item.size}</span>
          <span>R$ ${item.preco.toFixed(2)}</span>
        </div>
      </div>

      <div class="cart-controls-row">

        <div class="cart-qty">
          <button data-action="dec">-</button>
          <span>${item.quantidade}</span>
          <button data-action="inc">+</button>
        </div>

        <button class="cart-remove">
          <i class="fas fa-trash-alt"></i>
        </button>

      </div>
    </div>
  `,
    )
    .join("");

  if (totalEl) totalEl.textContent = `R$ ${getTotal().toFixed(2)}`;
}

/* =========================================================
   UTIL PIX — NORMALIZAÇÃO ASCII
   ========================================================= */

function sanitize(str, max) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toUpperCase()
    .substring(0, max);
}

/* =========================================================
   CRC16 OFICIAL PIX
   ========================================================= */

function crc16(payload) {
  let crc = 0xffff;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;

    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/* =========================================================
   CHECKOUT
   ========================================================= */

function handleCheckout() {
  const nome = document.getElementById("customer-name")?.value.trim();
  const metodo = document.getElementById("payment-method")?.value;

  const cart = getCart();
  const total = getTotal();

  if (!nome) return showToast("Digite seu nome", "error");
  if (!metodo) return showToast("Escolha pagamento", "error");
  if (!cart.length) return showToast("Carrinho vazio", "error");

  /* Fluxo PIX */
  if (metodo === "pix") {
    openPixModal(nome, cart, total);
    return;
  }

  /* Fluxo WhatsApp */
  const itens = cart
    .map((i) => `${i.nome}|${i.size}|${i.quantidade}`)
    .join("\n");

  window.open(
    `https://wa.me/559293818973?text=${encodeURIComponent(
      `Pedido (Dinheiro)\n${nome}\nTotal:R$${total}\n${itens}`,
    )}`,
  );

  /* Finaliza pedido + feedback visual */
  finalizarPedido();
  showToast("Pedido enviado ✔", "success");
}

/* =========================================================
   PIX MODAL
   ========================================================= */

function openPixModal(nome, cart, total) {
  const modal = document.getElementById("pix-modal");

  document.getElementById("pix-image").src = PIX_QR_IMAGE;
  document.getElementById("pix-payload").value = PIX_PAYLOAD;

  const itens = cart
    .map((i) => `${i.nome} | ${i.size} | x${i.quantidade}`)
    .join("<br>");

  document.getElementById("pix-order-details").innerHTML = `
    <strong>Cliente:</strong> ${nome}<br>
    <strong>Total:</strong> R$ ${total.toFixed(2)}<br><br>
    ${itens}
  `;

  modal.classList.add("active");
}

/* =========================================================
   FINALIZAÇÃO
   ========================================================= */

function finalizarPedido() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  renderCart();

  resetCheckoutForm();
}

/* =========================================================
   EVENTOS GLOBAIS (INIT)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  /* Delegação de eventos dos itens */
  document.querySelector(".cart-items")?.addEventListener("click", (e) => {
    const item = e.target.closest(".cart-item");
    if (!item) return;

    const key = item.dataset.uniqueKey;

    if (e.target.closest("[data-action='inc']")) changeQty(key, 1);
    if (e.target.closest("[data-action='dec']")) changeQty(key, -1);
    if (e.target.closest(".cart-remove")) requestRemoveItem(key);
  });

  /* Checkout */
  document
    .getElementById("checkout-btn")
    ?.addEventListener("click", handleCheckout);

  /* ============================
     MODAL CONFIRMAÇÃO REMOÇÃO
     ============================ */

  document.getElementById("confirm-remove")?.addEventListener("click", () => {
    removeItemConfirmed();
    document.getElementById("confirm-modal").classList.remove("active");
  });

  document.getElementById("confirm-cancel")?.addEventListener("click", () => {
    pendingRemoveKey = null;
    document.getElementById("confirm-modal").classList.remove("active");
  });

  /* ============================
     PIX MODAL EVENTS
     ============================ */

  document.getElementById("copyPixBtn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(PIX_PAYLOAD);
    showToast("Pix copiado ✔", "success");
  });

  document.getElementById("sendZapBtn")?.addEventListener("click", () => {
    const cart = getCart();
    const total = getTotal();

    const itens = cart
      .map((i) => `${i.nome}|${i.size}|${i.quantidade}`)
      .join("\n");

    window.open(
      `https://wa.me/5592991503240?text=${encodeURIComponent(
        `Pedido Pix\nTotal:R$${total}\n${itens}`,
      )}`,
    );
  });

  document.getElementById("confirmPixBtn")?.addEventListener("click", () => {
    finalizarPedido();
    document.getElementById("pix-modal").classList.remove("active");

    showToast("Pedido enviado ✔", "success");
  });
});
