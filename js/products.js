/* =========================================================
   PRODUCTS CATALOG
   ========================================================= */

/**
 * Lista central de produtos disponíveis no site.
 * Este arquivo atua como uma fonte de dados estática
 * para a vitrine e para o carrinho.
 *
 * Campos obrigatórios:
 * - id       : number  → identificador único
 * - nome     : string  → nome do produto
 * - preco    : number  → valor unitário
 * - ano      : number  → ano do drop
 * - imagem   : string  → caminho da imagem
 */

const PRODUCTS = [
  {
    id: 1,
    nome: "Camisa Sup Cypher",
    preco: 120,
    ano: 2025,
    imagem: "assets/images/drops/DHV/camisa_hv_02.jpg",
  },
  {
    id: 2,
    nome: "Nos Por Nós",
    preco: 130,
    ano: 2024,
    imagem: "assets/images/drops/NPN/camisa_npn_02.jpg",
  },
];
