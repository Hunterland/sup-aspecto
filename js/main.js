/* =========================================================
   MAIN UI CONTROLLER - UNIFICADO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTOS CARRINHO - SIDEBAR + OVERLAY 
     ====================================================== */
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const openCartBtn = document.getElementById("open-cart");
  const closeCartBtn = document.getElementById("close-cart");

  /* =======================================================
     HAMBURGER - NAV MOBILE OVERLAY
     ====================================================== */
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const navOverlay = document.querySelector(".nav-mobile-overlay");

  hamburgerBtn?.addEventListener("click", () => {
    navOverlay?.classList.toggle("open");
    hamburgerBtn.setAttribute(
      "aria-expanded",
      navOverlay?.classList.contains("open") ? "true" : "false",
    );
  });

  /* =======================================================
     ADD PRODUTO AO CARRINHO - EVENT DELEGATION
     ====================================================== */

  document.addEventListener("click", (e) => {
    // 👈 SÓ botões "Adicionar ao carrinho"
    if (e.target.matches(".produto button:not(.btn-details)")) {
      e.preventDefault();

      const btn = e.target;
      const id = Number(btn.dataset.id);
      const product = PRODUCTS.find((p) => p.id === id);
      if (!product) return;

      const sizeSelect = btn.closest(".produto").querySelector(".product-size");
      const size = sizeSelect?.value;

      if (!size) {
        showToastError("selecione o tamanho da peça");
        return;
      }

      addToCart({ ...product, size });
      showToast("Produto adicionado ao carrinho", "success");
      if (typeof renderCart === "function") renderCart();
    }
  });

  /* =======================================================
     CARRINHO CONTROLS - ABRIR, FECHAR, RENDER (renderCart é global e opcional)
     ====================================================== */
  openCartBtn?.addEventListener("click", () => {
    cartOverlay?.offsetHeight;
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
     FECHAR OVERLAYS - CLIQUE FORA (NAV E CART)
     ====================================================== */
  document.addEventListener("click", (e) => {
    // Fecha NAV overlay
    if (
      !e.target.closest(".header-content") &&
      navOverlay?.classList.contains("open")
    ) {
      navOverlay.classList.remove("open");
      hamburgerBtn.setAttribute("aria-expanded", "false");
    }
  });
});

// DADOS DETALHES PRODUTOS - USADO PARA MODAL DE DETALHES (ID REFERENCIA O PRODUTO)
const PRODUCT_DETAILS = {
  1: {
    // Sup Cypher
    title: "Camisa Sup Cypher - Drop DHV",
    images: [
      "assets/images/drops/DHV/camisa_hv_02.jpg",
      "assets/images/drops/DHV/camisa_hv_01.jpg",
      "assets/images/drops/DHV/camisa_hv_03.jpg",
    ],
    description:
      "Camisa oficial da Batalha Sup Cypher. Tecido premium dry-fit, silk roxo fosco inspirado na DHV. Corte street oversized perfeito para battles e cyphers.",
    specs: [
      "Material: 100% Poliéster Dry-Fit",
      "Modelagem: Oversized Street",
      "Estampa: Silk Screen Premium",
      "Cores: Roxo/Branco/Preto",
      "Tamanhos: P, M, G, GG",
    ],
  },
  2: {
    // Nos Por Nós
    title: "Camisa Nos Por Nós - Drop NPN",
    images: [
      "assets/images/drops/NPN/camisa_npn_02.jpg",
      "assets/images/drops/NPN/camisa_npn_01.jpg",
    ],
    description:
      "Representatividade amazônica. Camisa Nos Por Nós celebra a cena local com arte gráfica exclusiva. Conforto para o dia a dia da rua.",
    specs: [
      "Material: Algodão Premium 180g",
      "Modelagem: Regular Fit",
      "Estampa: Serigrafia Dupla",
      "Cores: Preto/Branco",
      "Tamanhos: P, M, G, GG",
    ],
  },
};

// EVENTOS MODAL - ABRIR, FECHAR, GALERIA DE IMAGENS (USANDO DELEGATION PARA OS THUMBS)
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("details-modal");
  const closeBtn = document.getElementById("close-details");
  const mainImg = document.getElementById("details-main-img");
  const thumbs = document.getElementById("gallery-thumbs");

  // Abrir via botão .btn-details
  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-details")) {
      const id = Number(e.target.dataset.id);
      openDetailsModal(id);
    }
  });

  // Fecha modal
  closeBtn.addEventListener("click", () => closeDetailsModal());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeDetailsModal();
  });

  // Galeria thumbs
  thumbs.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      document
        .querySelectorAll(".gallery-thumbs img")
        .forEach((img) => img.classList.remove("active"));
      e.target.classList.add("active");
      mainImg.src = e.target.src;
    }
  });
});

// FUNÇÃO PARA ABRIR O MODAL DE DETALHES - RECEBE O ID DO PRODUTO PARA PUXAR OS DADOS DO OBJETO PRODUCT_DETAILS
function openDetailsModal(id) {
  const details = PRODUCT_DETAILS[id];
  if (!details) return;

  // Título
  document.getElementById("details-title").textContent = details.title;

  // Descrição e specs
  document.getElementById("details-description").textContent =
    details.description;
  const specsList = document.getElementById("details-specs");
  specsList.innerHTML = details.specs
    .map((spec) => `<li>${spec}</li>`)
    .join("");

  // Galeria
  const mainImg = document.getElementById("details-main-img");
  const thumbs = document.getElementById("gallery-thumbs");

  mainImg.src = details.images[0];
  mainImg.alt = details.title;

  thumbs.innerHTML = details.images
    .map(
      (img, i) =>
        `<img src="${img}" alt="${details.title} ${i + 1}" ${i === 0 ? 'class="active"' : ""}>`,
    )
    .join("");

  // Abre modal
  document.getElementById("details-modal").classList.add("active");
}
// FUNÇÃO PARA FECHAR O MODAL DE DETALHES
function closeDetailsModal() {
  document.getElementById("details-modal").classList.remove("active");
}
