import { catalog, UI, boot, Basket, Wishlist, money } from "./core.js";
const type = document.body.dataset.page,
  basket = boot(),
  root = document.querySelector("main"),
  grid = (items) =>
    `<div class="cards">${items.map(UI.product).join("")}</div>`;
const title = (a, b) =>
  `<section class="simple-page"><p class="kicker">NOVA / ${a.toUpperCase()}</p><h1>${a}<br><em>${b}</em></h1>`;
if (["shop", "categories", "new", "trending", "collections"].includes(type)) {
  let data =
    type === "new"
      ? catalog.slice(0, 3)
      : type === "trending"
        ? catalog.filter((p) => p.r >= 4.8)
        : catalog;
  root.innerHTML =
    title(type === "shop" ? "Shop all" : type, "made personal") +
    `<div class="search"><input id="search" placeholder="Search products, categories and ideas"></div><div class="filters">${["All", "Fashion", "Tech", "Home"].map((x) => `<button class="filter" data-cat="${x}">${x}</button>`).join("")}</div><div id="grid">${grid(data)}</div></section>`;
  document.querySelector("#search").oninput = (e) => {
    document.querySelector("#grid").innerHTML = grid(
      catalog.filter((p) =>
        (p.n + p.c).toLowerCase().includes(e.target.value.toLowerCase()),
      ),
    );
  };
  document
    .querySelectorAll("[data-cat]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          (document.querySelector("#grid").innerHTML = grid(
            catalog.filter(
              (p) => b.dataset.cat === "All" || p.c === b.dataset.cat,
            ),
          ))),
    );
}
if (type === "product") {
  let p =
    catalog.find(
      (x) => x.id === +new URLSearchParams(location.search).get("id"),
    ) || catalog[0];
  let saved = new Wishlist().get().includes(p.id);
  root.innerHTML = `<section class="simple-page detail"><img src="${p.img}" alt="${p.n}"><div><p class="kicker">${p.c}</p><h1>${p.n}</h1><p class="rating">${p.r} ★ VERIFIED REVIEWS</p><p class="price">${money(p.p)}</p><p class="muted">Exceptional design, carefully selected for the NOVA edit. ${p.stock} pieces are available now.</p><div class="actions"><button class="primary" data-add="${p.id}">Add to basket →</button><button class="secondary wishlist-detail ${saved ? "saved" : ""}" data-wish="${p.id}" aria-pressed="${saved}">${saved ? "♥ Saved to wishlist" : "♡ Add to wishlist"}</button><a class="secondary" href="compare.html">Compare products</a></div><hr class="line"><b>Customer reviews</b><p class="muted">“Beautifully made and exactly as pictured.” — Mariam, verified buyer</p></div></section>`;
}
if (type === "wishlist") {
  let w = new Wishlist();
  root.innerHTML =
    title("Wishlist", "saved for later") +
    grid(catalog.filter((p) => w.get().includes(p.id))) +
    "</section>";
}
if (type === "cart" || type === "checkout") {
  let rows =
    basket
      .get()
      .map((x) => {
        let p = catalog.find((p) => p.id === x.id);
        return `<div class="cart-row"><img src="${p.img}"><div><b>${p.n}</b><p class="muted">Quantity: ${x.q}</p><span class="price">${money(p.p * x.q)}</span></div><button class="secondary" data-remove="${p.id}">Remove</button></div>`;
      })
      .join("") ||
    '<p class="muted">Your basket is empty. Start with the shop.</p>';
  root.innerHTML =
    title(
      type === "cart" ? "Your basket" : "Secure checkout",
      type === "cart" ? "ready when you are" : "almost complete",
    ) +
    `<div class="checkout"><div class="panel">${rows}</div><aside class="summary"><h2>Order summary</h2><p class="muted">Subtotal <b>${money(basket.total)}</b></p><p class="muted">Delivery ${basket.total > 1500 ? "Free" : "EGP 90"}</p><hr class="line"><h3>Total ${money(basket.total + (basket.total > 1500 ? 0 : 90))}</h3>${type === "cart" ? '<a class="primary" href="checkout.html">Continue to checkout →</a>' : '<form id="pay"><input required placeholder="Full name"><input required type="email" placeholder="Email"><input required placeholder="Delivery address"><select><option>Card — Stripe demo</option><option>Cash on delivery</option></select><button class="primary">Place secure demo order →</button></form><div id="done"></div>'}</aside></div></section>`;
  document.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        basket.remove(+b.dataset.remove);
        location.reload();
      }),
  );
  document.querySelector("#pay")?.addEventListener("submit", (e) => {
    e.preventDefault();
    let orders = JSON.parse(localStorage.novaOrders || "[]");
    orders.push({
      id: "NOVA-" + Date.now().toString().slice(-6),
      total: basket.total,
      status: "Preparing shipment",
    });
    localStorage.novaOrders = JSON.stringify(orders);
    basket.value = [];
    basket.save();
    document.querySelector("#done").innerHTML =
      '<div class="order-confirm">Order confirmed. Your tracking is now live in Orders.</div>';
  });
}
if (type === "compare")
  root.innerHTML =
    title("Compare", "choose smarter") +
    `<div class="compare">${catalog
      .slice(0, 3)
      .map(
        (p) =>
          `<div class="panel"><img src="${p.img}"><h3>${p.n}</h3><p class="price">${money(p.p)}</p><p class="muted">${p.r} ★ · ${p.stock} in stock</p></div>`,
      )
      .join("")}</div></section>`;
if (["orders", "account", "support", "admin"].includes(type)) {
  let body =
    type === "orders"
      ? JSON.parse(localStorage.novaOrders || "[]")
          .map(
            (o) =>
              `<div class="order-row"><b>${o.id}</b><span>${o.status}</span><span class="price">${money(o.total)}</span></div>`,
          )
          .join("") || '<p class="muted">No orders placed yet.</p>'
      : type === "admin"
        ? `<div class="admin-grid"><div class="metric">Products<strong>${catalog.length}</strong></div><div class="metric">Inventory<strong>${catalog.reduce((s, p) => s + p.stock, 0)}</strong></div><div class="metric">Orders<strong>${JSON.parse(localStorage.novaOrders || "[]").length}</strong></div><div class="metric">Status<strong>Live</strong></div></div><div class="panel"><h2>Admin dashboard</h2><p class="muted">Live inventory, product publishing and reporting are ready to connect to your secure back office API.</p></div>`
        : `<div class="panel"><h2>${type === "support" ? "NOVA concierge" : "Your NOVA profile"}</h2><p class="muted">${type === "support" ? "Track an order, start a return, or ask the AI concierge for help." : "Manage addresses, saved payment methods, personalised recommendations and rewards."}</p></div>`;
  root.innerHTML =
    title(type, type === "admin" ? "control room" : "made simple") +
    body +
    "</section>";
}
