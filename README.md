# NOVA Marketplace

A futuristic client-demo e-commerce application. Open `index.html` in a browser.

## Included application flows

- Home, Shop, Categories, New Arrivals, Trending, Collections, Product, Compare, Wishlist, Cart, Checkout, Orders, Account, Support, and Admin Dashboard routes.
- Local AI shopping assistant that understands budget-led wedding outfit and programming laptop requests.
- Product search, category filters, recommendations, reviews, cart, wishlist, order tracking, inventory, payment-ready checkout messaging, and product publishing through the Admin Dashboard.

## Demo implementation note

Data persists in the browser using localStorage so the store can be demonstrated without a server. Checkout is intentionally simulated: to go live, connect the checkout action to Stripe Checkout or Payment Intents through a secure backend, never from browser-only code.


## Account, Wishlist & Themes
- Sign in / Create account modal with local demo authentication.
- Wishlist controls on product cards and product details, persisted in localStorage.
- Dark/light theme toggle persisted in localStorage.
- For production, replace the local demo auth with a real provider such as Supabase Auth or Firebase Auth.
