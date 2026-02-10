/* =========================================================
   PRODUTOS PAGE (LISTAGEM + FILTRO)
   ========================================================= */

/**
 * Elementos principais da página de produtos
 */
const produtosList = document.getElementById("produtos-list");
const filterYear = document.getElementById("filter-year");

/* =========================================================
   RENDERIZAÇÃO DE PRODUTOS
   ========================================================= */

/**
 * Renderiza os cards de produtos no grid
 * @param {Array} products - lista de produtos a renderizar
 */
function renderProducts(products) {
  // limpa o grid
  produtosList.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "produto";

    card.innerHTML = `
      <img src="${product.imagem}" alt="${product.nome}" />

      <h3>${product.nome}</h3>

      <p class="price">R$ ${product.preco}</p>

      <select class="product-size">
        <option value="">Tamanho</option>
        <option value="P">P</option>
        <option value="M">M</option>
        <option value="G">G</option>
        <option value="GG">GG</option>
      </select>

      <button data-id="${product.id}">
        Adicionar ao carrinho
      </button>
    `;

    produtosList.appendChild(card);
  });

  // reaplica os eventos de carrinho
  bindCartButtons();
}

/* =========================================================
   AÇÕES DO CARRINHO
   ========================================================= */

/**
 * Associa os eventos de clique aos botões "Adicionar ao carrinho"
 * Essa função precisa ser reaplicada após cada renderização
 */
function bindCartButtons() {
  document.querySelectorAll(".produto button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = PRODUCTS.find((p) => p.id === id);
      const size = btn.parentElement.querySelector(".product-size").value;

      if (!size) {
        alert("Selecione o tamanho da peça");
        return;
      }

      addToCart({ ...product, size });

      // força atualização visual do carrinho
      if (typeof renderCart === "function") {
        renderCart();
      }
    });
  });
}

/* =========================================================
   FILTRO POR ANO
   ========================================================= */

/**
 * Filtra os produtos de acordo com o ano selecionado
 */
filterYear.addEventListener("change", () => {
  const year = filterYear.value;

  if (year === "all") {
    renderProducts(PRODUCTS);
  } else {
    renderProducts(
      PRODUCTS.filter((p) => p.ano === Number(year))
    );
  }
});

/* =========================================================
   INIT
   ========================================================= */

/**
 * Render inicial:
 * - produtos ordenados do mais recente para o mais antigo
 */
renderProducts(
  [...PRODUCTS].sort((a, b) => b.ano - a.ano)
);
