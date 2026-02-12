/* =========================================================
   MAIN UI CONTROLLER
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTOS PRINCIPAIS
     ======================================================= */

  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");

  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");

  /* =======================================================
     AÇÕES DE PRODUTO (Adicionar ao Carrinho)
     ======================================================= */

  document.querySelectorAll(".produto button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);

      // Localiza o produto no catálogo
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return;

      // Captura o tamanho selecionado
      const sizeSelect = btn.parentElement.querySelector(".product-size");
      const size = sizeSelect?.value;

      if (!size) {
        showToast("Selecione o tamanho da peça");
        return;
      }

      // Adiciona ao carrinho
      addToCart({ ...product, size });
      showToast("Produto adicionado ao carrinho"); // 👈 NOVO
      if (typeof renderCart === "function") {
        renderCart();
      }

      // Garante atualização visual da sidebar
      if (typeof renderCart === "function") {
        renderCart();
      }

      // Abre o carrinho automaticamente
      // cartSidebar?.classList.add("open");
      // cartOverlay?.classList.add("active");
    });
  });

  /* =======================================================
     CONTROLES DO CARRINHO (Abrir / Fechar)
     ======================================================= */

  openCartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.add("open");
    cartOverlay?.classList.add("active");

    // Garante renderização ao abrir manualmente
    if (typeof renderCart === "function") {
      renderCart();
    }
  });

  closeCartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.remove("open");
    cartOverlay?.classList.remove("active");
  });

  cartOverlay?.addEventListener("click", () => {
    cartSidebar?.classList.remove("open");
    cartOverlay?.classList.remove("active");
  });
});
