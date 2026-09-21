const categories = [

  ["🏠", "Hogar"],

  ["💻", "Tecnología"],

  ["👕", "Ropa y accesorios"],

  ["💄", "Belleza"],

  ["🏋️", "Deportes"],

  ["🧸", "Niños"],

  ["🔧", "Herramientas"],

  ["🐾", "Mascotas"],

  ["🚗", "Automotriz"],

  ["🏷️", "Ofertas"]

];


let cart =
  JSON.parse(
    localStorage.getItem("novamarket_cart") || "[]"
  );


let currentProducts = [...products];


const $ = id =>
  document.getElementById(id);


const money = n =>
  "S/ " +
  n.toLocaleString(
    "es-PE",
    {
      minimumFractionDigits: 2
    }
  );


/* CATEGORÍAS */

function renderCategories() {

  $("categoryStrip").innerHTML =
    categories
      .map(([emoji, name]) => `

        <button
          class="cat-card"
          data-category="${name}"
        >

          <span class="emoji">
            ${emoji}
          </span>

          <span>
            ${name}
          </span>

        </button>

      `)
      .join("");


  document
    .querySelectorAll(
      ".cat-card, .sidebar button"
    )
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          filterCategory(
            btn.dataset.category
          );

        }
      );

    });

}


/* MOSTRAR PRODUCTOS */

function renderProducts(
  list = currentProducts
) {

  $("productGrid").innerHTML =

    list.map(p => `

      <article class="product">

        <div class="product-image">

          <span
            class="badge ${p.new ? "new" : ""}"
          >
            ${p.badge}
          </span>

          ${p.emoji}

        </div>


        <div class="product-body">

          <h3>
            ${p.name}
          </h3>


          <div class="stars">

            ${"★".repeat(p.rating)}

            ${"☆".repeat(5 - p.rating)}

            <small>
              (${p.reviews})
            </small>

          </div>


          <div>

            <span class="price-old">

              ${p.old ? money(p.old) : ""}

            </span>

            <span class="price">

              ${money(p.price)}

            </span>

          </div>


          <button
            class="add"
            onclick="addToCart(${p.id})"
          >

            🛒 &nbsp;
            Agregar al carrito

          </button>

        </div>

      </article>

    `).join("");

}


/* FILTRAR */

function filterCategory(category) {

  if (category === "Ofertas") {

    currentProducts =
      products.filter(
        p => p.old > p.price
      );

  }

  else if (category === "Novedades") {

    currentProducts =
      products.filter(
        p => p.new
      );

  }

  else {

    currentProducts =
      products.filter(
        p => p.category === category
      );

  }


  renderProducts(
    currentProducts
  );


  document
    .getElementById("productos")
    .scrollIntoView({
      behavior: "smooth"
    });

}


/* BUSCADOR */

$("searchInput")
  .addEventListener(
    "input",
    e => {

      const q =
        e.target.value
          .toLowerCase()
          .trim();


      currentProducts =
        products.filter(
          p =>
            (
              p.name +
              " " +
              p.category
            )
              .toLowerCase()
              .includes(q)
        );


      renderProducts(
        currentProducts
      );

    }
  );


/* AGREGAR AL CARRITO */

function addToCart(id) {

  const found =
    cart.find(
      x => x.id === id
    );


  if (found) {

    found.qty++;

  }

  else {

    cart.push({
      id: id,
      qty: 1
    });

  }


  saveCart();

  openCart();

}


/* GUARDAR CARRITO */

function saveCart() {

  localStorage.setItem(
    "novamarket_cart",
    JSON.stringify(cart)
  );


  $("cartCount").textContent =
    cart.reduce(
      (a, x) => a + x.qty,
      0
    );

}


/* ABRIR CARRITO */

function openCart() {

  $("cartModal")
    .classList
    .add("open");


  renderCart();

}


/* CERRAR */

function closeCart() {

  $("cartModal")
    .classList
    .remove("open");

}


/* MOSTRAR CARRITO */

function renderCart() {

  if (!cart.length) {

    $("cartItems").innerHTML =
      "<p>Tu carrito está vacío.</p>";

    $("cartTotal").textContent =
      "S/ 0.00";

    return;

  }


  let total = 0;


  $("cartItems").innerHTML =

    cart.map(item => {

      const p =
        products.find(
          x => x.id === item.id
        );


      total +=
        p.price *
        item.qty;


      return `

        <div class="cart-line">

          <span>

            ${p.emoji}

            ${p.name}

            × ${item.qty}

          </span>


          <strong>

            ${money(
              p.price *
              item.qty
            )}

          </strong>

        </div>

      `;

    }).join("");


  $("cartTotal").textContent =
    money(total);

}


/* BOTÓN CARRITO */

$("cartButton")
  .addEventListener(
    "click",
    openCart
  );


/* CERRAR CARRITO */

$("closeCart")
  .addEventListener(
    "click",
    closeCart
  );


$("cartModal")
  .addEventListener(
    "click",
    e => {

      if (
        e.target ===
        $("cartModal")
      ) {

        closeCart();

      }

    }
  );


/* WHATSAPP */

$("checkout")
  .addEventListener(
    "click",
    () => {

      if (!cart.length) {

        return;

      }


      const lines =
        cart.map(i => {

          const p =
            products.find(
              x => x.id === i.id
            );


          return `
${i.qty} x ${p.name}
— ${money(
            p.price *
            i.qty
          )}
`;

        }).join("\n");


      const total =
        cart.reduce(
          (sum, i) =>

            sum +

            products.find(
              p => p.id === i.id
            ).price *

            i.qty,

          0
        );


      const text =

`Hola, quiero hacer un pedido en NovaMarket:

${lines}

Total:
${money(total)}`;


      window.open(

        "https://wa.me/51987654321?text=" +

        encodeURIComponent(text),

        "_blank"

      );

    }
  );


/* INICIAR TIENDA */

renderCategories();

renderProducts();

saveCart();
