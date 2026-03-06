# Sup. Aspecto — E-commerce Streetwear Hip-Hop

![Preview do site](https://raw.githubusercontent.com/Hunterland/sup-aspecto/master/assets/preview.gif)


## 📌 Descrição do Projeto

Este repositório contém o **e-commerce MVP do Sup. Aspecto**, marca independente de streetwear nascida em Manaus-AM (2026). Desenvolvido com foco em **cultura hip-hop amazônica**, **conversão mobile-first**, **identidade visual urbana** e **experiência de compra fluida**.

O site comercializa **drops exclusivos** (Cypher DHV, Nós Por Nois NPN) integrando a cena local: Batalha da Malta, Primatas Clan e identidade amazônica.

**Status:** MVP 95% funcional → pronto para produção.

***

## 🎯 Objetivos do Site

* Vender streetwear hip-hop com identidade amazônica
* Capturar leads via EmailJS + WhatsApp Pix imediato
* Experiência mobile perfeita (320px iPhone SE+)
* Construir autoridade da marca Sup. Aspecto
* Escalar para outras Stacks futuras

***

## 🧱 Estrutura da Página

**index.html** (Página Principal):
* **Header** — Logo (48-80px) + hamburger/nav + 🛒 ícone via CDN
* **Hero** — "Coleção Batalha Malta" video-like bg crop 15%
* **Manifesto** — "Nascida no Amazonas. Feita na rua. Criada pela cena."
* **Drop Atual** — Cypher R$120 + NPN R$130 (select P/M/G/GG)
* **Footer** — Contato + redes + copyright 2026

**produto.html** — Lista completa + filtro ano
**sobre.html** — Narrativa marca + história

***

## 🛠️ Tecnologias Utilizadas

* **HTML5** — Semântica + acessibilidade (aria-labels)
* **CSS3** — Mobile-first `clamp()` + Grid/Flex + `cubic-bezier`
* **JavaScript Vanilla** — Carrinho localStorage + validações
* **EmailJS** — Checkout sem backend (Pix/Dinheiro)
* **Font Awesome 6.5** — Ícones cart/menu
* **Google Fonts** — **Bebas Neue** (títulos) + **Inter** (texto)

**CDNs Zero Bloqueio** — Performance Lighthouse 95+ Mobile

***

## 🎨 Destaques Técnicos

* **Responsivo Total** — 320px (iPhone SE) até 2K+
* **Header Inteligente** — Mobile: ≡ LOGO 🛒 | Desktop: LOGO Nav 🛒
* **Carrinho Sidebar** — `right:-100vw` slide sem vazamento
* **Checkout Híbrido** — EmailJS + WhatsApp Pix imediato Manaus
* **Validações UX** — Toast size obrigatório + merge carrinho

***

## 📁 Estrutura de Pastas

```bash
sup-aspecto/
├── 📄 index.html          ← Home + produtos destaque
├── 📄 produto.html        ← Catálogo completo + filtro
├── 📁 css/                 ← Arquitetura 5 arquivos
│   ├── reset.css         ← Box-sizing universal
│   ├── variables.css     ← --purple #5b2d8b + fonts
│   ├── base.css          ← Typography base
│   ├── layout.css        ← Header/hero/sidebar/footer
│   └── components.css    ← Buttons/produtos
├── 📁 js/                 ← Funcionalidades modulares
│   ├── products.js       ← [Cypher id:1, NPN id:2]
│   ├── main.js          ← Eventos + hamburger
│   ├── cart.js          ← localStorage + EmailJS/WhatsApp
│   ├── toast.js         ← Notificações slide 3s
│   └── produtos.js      ← Filtro dinâmico produto.html
├── 📁 assets/
│   ├── images/logo/supaspecto.png
│   ├── images/drops/DHV/camisa_hv_02.jpg
│   ├── images/drops/NPN/camisa_npn_02.jpg
│   └── images/hero/hero-batalha-malta.png
└── 📄 README.md
```





## 🚀 Deploy

### **Deploy**
```
GitHub Pages
```

### **Teste Local**
```bash
VSCode Live Server
```

### **Fluxo de Teste Completo**
```bash
1. 375px mobile → CLICK ≡ → Overlay links ✓
2. Cypher → M → Add → TOAST "adicionado" ✓
3. 🛒 badge "1" → Open → Cypher M R$120 ✓
4. "João Silva" + Pix → Finalizar → WhatsApp ✓
```

***

## 📄 Licença

```
© 2026 Sup. Aspecto — Todos os direitos reservados.
Desenvolvido para a cena hip-hop amazônica.
Uso comercial exclusivo da marca.
```

***

**Desenvolvido por:** Alan Barroncas 
**Data:** 12 Fevereiro 2026  
**Versão:** 1.0.0 MVP  

```bash
⭐ Star se curtiu a streetwear tech!
```

***

