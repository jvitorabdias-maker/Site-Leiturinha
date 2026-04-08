function getFavorites() {
  const data = localStorage.getItem("favorites");
  return data ? JSON.parse(data) : [];
adolfo corno }

function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function getCart() {
  const data = localStorage.getItem("cart");
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleFavorite(id) {
  let favorites = getFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  saveFavorites(favorites);

  // Atualiza só o que estiver na página atual
  renderFavoritesPage();
  renderCategory();
  renderHome();
}

function addToCart(id) {
  let cart = getCart();

  if (!cart.includes(id)) {
    cart.push(id);
    saveCart(cart);
    alert("Livro adicionado ao carrinho!");
  } else {
    alert("Esse livro já está no carrinho.");
  }

  renderCartPage();
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item !== id);
  saveCart(cart);
  renderCartPage();
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function createBookCard(book) {
  const favorites = getFavorites();
  const isFav = favorites.includes(book.id);

  return `
    <article class="book-card">
      <a href="produto.html?id=${book.id}">
        <div class="book-thumb-wrap">
          <img class="book-thumb" src="${book.image}" alt="${book.title}">
        </div>
      </a>

      <div class="book-info">
        <div class="book-title-row">
          <a href="produto.html?id=${book.id}" class="book-title">${book.title}</a>

          <button type="button" class="heart-btn" onclick="toggleFavorite(${book.id})">
            ${isFav ? "♥" : "♡"}
          </button>
        </div>

        <div class="book-price">R$ ${book.price}</div>
      </div>
    </article>
  `;
}

function createCartCard(book) {
  return `
    <article class="book-card">
      <a href="produto.html?id=${book.id}">
        <div class="book-thumb-wrap">
          <img class="book-thumb" src="${book.image}" alt="${book.title}">
        </div>
      </a>

      <div class="book-info">
        <div class="book-title-row">
          <a href="produto.html?id=${book.id}" class="book-title">${book.title}</a>
          <button type="button" class="heart-btn" onclick="removeFromCart(${book.id})">🗑</button>
        </div>

        <div class="book-price">R$ ${book.price}</div>
      </div>
    </article>
  `;
}

function renderHome() {
  const homeBooks = document.getElementById("home-books");
  if (!homeBooks) return;

  const topBooks = books.filter(book => book.category === "romance").slice(0, 6);
  homeBooks.innerHTML = topBooks.map(createBookCard).join("");
}

function renderCategory() {
  const grid = document.getElementById("category-grid");
  const label = document.getElementById("category-label");

  if (!grid || !label) return;

  const category = getQueryParam("tipo") || "romance";
  const filtered = books.filter(book => book.category === category);

  label.textContent = category.toUpperCase();
  grid.innerHTML = filtered.map(createBookCard).join("");
}

function renderProduct() {
  const area = document.getElementById("product-page");
  if (!area) return;

  const id = Number(getQueryParam("id")) || 1;
  const book = books.find(item => item.id === id);

  if (!book) {
    area.innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  const entregaMap = {
    8: "25/08",
    13: "28/08",
    14: "15/08",
    17: "10/08",
    18: "26/08",
    19: "10/08",
    20: "19/08"
  };

  const dataEntrega = entregaMap[book.id] || "10/08";

  area.innerHTML = `
    <section class="product-section">
      <div class="container">
        <div class="product-layout">
          <div>
            <img class="product-cover" src="${book.image}" alt="${book.title}">
          </div>

          <div class="product-details">
            <span class="discount-badge">${book.discount} de desconto</span>
            <h1 class="product-title">${book.title}</h1>
            <h2 class="product-author">De ${book.author}</h2>

            <div class="product-types">
              <button type="button" class="type-btn">Livro</button>
              <button type="button" class="type-btn">Ebook</button>
            </div>

            <div class="product-meta">
              editor: ${book.editor}, ${book.details} - ver detalhes do produto
            </div>

            <div class="rating-line">
              <span class="stars">☆☆☆☆☆</span>
              <span>avaliação dos leitores</span>
              <span>(${book.comments} Comentários)</span>
            </div>

            <div class="product-price">R$ ${book.price}</div>
            <div class="product-extra">${book.discount} de desconto no cartão</div>

            <button type="button" class="buy-btn" onclick="addToCart(${book.id})">Comprar</button>
            <div class="delivery">Disponível - receba até - ${dataEntrega}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="synopsis-section">
      <div class="container">
        <div class="synopsis-layout">
          <div class="synopsis-box">
            <h2>Sinopse</h2>
            <div class="synopsis-content">${book.synopsis}</div>
          </div>

          <div class="hearts-side">
            <span>♡</span>
            <span>♡</span>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderFavoritesPage() {
  const area = document.getElementById("favorites-page");
  if (!area) return;

  const favorites = getFavorites();
  const favoriteBooks = books.filter(book => favorites.includes(book.id));

  if (favoriteBooks.length === 0) {
    area.innerHTML = `
      <div class="container">
        <section class="empty-box">
          <div class="empty-icon">♡</div>
          <div class="empty-text">
            <h1>Minha Lista de Desejos</h1>
            <p>ESTÁ VAZIO AQUI.<br>Faça login para ver a sua Lista de Desejos.</p>
            <div class="empty-actions">
              <a href="cadastro.html" class="black-btn">CRIAR CONTA</a>
              <a href="login.html" class="black-btn">FAZER LOGIN</a>
            </div>
          </div>
        </section>
      </div>
    `;
  } else {
    area.innerHTML = `
      <div class="container">
        <div class="category-label">FAVORITOS</div>
        <section class="books-grid">
          ${favoriteBooks.map(createBookCard).join("")}
        </section>
      </div>
    `;
  }
}

function renderCartPage() {
  const area = document.getElementById("cart-page");
  if (!area) return;

  const cart = getCart();
  const cartBooks = books.filter(book => cart.includes(book.id));

  if (cartBooks.length === 0) {
    area.innerHTML = `
      <div class="container">
        <section class="empty-box">
          <div class="empty-icon">🛒</div>
          <div class="empty-text">
            <h1>SEU CARRINHO ESTÁ VAZIO</h1>
            <p>Faça login para ver o seu carrinho e comece a comprar</p>
            <div class="empty-actions">
              <a href="cadastro.html" class="black-btn">CRIAR CONTA</a>
              <a href="login.html" class="black-btn">FAZER LOGIN</a>
            </div>
          </div>
        </section>
      </div>
    `;
  } else {
    area.innerHTML = `
      <div class="container">
        <div class="category-label">CARRINHO</div>
        <section class="books-grid">
          ${cartBooks.map(createCartCard).join("")}
        </section>
      </div>
    `;
  }
}

function validateLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail");
    const senha = document.getElementById("loginSenha");
    const erroEmail = document.getElementById("erroLoginEmail");
    const erroSenha = document.getElementById("erroLoginSenha");
    const sucesso = document.getElementById("loginSuccess");

    erroEmail.textContent = "";
    erroSenha.textContent = "";
    sucesso.textContent = "";

    let valido = true;

    if (email.value.trim() === "") {
      erroEmail.textContent = "Digite seu e-mail.";
      valido = false;
    } else if (!email.value.includes("@") || !email.value.includes(".")) {
      erroEmail.textContent = "E-mail inválido.";
      valido = false;
    }

    if (senha.value.trim() === "") {
      erroSenha.textContent = "Digite sua senha.";
      valido = false;
    } else if (senha.value.trim().length < 6) {
      erroSenha.textContent = "A senha deve ter pelo menos 6 caracteres.";
      valido = false;
    }

    if (valido) {
      sucesso.textContent = "Login realizado com sucesso!";
      form.reset();
    }
  });
}

function validateCadastroForm() {
  const form = document.getElementById("cadastroForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("cadNome");
    const sobrenome = document.getElementById("cadSobrenome");
    const email = document.getElementById("cadEmail");
    const senha = document.getElementById("cadSenha");
    const confirmar = document.getElementById("cadConfirmar");

    const erroNome = document.getElementById("erroCadNome");
    const erroSobrenome = document.getElementById("erroCadSobrenome");
    const erroEmail = document.getElementById("erroCadEmail");
    const erroSenha = document.getElementById("erroCadSenha");
    const erroConfirmar = document.getElementById("erroCadConfirmar");
    const sucesso = document.getElementById("cadSuccess");

    if (!nome || !sobrenome || !email || !senha || !confirmar) return;

    erroNome.textContent = "";
    erroSobrenome.textContent = "";
    erroEmail.textContent = "";
    erroSenha.textContent = "";
    erroConfirmar.textContent = "";
    sucesso.textContent = "";

    let valido = true;

    if (nome.value.trim() === "") {
      erroNome.textContent = "Digite seu nome.";
      valido = false;
    }

    if (sobrenome.value.trim() === "") {
      erroSobrenome.textContent = "Digite seu sobrenome.";
      valido = false;
    }

    if (email.value.trim() === "") {
      erroEmail.textContent = "Digite seu e-mail.";
      valido = false;
    } else if (!email.value.includes("@") || !email.value.includes(".")) {
      erroEmail.textContent = "E-mail inválido.";
      valido = false;
    }

    if (senha.value.trim() === "") {
      erroSenha.textContent = "Digite sua senha.";
      valido = false;
    } else if (senha.value.trim().length < 6) {
      erroSenha.textContent = "A senha deve ter no mínimo 6 caracteres.";
      valido = false;
    }

    if (confirmar.value.trim() === "") {
      erroConfirmar.textContent = "Confirme sua senha.";
      valido = false;
    } else if (confirmar.value !== senha.value) {
      erroConfirmar.textContent = "As senhas não coincidem.";
      valido = false;
    }

    if (valido) {
      sucesso.textContent = "Conta criada com sucesso!";
      form.reset();
    }
  });
}

function validateContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nome = document.getElementById("contatoNome");
    const email = document.getElementById("contatoEmail");
    const mensagem = document.getElementById("contatoMensagem");

    const erroNome = document.getElementById("erroContatoNome");
    const erroEmail = document.getElementById("erroContatoEmail");
    const erroMensagem = document.getElementById("erroContatoMensagem");
    const sucesso = document.getElementById("contactSuccess");

    erroNome.textContent = "";
    erroEmail.textContent = "";
    erroMensagem.textContent = "";
    sucesso.textContent = "";

    let valido = true;

    if (nome.value.trim() === "") {
      erroNome.textContent = "Digite seu nome.";
      valido = false;
    }

    if (email.value.trim() === "") {
      erroEmail.textContent = "Digite seu e-mail.";
      valido = false;
    } else if (!email.value.includes("@") || !email.value.includes(".")) {
      erroEmail.textContent = "Digite um e-mail válido.";
      valido = false;
    }

    if (mensagem.value.trim() === "") {
      erroMensagem.textContent = "Digite sua mensagem.";
      valido = false;
    } else if (mensagem.value.trim().length < 10) {
      erroMensagem.textContent = "A mensagem deve ter pelo menos 10 caracteres.";
      valido = false;
    }

    if (valido) {
      sucesso.textContent = "Mensagem enviada com sucesso!";
      form.reset();
    }
  });
}

function renderPageContent() {
  renderHome();
  renderCategory();
  renderProduct();
  renderFavoritesPage();
  renderCartPage();
}

document.addEventListener("DOMContentLoaded", function () {
  renderPageContent();
  validateLoginForm();
  validateCadastroForm();
  validateContactForm();
});
