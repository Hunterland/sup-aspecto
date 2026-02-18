/* =========================================================
   PRODUTOS PAGE (LISTAGEM + FILTRO) - V2 LIMPA
   ========================================================= */

/** Elementos principais */
const produtosList = document.getElementById("produtos-list");
const filterYear = document.getElementById("filter-year");

/* =========================================================
   RENDERIZAÇÃO - V2 LIMPA (SEM EVENTOS, APENAS MARCAÇÃO)
   ========================================================= */
function renderProducts(products) {
  produtosList.innerHTML = ""; // Limpa grid

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "produto";

    card.innerHTML = `
      <img src="${product.imagem}" alt="${product.nome}"/>
      <h3>${product.nome}</h3>
      <p class="price">R$ ${product.preco.toFixed(2)}</p>
      
      <div class="produto-actions">
        <button class="btn-details" data-id="${product.id}">Ver detalhes</button>
        <select class="product-size" aria-label="Tamanho ${product.nome}">
          <option value="">Tamanho</option>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
        </select>
        <button data-id="${product.id}">Adicionar ao carrinho</button>
      </div>
    `;

    produtosList.appendChild(card);
  });

  // main.js já cuida dos eventos (delegation global)
  // bindCartButtons() REMOVIDO - conflito evitado
}

/* =========================================================
   FILTRO POR ANO - V2 LIMPA (SEM RELOAD, APENAS RENDERIZAÇÃO CONDICIONAL)
   ========================================================= */
filterYear.addEventListener("change", () => {
  const year = filterYear.value;

  if (year === "all") {
    renderProducts(PRODUCTS);
  } else {
    renderProducts(PRODUCTS.filter((p) => p.ano === Number(year)));
  }
});

/* =========================================================
   INIT - SORT RECENTE - V2 LIMPA (SEM RELOAD, APENAS RENDERIZAÇÃO INICIAL ORDENADA)
   ========================================================= */
renderProducts([...PRODUCTS].sort((a, b) => b.ano - a.ano));
