/* =========================================================
   MAIN UI CONTROLLER - UNIFICADO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTOS CARRINHO
     ====================================================== */
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");

  /* =======================================================
     👈 HAMBURGER - MOVIDO PARA DENTRO DOMLoaded
     ====================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navOverlay = document.querySelector('.nav-mobile-overlay');
  
  hamburgerBtn?.addEventListener('click', () => {
    navOverlay?.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', navOverlay?.classList.contains('open') ? 'true' : 'false');
  });

  /* =======================================================
     ADD PRODUTO (duplicata renderCart removida)
     ====================================================== */
  document.querySelectorAll(".produto button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return;

      const sizeSelect = btn.parentElement.querySelector(".product-size");
      const size = sizeSelect?.value;

      if (!size) {
        showToast("Selecione o tamanho da peça");
        return;
      }

      addToCart({ ...product, size });
      showToast("Produto adicionado ao carrinho");
      if (typeof renderCart === "function") renderCart(); // 👈 Única chamada
    });
  });

  /* =======================================================
     CARRINHO CONTROLS
     ====================================================== */
  openCartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.add("open");
    cartOverlay?.classList.add("active");
    if (typeof renderCart === "function") renderCart();
  });

  closeCartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.remove("open");
    cartOverlay?.classList.remove("active");
  });

  cartOverlay?.addEventListener("click", () => {
    cartSidebar?.classList.remove("open");
    cartOverlay?.classList.remove("active");
  });

  /* =======================================================
     FECHAR OVERLAYS (nav + cart)
     ====================================================== */
  document.addEventListener('click', (e) => {
    // Fecha NAV overlay
    if (!e.target.closest('.header-content') && navOverlay?.classList.contains('open')) {
      navOverlay.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    // Fecha CART overlay (redundante mas OK)
  });
});
