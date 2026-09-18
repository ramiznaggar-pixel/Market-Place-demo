export const catalog = [
  {
    id: 1,
    n: "Aster Silk Slip Dress",
    c: "Fashion",
    p: 2890,
    r: 4.9,
    stock: 8,
    img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 2,
    n: "Solace Heel",
    c: "Fashion",
    p: 1490,
    r: 4.8,
    stock: 14,
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    n: "Mira Clutch",
    c: "Fashion",
    p: 890,
    r: 4.7,
    stock: 12,
    img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 4,
    n: "NOVA Code 14",
    c: "Tech",
    p: 42990,
    r: 4.9,
    stock: 5,
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    n: "Echo ANC Headphones",
    c: "Tech",
    p: 6790,
    r: 4.8,
    stock: 18,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    n: "Halo Desk Lamp",
    c: "Home",
    p: 1250,
    r: 4.6,
    stock: 20,
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85",
  },
];

export const money = (n) => `EGP ${Number(n).toLocaleString("en-EG")}`;

export class Store {
  constructor(key, initial = []) {
    this.key = key;
    this.value = JSON.parse(localStorage[key] || JSON.stringify(initial));
  }
  save() {
    localStorage[this.key] = JSON.stringify(this.value);
    window.dispatchEvent(new Event("nova:update"));
  }
  get() {
    return this.value;
  }
}
export class Basket extends Store {
  constructor() {
    super("novaBasket", []);
  }
  add(id) {
    let row = this.value.find((x) => x.id === id),
      p = catalog.find((x) => x.id === id);
    if (!p) return;
    if (row) row.q = Math.min(row.q + 1, p.stock);
    else this.value.push({ id, q: 1 });
    this.save();
  }
  remove(id) {
    this.value = this.value.filter((x) => x.id !== id);
    this.save();
  }
  get total() {
    return this.value.reduce(
      (s, x) => s + catalog.find((p) => p.id === x.id).p * x.q,
      0,
    );
  }
  get count() {
    return this.value.reduce((s, x) => s + x.q, 0);
  }
}
export class Wishlist extends Store {
  constructor() {
    super("novaWishlist", []);
  }
  toggle(id) {
    this.value = this.value.includes(id)
      ? this.value.filter((x) => x !== id)
      : [...this.value, id];
    this.save();
    return this.value.includes(id);
  }
}
export class Assistant {
  recommend(query) {
    let q = query.toLowerCase(),
      budget = q.match(/(?:under|below)\s*(?:egp)?\s*([\d,]+)(k)?/) || [];
    let max = budget[1]
      ? Number(budget[1].replace(",", "")) * (budget[2] ? 1000 : 1)
      : Infinity;
    let items = q.includes("wedding")
      ? catalog.filter((p) => p.c === "Fashion" && p.p <= max)
      : q.includes("laptop") || q.includes("program")
        ? catalog.filter((p) => p.c === "Tech" && p.p <= max)
        : catalog.filter((p) => p.p <= max).slice(0, 3);
    return {
      items,
      reply: items.length
        ? `I found ${items.length} strong matches${max < Infinity ? ` under ${money(max)}` : ""}.`
        : "I could not find a close match. Try a broader budget or category.",
    };
  }
}

function isPage() {
  return location.pathname.includes("/pages/");
}
function productHref(id) {
  return isPage() ? `product.html?id=${id}` : `pages/product.html?id=${id}`;
}

export class UI {
  static header() {
    return `<div class="ticker">NOVA OS / FREE DELIVERY OVER EGP 1,500 / AI-POWERED SHOPPING</div>
<header>
  <a class="brand" href="../index.html" aria-label="NOVA Marketplace home">N<span>O</span>VA<small>MARKETPLACE</small></a>
  <nav aria-label="Main navigation">
    <a href="../index.html">Home</a>
    <div class="drop">
      <button type="button" aria-expanded="false" aria-haspopup="true">Explore ▾</button>
      <div class="drop-menu">
        <a href="shop.html">Shop all</a><a href="categories.html">Categories</a><a href="new.html">New arrivals</a><a href="trending.html">Trending</a><a href="collections.html">Collections</a>
      </div>
    </div>
    <div class="drop">
      <button type="button" aria-expanded="false" aria-haspopup="true">My NOVA ▾</button>
      <div class="drop-menu">
        <a href="wishlist.html">Wishlist</a><a href="orders.html">Orders</a><a href="account.html">Account</a><a href="support.html">Support</a>
      </div>
    </div>
    <a href="admin.html">Admin</a>
  </nav>
  <div class="head-actions">
    <button id="themeToggle" type="button" aria-label="Switch to light theme" title="Switch theme">☀</button>
    <button id="openChat" type="button" aria-label="Open NOVA AI assistant">AI ✦</button>
    <a href="wishlist.html" aria-label="Open wishlist">♡ <i id="wishCount">0</i></a>
    <button class="account-button" id="accountLink" type="button" aria-haspopup="dialog">Sign in / Sign up</button>
    <a href="cart.html" aria-label="Open shopping bag">Bag <i id="cartCount">0</i></a>
  </div>
</header>`;
  }
  static product(p) {
    let saved = new Wishlist().get().includes(p.id);
    return `<article class="product">
      <a href="${productHref(p.id)}"><img src="${p.img}" alt="${p.n}"><span class="tag">${p.tag || "NOVA EDIT"}</span></a>
      <button class="heart ${saved ? "saved" : ""}" data-wish="${p.id}" aria-label="${saved ? "Remove " + p.n + " from wishlist" : "Add " + p.n + " to wishlist"}" aria-pressed="${saved}">${saved ? "♥" : "♡"}</button>
      <div class="product-info"><small>${p.c} · ${p.r} ★ · ${p.stock} left</small><h3><a href="${productHref(p.id)}">${p.n}</a></h3><span class="price">${money(p.p)}</span></div>
      <button class="quick" data-add="${p.id}" aria-label="Add ${p.n} to basket">+</button>
    </article>`;
  }
  static chat() {
    return `<aside class="chatbot" id="chatbot" hidden aria-label="NOVA AI assistant">
      <div class="chat-head">NOVA ASSISTANT <button id="closeChat" type="button" aria-label="Close AI assistant">×</button></div>
      <div id="chatLog" class="chat-log"><p><b>NOVA</b> Hi. Tell me what you need and your budget.</p></div>
      <form id="chatForm"><input id="chatInput" aria-label="Ask NOVA AI" placeholder="Find a laptop under EGP 50k"><button type="submit">Send</button></form>
    </aside>`;
  }
  static auth() {
    return `<dialog id="authDialog" class="auth-dialog" aria-labelledby="authTitle">
      <button class="close" id="closeAuth" type="button" aria-label="Close sign in dialog">×</button>
      <p class="kicker">NOVA ACCOUNT</p>
      <h2 id="authTitle">Welcome to <em>NOVA.</em></h2>
      <div class="auth-tabs" role="tablist" aria-label="Account access">
        <button type="button" class="auth-tab active" data-auth-tab="signin" role="tab" aria-selected="true">Sign in</button>
        <button type="button" class="auth-tab" data-auth-tab="signup" role="tab" aria-selected="false">Create account</button>
      </div>
      <form id="signInForm" class="auth-form">
        <label>Email<input id="signinEmail" type="email" autocomplete="email" required></label>
        <label>Password<input id="signinPassword" type="password" autocomplete="current-password" required></label>
        <button class="primary" type="submit">Sign in →</button>
      </form>
      <form id="signUpForm" class="auth-form" hidden>
        <label>Full name<input id="signupName" type="text" autocomplete="name" required></label>
        <label>Email<input id="signupEmail" type="email" autocomplete="email" required></label>
        <label>Password<input id="signupPassword" type="password" autocomplete="new-password" minlength="6" required></label>
        <button class="primary" type="submit">Create account →</button>
      </form>
      <p id="authMessage" class="auth-message" role="status" aria-live="polite"></p>
      <p class="muted auth-note">Demo authentication is stored locally in this browser. Connect a real auth provider before production.</p>
    </dialog>`;
  }
}

function setTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  localStorage.novaTheme = theme;
  let btn = document.querySelector("#themeToggle");
  if (btn) {
    let light = theme === "light";
    btn.textContent = light ? "☾" : "☀";
    btn.setAttribute(
      "aria-label",
      light ? "Switch to dark theme" : "Switch to light theme",
    );
    btn.title = light ? "Switch to dark theme" : "Switch to light theme";
  }
}

function setupAuth() {
  const dialog = document.querySelector("#authDialog");
  if (!dialog) return;
  const account = document.querySelector("#accountLink"),
    msg = document.querySelector("#authMessage");
  const refresh = () => {
    const user = JSON.parse(localStorage.novaUser || "null");
    account.textContent = user
      ? `Hi, ${user.name.split(" ")[0]}`
      : "Sign in / Sign up";
  };
  account.addEventListener("click", () => {
    msg.textContent = "";
    dialog.showModal();
  });
  document
    .querySelector("#closeAuth")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  document.querySelectorAll("[data-auth-tab]").forEach((tab) =>
    tab.addEventListener("click", () => {
      const signIn = tab.dataset.authTab === "signin";
      document.querySelectorAll("[data-auth-tab]").forEach((x) => {
        x.classList.toggle("active", x === tab);
        x.setAttribute("aria-selected", x === tab ? "true" : "false");
      });
      document.querySelector("#signInForm").hidden = !signIn;
      document.querySelector("#signUpForm").hidden = signIn;
      document.querySelector("#authTitle").innerHTML = signIn
        ? "Welcome to <em>NOVA.</em>"
        : "Create your <em>NOVA</em> account.";
      msg.textContent = "";
    }),
  );
  document.querySelector("#signUpForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const user = {
      name: document.querySelector("#signupName").value.trim(),
      email: document.querySelector("#signupEmail").value.trim().toLowerCase(),
      password: document.querySelector("#signupPassword").value,
    };
    localStorage.novaUser = JSON.stringify(user);
    msg.textContent = "Account created. You are now signed in.";
    refresh();
    setTimeout(() => dialog.close(), 700);
  });
  document.querySelector("#signInForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.novaUser || "null");
    const email = document
        .querySelector("#signinEmail")
        .value.trim()
        .toLowerCase(),
      pass = document.querySelector("#signinPassword").value;
    if (!saved) {
      msg.textContent =
        "No account found in this browser. Create an account first.";
      return;
    }
    if (saved.email !== email || saved.password !== pass) {
      msg.textContent = "Email or password does not match.";
      return;
    }
    msg.textContent = `Welcome back, ${saved.name.split(" ")[0]}.`;
    refresh();
    setTimeout(() => dialog.close(), 700);
  });
  refresh();
}

export function boot() {
  document.body.insertAdjacentHTML("afterbegin", UI.header());
  document.body.insertAdjacentHTML("beforeend", UI.chat() + UI.auth());
  let b = new Basket(),
    w = new Wishlist();
  const refresh = () => {
    document.querySelector("#cartCount").textContent = b.count;
    document.querySelector("#wishCount").textContent = w.get().length;
    const user = JSON.parse(localStorage.novaUser || "null");
    document.querySelector("#accountLink").textContent = user
      ? `Hi, ${user.name.split(" ")[0]}`
      : "Sign in / Sign up";
  };
  setTheme(localStorage.novaTheme || "dark");
  refresh();
  window.addEventListener("nova:update", refresh);

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      b.add(+add.dataset.add);
      alert("Added to your basket");
      return;
    }
    const wishBtn = e.target.closest("[data-wish]");
    if (wishBtn) {
      let active = w.toggle(+wishBtn.dataset.wish);
      wishBtn.textContent = active ? "♥" : "♡";
      wishBtn.classList.toggle("saved", active);
      wishBtn.setAttribute("aria-pressed", active);
      wishBtn.setAttribute(
        "aria-label",
        active ? "Remove from wishlist" : "Add to wishlist",
      );
      refresh();
      alert(active ? "Saved to your wishlist" : "Removed from wishlist");
      return;
    }
    if (e.target.closest("#themeToggle")) {
      setTheme(document.body.classList.contains("light") ? "dark" : "light");
      return;
    }
    if (e.target.closest("#openChat")) {
      document.querySelector("#chatbot").hidden = false;
      document.querySelector("#chatInput")?.focus();
      return;
    }
    if (e.target.closest("#closeChat")) {
      document.querySelector("#chatbot").hidden = true;
      return;
    }
  });

  document.querySelectorAll(".drop > button").forEach((btn) =>
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      document
        .querySelectorAll(".drop > button")
        .forEach((x) => x.setAttribute("aria-expanded", "false"));
      btn.setAttribute("aria-expanded", String(!open));
    }),
  );
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".drop"))
      document
        .querySelectorAll(".drop > button")
        .forEach((x) => x.setAttribute("aria-expanded", "false"));
  });

  document.querySelector("#chatForm").onsubmit = (e) => {
    e.preventDefault();
    let q = document.querySelector("#chatInput").value.trim();
    if (!q) return;
    let a = new Assistant().recommend(q),
      log = document.querySelector("#chatLog");
    log.insertAdjacentHTML(
      "beforeend",
      `<p class="user">${q.replace(/</g, "&lt;")}</p><p><b>NOVA</b> ${a.reply}</p>${a.items.map((p) => `<p><a href="${productHref(p.id)}">${p.n} — ${money(p.p)}</a></p>`).join("")}`,
    );
    e.target.reset();
    log.scrollTop = log.scrollHeight;
  };
  setupAuth();
  return b;
}
