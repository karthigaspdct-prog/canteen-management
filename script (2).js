// ============ EDIT THESE SETTINGS ============
const SHOP_NAME = "ABC Masala & Pickles";
// Shop owner's WhatsApp number with country code, digits only. Example: "919876543210"
// Leave empty ("") to let the customer choose the contact while sending.
const SHOP_WHATSAPP = "";

// Products. Change names, prices and sizes here. The prices below are SAMPLE prices.
const PRODUCTS = [
  { id: "malt", cat: "Malt", icon: "🥛", name: "ABC Malt", ta: "ஏபிசி மால்ட்", desc: "Healthy malt drink mix for the whole family.",
    sizes: [{ label: "200 g", price: 120 }, { label: "500 g", price: 270 }] },
  { id: "fishk", cat: "Masala Powders", icon: "🌶️", name: "Fish Kulambu Masala Powder", ta: "மீன் குழம்பு மசாலா", desc: "Ground fresh for a rich, tangy fish kulambu.",
    sizes: [{ label: "100 g", price: 70 }, { label: "250 g", price: 160 }] },
  { id: "fishf", cat: "Masala Powders", icon: "🐟", name: "Fish Fry Masala", ta: "மீன் வறுவல் மசாலா", desc: "Crispy, spicy fish fry coating masala.",
    sizes: [{ label: "100 g", price: 70 }, { label: "250 g", price: 160 }] },
  { id: "chick", cat: "Masala Powders", icon: "🍗", name: "Chicken Masala", ta: "சிக்கன் மசாலா", desc: "Perfect blend for chicken curry and fry.",
    sizes: [{ label: "100 g", price: 65 }, { label: "250 g", price: 150 }] },
  { id: "mutton", cat: "Masala Powders", icon: "🍖", name: "Mutton Masala", ta: "மட்டன் மசாலா", desc: "Bold masala for mutton curry and biryani.",
    sizes: [{ label: "100 g", price: 80 }, { label: "250 g", price: 185 }] },
  { id: "turmeric", cat: "Masala Powders", icon: "🟡", name: "Turmeric Powder", ta: "மஞ்சள் தூள்", desc: "Pure, bright turmeric powder for everyday cooking.",
    sizes: [{ label: "100 g", price: 45 }, { label: "250 g", price: 100 }, { label: "500 g", price: 190 }] },
  { id: "mango", cat: "Pickles", icon: "🥭", name: "Mango Pickle", ta: "மாங்காய் ஊறுகாய்", desc: "Traditional raw mango pickle in gingelly oil.",
    sizes: [{ label: "250 g", price: 110 }, { label: "500 g", price: 210 }] },
  { id: "lemon", cat: "Pickles", icon: "🍋", name: "Lemon Pickle", ta: "எலுமிச்சை ஊறுகாய்", desc: "Tangy and spicy lemon pickle.",
    sizes: [{ label: "250 g", price: 100 }, { label: "500 g", price: 190 }] },
  { id: "garlic", cat: "Pickles", icon: "🧄", name: "Garlic Pickle", ta: "பூண்டு ஊறுகாய்", desc: "Strong flavoured garlic pickle.",
    sizes: [{ label: "250 g", price: 130 }, { label: "500 g", price: 250 }] },
  { id: "tomato", cat: "Pickles", icon: "🍅", name: "Tomato Pickle", ta: "தக்காளி ஊறுகாய்", desc: "Sweet, sour and spicy tomato pickle.",
    sizes: [{ label: "250 g", price: 100 }, { label: "500 g", price: 190 }] },
];
// =============================================

const CART_KEY = "shop_cart";
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } };
const saveCart = (c) => { try { localStorage.setItem(CART_KEY, JSON.stringify(c)); } catch (e) {} };

let cart = loadCart();
let category = "All";

document.title = SHOP_NAME;
$("shopName").textContent = SHOP_NAME;

// ---------- Products ----------
function renderCats() {
  const cats = ["All", ...new Set(PRODUCTS.map((p) => p.cat))];
  $("cats").innerHTML = cats.map((c) => `<button class="cat ${c === category ? "active" : ""}" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
}

function renderProducts() {
  const q = $("search").value.trim().toLowerCase();
  const list = PRODUCTS.filter((p) => (category === "All" || p.cat === category) &&
    (p.name.toLowerCase().includes(q) || p.ta.includes(q)));
  $("noItems").hidden = list.length > 0;
  $("products").innerHTML = list.map((p) => `<div class="card">
    <div class="pic ${p.cat === "Malt" ? "malt" : p.cat === "Pickles" ? "pickle" : "masala"}">${p.icon}</div>
    <div class="info">
      <h4>${esc(p.name)}</h4>
      <span class="ta">${esc(p.ta)}</span>
      <p class="desc">${esc(p.desc)}</p>
      <select data-size="${p.id}">${p.sizes.map((s, i) => `<option value="${i}">${esc(s.label)} - ₹${s.price}</option>`).join("")}</select>
      <button class="add" data-add="${p.id}">Add to Cart</button>
    </div>
  </div>`).join("");
}

$("cats").addEventListener("click", (e) => {
  if (!e.target.dataset.cat) return;
  category = e.target.dataset.cat; renderCats(); renderProducts();
});
$("search").addEventListener("input", renderProducts);

$("products").addEventListener("click", (e) => {
  const id = e.target.dataset.add;
  if (!id) return;
  const p = PRODUCTS.find((x) => x.id === id);
  const idx = parseInt(document.querySelector(`[data-size="${id}"]`).value, 10);
  const size = p.sizes[idx], key = id + "|" + idx;
  const line = cart.find((c) => c.key === key);
  if (line) line.qty++;
  else cart.push({ key, name: p.name, size: size.label, price: size.price, qty: 1 });
  saveCart(cart); renderCart();
  $("msg").textContent = p.name + " added to cart.";
});

// ---------- Cart ----------
const total = () => cart.reduce((s, c) => s + c.price * c.qty, 0);

function renderCart() {
  $("cartCount").textContent = cart.reduce((s, c) => s + c.qty, 0);
  $("cartTotal").textContent = "₹" + total();
  $("orderBtn").disabled = cart.length === 0;
  $("cartList").innerHTML = cart.length
    ? cart.map((c) => `<div class="line">
        <div class="top"><span>${esc(c.name)} (${esc(c.size)})</span><strong>₹${c.price * c.qty}</strong></div>
        <div class="qty"><button data-minus="${esc(c.key)}">−</button><span>${c.qty}</span><button data-plus="${esc(c.key)}">+</button>
        <button class="rm" data-rm="${esc(c.key)}">Remove</button></div></div>`).join("")
    : '<p class="muted">Your cart is empty.</p>';
}

$("cartList").addEventListener("click", (e) => {
  const d = e.target.dataset;
  const key = d.plus || d.minus || d.rm;
  if (!key) return;
  const line = cart.find((c) => c.key === key);
  if (!line) return;
  if (d.plus) line.qty++;
  else if (d.minus) line.qty--;
  else line.qty = 0;
  cart = cart.filter((c) => c.qty > 0);
  saveCart(cart); renderCart();
});

$("clearBtn").addEventListener("click", () => { cart = []; saveCart(cart); renderCart(); $("msg").textContent = ""; });

function orderText() {
  const lines = cart.map((c, i) => `${i + 1}. ${c.name} (${c.size}) x ${c.qty} = ₹${c.price * c.qty}`);
  return `🛒 New Order - ${SHOP_NAME}\n\nName: ${$("cName").value.trim()}\nPhone: ${$("cPhone").value.trim()}\nAddress: ${$("cAddr").value.trim()}\n\nItems:\n${lines.join("\n")}\n\nTotal: ₹${total()}`;
}

$("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!cart.length) return;
  const base = SHOP_WHATSAPP ? `https://wa.me/${SHOP_WHATSAPP}` : "https://wa.me/";
  window.open(`${base}?text=${encodeURIComponent(orderText())}`, "_blank", "noopener");
  $("msg").textContent = "WhatsApp opened. Please tap Send to place your order.";
});

$("copyBtn").addEventListener("click", async () => {
  if (!cart.length) { $("msg").textContent = "Add items to the cart first."; return; }
  if (!$("orderForm").reportValidity()) return;
  try { await navigator.clipboard.writeText(orderText()); $("msg").textContent = "Order copied. Paste it in WhatsApp or SMS."; }
  catch (e) { $("msg").textContent = "Could not copy. Use the WhatsApp button."; }
});

renderCats(); renderProducts(); renderCart();
