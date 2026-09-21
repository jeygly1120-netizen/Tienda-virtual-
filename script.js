const products=[
 {id:1,name:"Smartphone Pro",cat:"Tecnología",price:1299,emoji:"📱",badge:"NUEVO"},
 {id:2,name:"Audífonos Air",cat:"Tecnología",price:149,emoji:"🎧",badge:"OFERTA"},
 {id:3,name:"Zapatillas Urban",cat:"Moda",price:189,emoji:"👟",badge:"POPULAR"},
 {id:4,name:"Bolso Elegante",cat:"Moda",price:129,emoji:"👜"},
 {id:5,name:"Reloj Premium",cat:"Accesorios",price:249,emoji:"⌚"},
 {id:6,name:"Lámpara LED",cat:"Hogar",price:89,emoji:"💡"},
 {id:7,name:"Set de Belleza",cat:"Belleza",price:119,emoji:"💄"},
 {id:8,name:"Cámara Compacta",cat:"Tecnología",price:599,emoji:"📷"}
];
const categories=[["Todos","✨"],["Tecnología","📱"],["Moda","👟"],["Accesorios","⌚"],["Hogar","🏠"],["Belleza","💄"]];
let cart=JSON.parse(localStorage.getItem("jeyglyCart")||"[]");
let cfg=JSON.parse(localStorage.getItem("jeyglyConfig")||"null")||{name:"Jeygly Store",tagline:"Tu tienda, tu estilo",whatsapp:"",currency:"S/",color:"#6c4df6",accent:"#ff4f8b"};
let currentCat="Todos";

const $=s=>document.querySelector(s);
function money(n){return `${cfg.currency} ${n.toFixed(2)}`}
function save(){localStorage.setItem("jeyglyCart",JSON.stringify(cart))}
function renderCategories(){
 $("#categoryList").innerHTML=categories.map(([name,emoji])=>`<button class="category ${name===currentCat?"active":""}" onclick="selectCat('${name}')"><span class="emoji">${emoji}</span><b>${name}</b><small>${name==="Todos"?products.length:products.filter(p=>p.cat===name).length} productos</small></button>`).join("");
}
function renderProducts(){
 const q=$("#searchInput").value.toLowerCase();
 const list=products.filter(p=>(currentCat==="Todos"||p.cat===currentCat)&&p.name.toLowerCase().includes(q));
 $("#productGrid").innerHTML=list.length?list.map(p=>`<article class="product">
 <div class="product-img">${p.badge?`<span class="badge">${p.badge}</span>`:""}<span>${p.emoji}</span></div>
 <div class="product-body"><small>${p.cat}</small><h3>${p.name}</h3><div class="price">${money(p.price)}</div><button class="add-btn" onclick="addToCart(${p.id})">＋ Agregar al carrito</button></div>
 </article>`).join(""):`<p>No encontramos productos.</p>`;
}
function selectCat(cat){currentCat=cat;renderCategories();renderProducts();document.querySelector("#productos").scrollIntoView({behavior:"smooth"})}
function addToCart(id){const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});save();renderCart();toast("Producto agregado al carrito ✨")}
function changeQty(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save();renderCart()}
function renderCart(){
 let total=0,count=0;
 $("#cartItems").innerHTML=cart.length?cart.map(i=>{const p=products.find(x=>x.id===i.id);total+=p.price*i.qty;count+=i.qty;return `<div class="cart-row"><div class="cart-thumb">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)} · ${p.cat}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${i.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><b>${money(p.price*i.qty)}</b></div>`}).join(""):`<p style="color:#777;text-align:center;padding:50px 0">Tu carrito está vacío 🛒</p>`;
 $("#cartTotal").textContent=money(total);$("#cartCount").textContent=count;
}
function open(id){$(id).classList.add("open")} function close(id){$(id).classList.remove("open")}
function toast(msg){const t=document.createElement("div");t.textContent=msg;t.style="position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:#171329;color:#fff;padding:13px 18px;border-radius:12px;z-index:100;font-weight:700";document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
function applyConfig(){
 document.documentElement.style.setProperty("--primary",cfg.color);document.documentElement.style.setProperty("--accent",cfg.accent);
 $("#storeName").textContent=cfg.name;$("#storeTagline").textContent=cfg.tagline;$("#footerName").textContent=cfg.name;
 $("#footerWhatsapp").textContent=cfg.whatsapp||"Configura tu número";document.title=cfg.name;$("#cfgName").value=cfg.name;$("#cfgTagline").value=cfg.tagline;$("#cfgWhatsapp").value=cfg.whatsapp;$("#cfgCurrency").value=cfg.currency;$("#cfgColor").value=cfg.color;$("#cfgAccent").value=cfg.accent;
}
$("#searchInput").addEventListener("input",renderProducts);
$("#cartBtn").onclick=()=>open("#cartOverlay");$("#promoCartBtn").onclick=()=>open("#cartOverlay");$("#customizeBtn").onclick=()=>open("#customOverlay");
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>close("#"+b.dataset.close));
$("#clearCartBtn").onclick=()=>{cart=[];save();renderCart()};
$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("jeyglyDark",document.body.classList.contains("dark"))};
$("#saveConfigBtn").onclick=()=>{cfg={name:$("#cfgName").value||"Jeygly Store",tagline:$("#cfgTagline").value||"Tu tienda, tu estilo",whatsapp:$("#cfgWhatsapp").value.replace(/\D/g,""),currency:$("#cfgCurrency").value||"S/",color:$("#cfgColor").value,accent:$("#cfgAccent").value};localStorage.setItem("jeyglyConfig",JSON.stringify(cfg));applyConfig();close("#customOverlay");toast("Tienda actualizada ✨")};
$("#resetBtn").onclick=()=>{localStorage.removeItem("jeyglyConfig");location.reload()};
$("#whatsappBtn").onclick=()=>{
 if(!cart.length)return toast("Agrega productos primero");
 if(!cfg.whatsapp)return open("#customOverlay");
 let msg=`Hola, quiero hacer este pedido en ${cfg.name}:%0A%0A`;
 cart.forEach(i=>{const p=products.find(x=>x.id===i.id);msg+=`• ${p.name} x${i.qty} = ${money(p.price*i.qty)}%0A`});
 let total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
 msg+=`%0ATotal: ${money(total)}`;
 window.open(`https://wa.me/${cfg.whatsapp}?text=${msg}`,"_blank");
};
document.body.classList.toggle("dark",localStorage.getItem("jeyglyDark")==="true");
$("#year").textContent=new Date().getFullYear();applyConfig();renderCategories();renderProducts();renderCart();