// MƏHSULLARI BURADA DƏYİŞ
const products = [
    { id: 1, name: "iPhone 13 Kabro Şəffaf", price: 12, image: "https://m.media-amazon.com/images/I/61M5w+2+ZEL.jpg", desc: "Saralmayan material." },
    { id: 2, name: "Samsung S22 Ultra Black", price: 15, image: "https://m.media-amazon.com/images/I/71J8-sM-kRL.jpg", desc: "Qara mat rəng." },
    { id: 3, name: "AirPods Pro Case", price: 9, image: "https://m.media-amazon.com/images/I/61s-t+vJvJL.jpg", desc: "Rəngli qutu." }
];

const cartKey = 'kabro_cart_v2';
function getCart() { return JSON.parse(localStorage.getItem(cartKey)) || []; }
function saveCart(c) { localStorage.setItem(cartKey, JSON.stringify(c)); }
function formatPrice(p) { return parseFloat(p).toFixed(2) + ' ₼'; }

function updateBadge() {
    const b = document.getElementById('cart-badge');
    if(b) b.innerText = getCart().reduce((a,i)=>a+i.qty,0);
}

// Məhsulları Yüklə
const list = document.getElementById('product-list');
if(list) {
    list.innerHTML = products.map(p => `
        <div class="card" onclick="location.href='product.html?id=${p.id}'">
            <img src="${p.image}" class="card-img">
            <div class="card-body">
                <div class="card-title">${p.name}</div>
                <div class="card-price">${formatPrice(p.price)}</div>
            </div>
        </div>`).join('');
}

// Detal Səhifəsi
const detailImg = document.getElementById('detail-img');
if(detailImg) {
    const id = new URLSearchParams(location.search).get('id');
    const p = products.find(x => x.id == id);
    if(p) {
        detailImg.src = p.image;
        document.getElementById('detail-title').innerText = p.name;
        document.getElementById('detail-price').innerText = formatPrice(p.price);
        document.getElementById('detail-desc').innerText = p.desc;
        document.getElementById('add-to-cart').onclick = () => {
            let c = getCart();
            let ex = c.find(x=>x.id==p.id);
            if(ex) ex.qty++; else c.push({...p, qty:1});
            saveCart(c); updateBadge(); alert('Səbətə atıldı');
        };
    }
}

// Səbət və INSTAGRAM LOGIC
const cartDiv = document.getElementById('cart-items');
if(cartDiv) {
    const cart = getCart();
    if(cart.length) {
        let total = 0;
        cartDiv.innerHTML = cart.map((i,x) => {
            total += i.price*i.qty;
            return `<div class="cart-item">
                <div>${i.name} <br><small>${i.qty} x ${i.price}₼</small></div>
                <b onclick="rem(${x})" style="color:red;cursor:pointer">X</b>
            </div>`;
        }).join('');
        document.getElementById('cart-total').innerText = formatPrice(total);

        document.getElementById('checkout-btn').onclick = () => {
            // 1. Sifariş mətnini hazırlayırıq
            let msg = "Salam, Kabroshop sifarişim var:\n";
            cart.forEach(i => msg += `- ${i.name} (${i.qty} ədəd)\n`);
            msg += `\nCəm: ${formatPrice(total)}`;

            // 2. Mətni telefonda kopyalayırıq
            navigator.clipboard.writeText(msg).then(() => {
                alert("✅ Sifariş kopyalandı! İndi açılan Instagram səhifəsində yapışdırın (Paste).");
                // 3. Instagram DM-i açırıq
                window.location.href = "https://ig.me/m/kabroshopbaku"; 
            }).catch(() => {
                alert("Xəta oldu, xahiş edirik əllə yazın.");
                window.location.href = "https://ig.me/m/kabroshopbaku";
            });
        };
    } else {
        cartDiv.innerHTML = "<p>Səbət boşdur</p>";
        document.getElementById('checkout-btn').style.display = 'none';
    }
}
function rem(i){ let c=getCart(); c.splice(i,1); saveCart(c); location.reload(); }
updateBadge();
