const products = [
  {
    id: 1,
    n: "Aster Silk Slip Dress",
    c: "Fashion",
    p: 2890,
    r: 4.9,
    stock: 8,
    tag: "NEW",
    img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85",
    d: "An elegant bias-cut silhouette made for unforgettable evenings.",
  },
  {
    id: 2,
    n: "Solace Heel",
    c: "Fashion",
    p: 1490,
    r: 4.8,
    stock: 14,
    tag: "TRENDING",
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85",
    d: "Sculptural comfort, designed to dance all night.",
  },
  {
    id: 3,
    n: "Mira Clutch",
    c: "Fashion",
    p: 890,
    r: 4.7,
    stock: 12,
    tag: "EDITORS PICK",
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85",
    d: "A polished finishing touch with room for essentials.",
  },
  {
    id: 4,
    n: "NOVA Code 14",
    c: "Tech",
    p: 42990,
    r: 4.9,
    stock: 5,
    tag: "BEST VALUE",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85",
    d: "A high-performance laptop for building, compiling and creating.",
  },
  {
    id: 5,
    n: "Echo ANC Headphones",
    c: "Tech",
    p: 6790,
    r: 4.8,
    stock: 18,
    tag: "TRENDING",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
    d: "Immersive sound with all-day comfort.",
  },
  {
    id: 6,
    n: "Halo Desk Lamp",
    c: "Home",
    p: 1250,
    r: 4.6,
    stock: 20,
    tag: "NEW",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85",
    d: "Focused light for your best work.",
  },
  {
    id: 7,
    n: "Orbit Smart Watch",
    c: "Tech",
    p: 8990,
    r: 4.7,
    stock: 9,
    tag: "LIMITED",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    d: "Your daily rhythm, beautifully tracked.",
  },
  {
    id: 8,
    n: "Terra Sculptural Vase",
    c: "Home",
    p: 740,
    r: 4.8,
    stock: 16,
    tag: "CURATED",
    img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=85",
    d: "An organic object for expressive spaces.",
  },
];
let cart = JSON.parse(localStorage.novaCart || "[]"),
  wish = JSON.parse(localStorage.novaWish || "[]"),
  orders = JSON.parse(localStorage.novaOrders || "[]");
const app = document.querySelector("#app"),
  $ = (s) => document.querySelector(s),
  money = (n) => "EGP " + n.toLocaleString("en-EG");
const save = () => {
  localStorage.novaCart = JSON.stringify(cart);
  localStorage.novaWish = JSON.stringify(wish);
  localStorage.novaOrders = JSON.stringify(orders);
  $("#cartCount").textContent = cart.reduce((a, x) => a + x.q, 0);
  $("#wishCount").textContent = wish.length;
};
const toast = (t) => {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("show");
  setTimeout(() => e.classList.remove("show"), 2300);
};
const card = (p) =>
  `<article class="product"><a href="#product/${p.id}"><img src="${p.img}" alt="${p.n}"><span class="tag">${p.tag}</span></a><button class="heart" data-wish="${p.id}">${wish.includes(p.id) ? "♥" : "♡"}</button><div class="product-info"><small>${p.c} · ${p.r} ★ · ${p.stock} left</small><h3><a href="#product/${p.id}">${p.n}</a></h3><span class="price">${money(p.p)}</span></div><button class="quick" data-add="${p.id}">+</button></article>`;
const attach = () => {
  document
    .querySelectorAll("[data-add]")
    .forEach((b) => (b.onclick = () => add(+b.dataset.add)));
  document.querySelectorAll("[data-wish]").forEach(
    (b) =>
      (b.onclick = () => {
        let id = +b.dataset.wish;
        wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
        save();
        render();
      }),
  );
  document
    .querySelectorAll("[data-ai]")
    .forEach((b) => (b.onclick = () => $("#assistant").showModal()));
};
const add = (id) => {
  let x = cart.find((x) => x.id === id),
    p = products.find((p) => p.id === id);
  if (x) x.q = Math.min(x.q + 1, p.stock);
  else cart.push({ id, q: 1 });
  save();
  toast(`${p.n} added to your bag`);
};
function home() {
  return `<section class="page hero"><div><p class="kicker">THE FUTURE OF FINDING</p><h1>Everything you love.<br><em>Intelligently found.</em></h1><p class="sub">NOVA is a new kind of marketplace: curated, personal, and powered by a shopping assistant that understands what you mean.</p><div class="actions"><a class="primary" href="#shop">Explore marketplace →</a><button class="secondary" data-ai>Ask NOVA AI ✦</button></div><div class="hero-stats"><div><strong>24h</strong> Cairo delivery</div><div><strong>4.9/5</strong> verified rating</div><div><strong>0%</strong> guesswork</div></div></div><div class="hero-board"><span class="live">● NOVA INTELLIGENCE ONLINE</span><div class="orbit"></div><span class="live">PERSONAL EDITS / REAL INVENTORY / FAST CHECKOUT</span></div></section>${grid("New arrivals", "Fresh drops, selected for right now.", products.slice(0, 4))}<section class="page"><div class="category-grid"><a class="category" href="#categories">FASHION</a><a class="category" href="#categories">TECH</a><a class="category" href="#categories">HOME</a></div><div class="feature"><div><p class="kicker">YOUR PERSONAL SHOPPER</p><h2>Just tell NOVA<br>what you need.</h2></div><div><p class="muted">From “a wedding look under EGP 5,000” to “a programming laptop under EGP 50k,” NOVA reads the brief, checks the budget, and delivers a usable edit.</p><button class="primary" data-ai>Try the AI assistant →</button></div></div></section>`;
}
function grid(t, s, items) {
  return `<section class="page"><div class="section-head"><div><p class="kicker">NOVA EDIT</p><h2>${t}</h2></div><p>${s}</p></div><div class="cards">${items.map(card).join("")}</div></section>`;
}
function shop(type = "Shop") {
  let cats = ["All", "Fashion", "Tech", "Home"];
  return `<section class="page"><p class="kicker">${type.toUpperCase()}</p><h1 class="view-title">Find your<br><em>next favourite.</em></h1><div class="search"><input id="search" placeholder="Search the future marketplace"><button class="primary" id="searchGo">Search</button></div><div class="filters">${cats.map((c) => `<button class="filter ${c === "All" ? "active" : ""}" data-filter="${c}">${c}</button>`).join("")}<button class="filter" data-ai>AI match ✦</button></div><div class="cards" id="results">${products.map(card).join("")}</div></section>`;
}
function detail(id) {
  let p = products.find((x) => x.id === +id);
  return `<section class="page detail"><img src="${p.img}" alt="${p.n}"><div><p class="kicker">${p.tag} / ${p.c}</p><h1>${p.n}</h1><p class="rating">${p.r} ★ VERIFIED CUSTOMER RATING</p><p class="price">${money(p.p)}</p><p class="muted">${p.d}</p><hr class="line"><p class="muted">${p.stock} available now · Free returns · Secure payment</p><div class="actions"><button class="primary" data-add="${p.id}">Add to bag →</button><button class="secondary" data-wish="${p.id}">Save ♡</button><a class="secondary" href="#compare">Compare</a></div><section class="panel"><b>Verified reviews</b><p class="muted">“Exactly as described, beautifully packaged.” — Salma, Cairo</p></section></div></section>`;
}
function cartView() {
  let rows = cart
    .map((x) => {
      let p = products.find((p) => p.id === x.id);
      return `<div class="cart-row"><img src="${p.img}"><div><b>${p.n}</b><p class="muted">Quantity ${x.q}</p><span class="price">${money(p.p * x.q)}</span></div><button class="secondary" data-remove="${p.id}">Remove</button></div>`;
    })
    .join("");
  let total = cart.reduce(
    (a, x) => a + products.find((p) => p.id === x.id).p * x.q,
    0,
  );
  return `<section class="page"><p class="kicker">YOUR BAG</p><h1 class="view-title">Almost<br><em>yours.</em></h1><div class="feature"><div>${rows || '<p class="muted">Your bag is waiting for a future favourite.</p>'}</div><div class="panel"><h2>Order summary</h2><p class="muted">Delivery ${total > 1500 ? "Free" : "EGP 90"}</p><hr class="line"><h3>Total ${money(total + (total > 1500 ? 0 : 90))}</h3><a class="primary" href="#checkout">Secure checkout →</a><p class="muted">Stripe-ready payment flow</p></div></div></section>`;
}
function dashboard() {
  return `<section class="page"><p class="kicker">ADMIN CONTROL ROOM</p><h1 class="view-title">Store<br><em>intelligence.</em></h1><div class="admin-grid"><div class="metric">Live products<strong>${products.length}</strong></div><div class="metric">Inventory units<strong>${products.reduce((a, p) => a + p.stock, 0)}</strong></div><div class="metric">Demo orders<strong>${orders.length}</strong></div><div class="metric">Revenue<strong>${money(orders.reduce((a, o) => a + o.t, 0))}</strong></div></div><div class="feature"><form id="adminForm" class="form-grid"><input class="wide" id="pn" placeholder="Product name" required><select id="pc"><option>Fashion</option><option>Tech</option><option>Home</option></select><input id="pp" type="number" placeholder="Price in EGP" required><input class="wide" id="pi" placeholder="Image URL" required><button class="primary wide">Publish to marketplace →</button></form><div><h2>Live inventory</h2><p class="muted">Products published here appear directly in Shop, search, product pages, recommendations and AI results.</p>${products.map((p) => `<p class="muted">${p.n} <span class="price">${p.stock} in stock</span></p>`).join("")}</div></div></section>`;
}
function standard(title, body) {
  return `<section class="page"><p class="kicker">NOVA / ${title.toUpperCase()}</p><h1 class="view-title">${title}<br><em>reimagined.</em></h1><div class="panel">${body}</div></section>`;
}
function route() {
  let [view, id] = location.hash.slice(1).split("/");
  let out =
    view === "shop" ||
    view === "new" ||
    view === "trending" ||
    view === "collections" ||
    view === "categories"
      ? shop(view === "new" ? "New arrivals" : view || "Shop")
      : view === "product"
        ? detail(id)
        : view === "cart"
          ? cartView()
          : view === "wishlist"
            ? grid(
                "Saved by you",
                "A personal edit worth returning to.",
                products.filter((p) => wish.includes(p.id)),
              )
            : view === "compare"
              ? standard(
                  "Compare",
                  `<div class="compare">${products
                    .slice(0, 3)
                    .map(
                      (p) =>
                        `<div class="panel"><img src="${p.img}"><h3>${p.n}</h3><p class="price">${money(p.p)}</p><p class="muted">${p.r} ★ · ${p.stock} in stock</p></div>`,
                    )
                    .join("")}</div>`,
                )
              : view === "checkout"
                ? standard(
                    "Checkout",
                    `<h2>Secure by design.</h2><p class="muted">Payment is ready for Stripe integration. This demo confirms the order safely.</p><button class="primary" id="place">Place demo order →</button>`,
                  )
                : view === "orders"
                  ? standard(
                      "Orders",
                      orders.length
                        ? orders
                            .map(
                              (o) =>
                                `<div class="order-row"><b>${o.id}</b><span class="muted">Confirmed · Preparing shipment</span><span class="price">${money(o.t)}</span></div>`,
                            )
                            .join("")
                        : '<p class="muted">No orders yet. Your future orders will be tracked here.</p>',
                    )
                  : view === "account"
                    ? standard(
                        "Account",
                        '<h2>Welcome back, Rana.</h2><p class="muted">Saved addresses, payment methods, membership perks and personal recommendations live here.</p>',
                      )
                    : view === "support"
                      ? standard(
                          "Support",
                          '<h2>Always here.</h2><p class="muted">Track orders, start a return, or connect with the NOVA concierge.</p><button class="primary">Start a conversation →</button>',
                        )
                      : view === "admin"
                        ? dashboard()
                        : home();
  app.innerHTML = out;
  attach();
  bindPage();
}
function bindPage() {
  let s = $("#search"),
    r = $("#results");
  if (s) {
    $("#searchGo").onclick = () => go(s.value);
    s.onkeydown = (e) => e.key === "Enter" && go(s.value);
    document.querySelectorAll("[data-filter]").forEach(
      (b) =>
        (b.onclick = () => {
          document
            .querySelectorAll(".filter")
            .forEach((x) => x.classList.remove("active"));
          b.classList.add("active");
          r.innerHTML = products
            .filter(
              (p) => b.dataset.filter === "All" || p.c === b.dataset.filter,
            )
            .map(card)
            .join("");
          attach();
        }),
    );
  }
  document.querySelectorAll("[data-remove]").forEach(
    (b) =>
      (b.onclick = () => {
        cart = cart.filter((x) => x.id !== +b.dataset.remove);
        save();
        route();
      }),
  );
  $("#place")?.addEventListener("click", () => {
    if (!cart.length) return toast("Your bag is empty");
    let t = cart.reduce(
      (a, x) => a + products.find((p) => p.id === x.id).p * x.q,
      0,
    );
    orders.unshift({ id: "NOVA-" + Date.now().toString().slice(-6), t });
    cart = [];
    save();
    toast("Order confirmed — tracking is now live");
    location.hash = "orders";
  });
  $("#adminForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    products.unshift({
      id: Date.now(),
      n: $("#pn").value,
      c: $("#pc").value,
      p: +$("#pp").value,
      img: $("#pi").value,
      r: 4.8,
      stock: 10,
      tag: "NEW",
      d: "A new NOVA marketplace product.",
    });
    toast("Product published to every marketplace view");
    e.target.reset();
    route();
  });
}
function go(q) {
  let r = $("#results"),
    x = q.toLowerCase();
  r.innerHTML =
    products
      .filter((p) => (p.n + p.c + p.d).toLowerCase().includes(x))
      .map(card)
      .join("") ||
    '<p class="muted">No exact match. Try NOVA AI for a smarter edit.</p>';
  attach();
}
$("#searchButton").onclick = () => (location.hash = "shop");
$("#menu").onclick = () => $("#nav").classList.toggle("open");
$("#assistant [data-close]").onclick = () => $("#assistant").close();
$("#aiForm").onsubmit = (e) => {
  e.preventDefault();
  ai($("#aiInput").value);
};
document.querySelectorAll("[data-prompt]").forEach(
  (b) =>
    (b.onclick = () => {
      $("#aiInput").value = b.dataset.prompt;
      ai(b.dataset.prompt);
    }),
);
function ai(q) {
  let l = q.toLowerCase(),
    max = l.match(/(?:under|below)\s*(?:egp)?\s*([\d,]+)(k)?/) || [],
    budget = max[1] ? +max[1].replace(",", "") * (max[2] ? 1000 : 1) : Infinity,
    pick = l.includes("wedding")
      ? products.filter((p) => p.c === "Fashion" && p.p <= budget)
      : l.includes("laptop") || l.includes("program")
        ? products.filter((p) => p.c === "Tech" && p.p <= budget)
        : products.filter((p) => p.p <= budget).slice(0, 3);
  $("#aiResult").innerHTML =
    `<p class="kicker">NOVA FOUND ${pick.length} MATCHES / UNDER ${money(budget === Infinity ? 0 : budget)}</p>${pick.map((p) => `<div class="recommendation"><img src="${p.img}"><div><b>${p.n}</b><br><span class="price">${money(p.p)}</span><br><small class="muted">${p.d}</small></div><button class="secondary" onclick="location.hash='#product/${p.id}';document.querySelector('#assistant').close()">View</button></div>`).join("") || '<p class="muted">Try broadening the brief or budget.</p>'}`;
}
window.addEventListener("hashchange", route);
save();
route();
