// Funcionalidades principais do e-commerce Pele Sensual Moda Íntima

// Carrinho de compras
let cart = {
  items: [],
  total: 0,
  totalQuantity: 0,

  RETAIL_INCREMENT: 4.00,
  WHOLESALE_INCREMENT: 1.00,
  MIN_WHOLESALE_ITEM_QUANTITY: 10,
  INITIAL_WHOLESALE_ITEM_QUANTITY: 10,
  STEP_WHOLESALE_ITEM_QUANTITY: 10,
  MIN_WHOLESALE_TOTAL_QUANTITY: 200,

  getAdjustedPrice: function(basePrice) {
    const isWholesale = document.body.classList.contains("wholesale-mode");
    if (isWholesale) {
      return parseFloat(basePrice) + this.WHOLESALE_INCREMENT;
    } else {
      return parseFloat(basePrice) + this.RETAIL_INCREMENT;
    }
  },

  addItem: function(id, name, basePrice, size, image, quantity) {
    const price = this.getAdjustedPrice(basePrice);
    const existingItemIndex = this.items.findIndex(item => item.id === id && item.size === size);
    const isWholesale = document.body.classList.contains("wholesale-mode");
    let validatedQuantity = parseInt(quantity);

    // Safeguard validation, though pre-validation should occur before calling addItem
    if (isWholesale) {
        if (isNaN(validatedQuantity) || validatedQuantity < this.MIN_WHOLESALE_ITEM_QUANTITY) {
            validatedQuantity = this.MIN_WHOLESALE_ITEM_QUANTITY;
        }
        if (validatedQuantity % this.STEP_WHOLESALE_ITEM_QUANTITY !== 0) {
             validatedQuantity = Math.max(this.MIN_WHOLESALE_ITEM_QUANTITY, Math.round(validatedQuantity / this.STEP_WHOLESALE_ITEM_QUANTITY) * this.STEP_WHOLESALE_ITEM_QUANTITY);
             if (validatedQuantity < this.MIN_WHOLESALE_ITEM_QUANTITY) validatedQuantity = this.MIN_WHOLESALE_ITEM_QUANTITY;
        }
    } else { // Retail
        if (isNaN(validatedQuantity) || validatedQuantity < 1) {
            validatedQuantity = 1;
        }
    }

    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].quantity += validatedQuantity;
      if (isWholesale) {
          if (this.items[existingItemIndex].quantity < this.MIN_WHOLESALE_ITEM_QUANTITY) {
              this.items[existingItemIndex].quantity = this.MIN_WHOLESALE_ITEM_QUANTITY;
          }
          if (this.items[existingItemIndex].quantity % this.STEP_WHOLESALE_ITEM_QUANTITY !== 0) {
              this.items[existingItemIndex].quantity = Math.max(this.MIN_WHOLESALE_ITEM_QUANTITY, Math.round(this.items[existingItemIndex].quantity / this.STEP_WHOLESALE_ITEM_QUANTITY) * this.STEP_WHOLESALE_ITEM_QUANTITY);
              if (this.items[existingItemIndex].quantity < this.MIN_WHOLESALE_ITEM_QUANTITY) this.items[existingItemIndex].quantity = this.MIN_WHOLESALE_ITEM_QUANTITY;
          }
      }
      this.items[existingItemIndex].price = price;
    } else {
      this.items.push({
        id: id,
        name: name,
        price: price,
        basePrice: parseFloat(basePrice),
        size: size,
        image: image,
        quantity: validatedQuantity
      });
    }

    this.updateTotals();
    this.updateCartUI();
    this.saveCart();
  },

  removeItem: function(index) {
    this.items.splice(index, 1);
    this.updateTotals();
    this.updateCartUI();
    this.saveCart();
  },

  updateQuantity: function(index, newQuantityInput) {
    let newQuantity = parseInt(newQuantityInput);
    const isWholesale = document.body.classList.contains("wholesale-mode");
    let itemMinQuantity = 1;
    let itemStepQuantity = 1;

    if (isWholesale) {
        itemMinQuantity = this.MIN_WHOLESALE_ITEM_QUANTITY;
        itemStepQuantity = this.STEP_WHOLESALE_ITEM_QUANTITY;
    }

    if (isNaN(newQuantity) || newQuantity < itemMinQuantity) {
        newQuantity = itemMinQuantity;
    }

    if (isWholesale && newQuantity % itemStepQuantity !== 0) {
        newQuantity = Math.max(itemMinQuantity, Math.round(newQuantity / itemStepQuantity) * itemStepQuantity);
        if (newQuantity < itemMinQuantity) newQuantity = itemMinQuantity;
    }

    this.items[index].quantity = newQuantity;
    this.updateTotals();
    this.updateCartUI();
    this.saveCart();
  },

  updateTotals: function() {
    this.items.forEach(item => {
        item.price = this.getAdjustedPrice(item.basePrice);
    });
    this.total = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.totalQuantity = this.items.reduce((count, item) => count + item.quantity, 0);
  },

  updateCartUI: function() {
    const cartItemsElement = document.querySelector(".cart-items");
    const cartCountElement = document.querySelector(".cart-count");
    const cartTotalElement = document.querySelector(".cart-total-value");
    const cartElement = document.querySelector(".cart");
    const isWholesale = document.body.classList.contains("wholesale-mode");

    if (!cartItemsElement || !cartCountElement || !cartTotalElement || !cartElement) return;
    this.updateTotals();
    cartItemsElement.innerHTML = "";
    let minOrderMessageElement = cartElement.querySelector(".min-order-message");
    if (!minOrderMessageElement) {
        minOrderMessageElement = document.createElement("div");
        minOrderMessageElement.classList.add("min-order-message");
        const cartButtons = cartElement.querySelector(".cart-buttons");
        if (cartButtons) cartElement.insertBefore(minOrderMessageElement, cartButtons);
    }

    let itemSpecificMinMessage = "";
    let itemQuantitiesIndividuallyValid = true;
    if (isWholesale) {
        this.items.forEach(item => {
            if (item.quantity < this.MIN_WHOLESALE_ITEM_QUANTITY) {
                itemSpecificMinMessage += `O produto ${item.name} (Tam: ${item.size}) deve ter no mínimo ${this.MIN_WHOLESALE_ITEM_QUANTITY} unidades. `;
                itemQuantitiesIndividuallyValid = false;
            }
        });
    }

    if (isWholesale && this.totalQuantity < this.MIN_WHOLESALE_TOTAL_QUANTITY && this.items.length > 0) {
        minOrderMessageElement.textContent = `Pedido mínimo de ${this.MIN_WHOLESALE_TOTAL_QUANTITY} peças para atacado. Faltam ${this.MIN_WHOLESALE_TOTAL_QUANTITY - this.totalQuantity} peças. ${itemSpecificMinMessage}`.trim();
        minOrderMessageElement.style.display = "block";
    } else if (!itemQuantitiesIndividuallyValid && isWholesale) {
        minOrderMessageElement.textContent = itemSpecificMinMessage.trim();
        minOrderMessageElement.style.display = "block";
    } else {
        minOrderMessageElement.style.display = "none";
    }

    if (this.items.length === 0) {
      cartItemsElement.innerHTML = "<p class=\"empty-cart\">Seu carrinho está vazio</p>";
      cartCountElement.textContent = "0";
      cartTotalElement.textContent = "R$ 0,00";
      minOrderMessageElement.style.display = "none";
      return;
    }
    cartCountElement.textContent = this.totalQuantity;
    cartTotalElement.textContent = `R$ ${this.total.toFixed(2).replace(".", ",")}`;
    this.items.forEach((item, index) => {
      const cartItemElement = document.createElement("div");
      cartItemElement.classList.add("cart-item");
      const itemMin = isWholesale ? this.MIN_WHOLESALE_ITEM_QUANTITY : 1;
      const itemStep = isWholesale ? this.STEP_WHOLESALE_ITEM_QUANTITY : 1;
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <p class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")}</p>
          <p class="cart-item-size">Tamanho: ${item.size}</p>
          <div class="cart-item-quantity">
            <button class="quantity-decrease" data-index="${index}">-</button>
            <input type="number" value="${item.quantity}" data-index="${index}" min="${itemMin}" step="${itemStep}">
            <button class="quantity-increase" data-index="${index}">+</button>
          </div>
          <button class="cart-item-remove" data-index="${index}">Remover</button>
        </div>`;
      cartItemsElement.appendChild(cartItemElement);
    });
    document.querySelectorAll(".cart-item-quantity .quantity-decrease").forEach(button => button.addEventListener("click", () => {
      const index = parseInt(button.getAttribute("data-index"));
      const step = document.body.classList.contains("wholesale-mode") ? this.STEP_WHOLESALE_ITEM_QUANTITY : 1;
      this.updateQuantity(index, this.items[index].quantity - step);
    }));
    document.querySelectorAll(".cart-item-quantity .quantity-increase").forEach(button => button.addEventListener("click", () => {
      const index = parseInt(button.getAttribute("data-index"));
      const step = document.body.classList.contains("wholesale-mode") ? this.STEP_WHOLESALE_ITEM_QUANTITY : 1;
      this.updateQuantity(index, this.items[index].quantity + step);
    }));
    document.querySelectorAll(".cart-item-quantity input").forEach(input => input.addEventListener("change", e => {
      this.updateQuantity(parseInt(input.getAttribute("data-index")), parseInt(e.target.value));
    }));
    document.querySelectorAll(".cart-item-remove").forEach(button => button.addEventListener("click", () => {
      this.removeItem(parseInt(button.getAttribute("data-index")));
    }));
  },

  saveCart: function () { localStorage.setItem("pelesensual_cart", JSON.stringify({ items: this.items, total: this.total, totalQuantity: this.totalQuantity })); },
  loadCart: function () {
    const savedCart = localStorage.getItem("pelesensual_cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      this.items = parsedCart.items || [];
      this.updateTotals(); this.updateCartUI();
    }
  },
  clearCart: function () { this.items = []; this.total = 0; this.totalQuantity = 0; this.updateCartUI(); this.saveCart(); },
  showMessage: function (message) {
    const el = document.createElement("div"); el.classList.add("message"); el.textContent = message;
    document.body.appendChild(el); setTimeout(() => el.classList.add("show"), 10);
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => document.body.removeChild(el), 300); }, 3000);
  },
};

function toggleCart() {
  const cartEl = document.querySelector(".cart"); cartEl.classList.toggle("open");
  const overlay = document.querySelector(".cart-overlay");
  if (cartEl.classList.contains("open")) {
    if (!overlay) { const newO = document.createElement("div"); newO.classList.add("cart-overlay"); newO.addEventListener("click", toggleCart); document.body.appendChild(newO); }
    cart.updateCartUI();
  } else { if (overlay) document.body.removeChild(overlay); }
}

function setupQuantityControls(quantityInput, decreaseButton, increaseButton, isWholesaleMode) {
    const step = isWholesaleMode ? cart.STEP_WHOLESALE_ITEM_QUANTITY : 1;
    const initialDisplayQty = isWholesaleMode ? cart.INITIAL_WHOLESALE_ITEM_QUANTITY : 1;
    const trueOperationalMin = isWholesaleMode ? cart.MIN_WHOLESALE_ITEM_QUANTITY : 1;

    if (quantityInput) {
        quantityInput.value = initialDisplayQty;
        quantityInput.step = step; // For native behavior if JS fails, and for a11y
        quantityInput.min = "1"; // Visually allow 1, logic handles true min for wholesale.

        if (decreaseButton) {
            decreaseButton.onclick = (e) => {
                e.preventDefault();
                let currentVal = parseInt(quantityInput.value);
                if (isNaN(currentVal)) currentVal = initialDisplayQty;
                let newVal = currentVal - step;
                if (isWholesaleMode) {
                    if (newVal < trueOperationalMin) newVal = trueOperationalMin;
                } else {
                    if (newVal < 1) newVal = 1;
                }
                quantityInput.value = newVal;
            };
        }
        if (increaseButton) {
            increaseButton.onclick = (e) => {
                e.preventDefault();
                let currentVal = parseInt(quantityInput.value);
                if (isNaN(currentVal)) currentVal = initialDisplayQty;
                quantityInput.value = currentVal + step;
            };
        }
        quantityInput.addEventListener("change", (e) => {
            let val = parseInt(e.target.value);
            const currentModeIsWholesale = document.body.classList.contains("wholesale-mode"); // Re-check mode
            const currentStepForMode = currentModeIsWholesale ? cart.STEP_WHOLESALE_ITEM_QUANTITY : 1;
            const currentMinOp = currentModeIsWholesale ? cart.MIN_WHOLESALE_ITEM_QUANTITY : 1;
            const currentInitialForMode = currentModeIsWholesale ? cart.INITIAL_WHOLESALE_ITEM_QUANTITY : 1;

            if (isNaN(val) || val <= 0) {
                e.target.value = currentInitialForMode;
            } else if (currentModeIsWholesale) {
                if (val < currentMinOp) {
                    // Allow visual input of 1-9. No change to e.target.value here.
                    // handleAddToCartInteraction will correct it.
                } else { // val >= currentMinOp (10)
                    if (val % currentStepForMode !== 0) {
                        let correctedVal = Math.round(val / currentStepForMode) * currentStepForMode;
                        if (correctedVal < currentMinOp) correctedVal = currentMinOp;
                        e.target.value = correctedVal;
                    }
                }
            }
        });
    }
}

function handleAddToCartInteraction(quantityInputElement, productId, productName, baseProductPrice, productImage, size) {
    let quantityFromInput = parseInt(quantityInputElement.value);
    const currentIsWholesale = document.body.classList.contains("wholesale-mode");
    let finalQuantityForCart = quantityFromInput;
    let message = "Produto adicionado ao carrinho!";

    if (currentIsWholesale) {
        const originalAttempt = quantityFromInput;
        const minQty = cart.MIN_WHOLESALE_ITEM_QUANTITY;
        const stepQty = cart.STEP_WHOLESALE_ITEM_QUANTITY;
        let qtyForCart = originalAttempt;

        if (isNaN(qtyForCart) || qtyForCart <= 0) {
            qtyForCart = minQty;
        }

        if (qtyForCart < minQty) {
            qtyForCart = minQty;
            message = `A quantidade mínima por item no atacado é ${minQty}. Seu pedido foi ajustado para ${qtyForCart} unidades.`;
        } else if (qtyForCart % stepQty !== 0) {
            qtyForCart = Math.round(qtyForCart / stepQty) * stepQty;
            if (qtyForCart < minQty) qtyForCart = minQty;
            message = `No atacado, a quantidade deve ser múltiplo de ${stepQty}. Seu pedido foi ajustado para ${qtyForCart} unidades.`;
        }
        finalQuantityForCart = qtyForCart;
    }
     else { // Retail mode validation
        if (isNaN(finalQuantityForCart) || finalQuantityForCart < 1) {
            finalQuantityForCart = 1;
        }
    }

    cart.addItem(productId, productName, baseProductPrice, size, productImage, finalQuantityForCart);
    cart.showMessage(message);
}

function initProductPage() {
  const sizeOptions = document.querySelectorAll(".size-option");
  sizeOptions.forEach(option => option.addEventListener("click", () => {
    sizeOptions.forEach(opt => opt.classList.remove("selected"));
    option.classList.add("selected");
  }));
  const quantityInput = document.querySelector(".product-detail .quantity-control input");
  const decreaseButton = document.querySelector(".product-detail .quantity-control button:first-child");
  const increaseButton = document.querySelector(".product-detail .quantity-control button:last-child");
  const updateControls = () => setupQuantityControls(quantityInput, decreaseButton, increaseButton, document.body.classList.contains("wholesale-mode"));
  updateControls(); window.addEventListener("modeChanged", updateControls);

  const addToCartBtn = document.querySelector(".product-actions .add-to-cart");
  if (addToCartBtn) addToCartBtn.addEventListener("click", () => {
    const selectedSize = document.querySelector(".size-option.selected");
    if (!selectedSize) { cart.showMessage("Por favor, selecione um tamanho"); return; }

    const productNameElem = document.querySelector(".product-info h1");
    const productPriceElem = document.querySelector(".product-info .price");
    const productImageElem = document.querySelector(".product-main-image img");

    const productName = productNameElem ? productNameElem.textContent : "Produto"; 
    const productBasePrice = productPriceElem ? parseFloat(productPriceElem.getAttribute("data-price")) : 0; 
    const productImageSrc = productImageElem ? productImageElem.src : "images/logos/PS-Logo_05.png"; 

    if (!productNameElem || !productPriceElem || !productImageElem) {
        console.error("Não foi possível encontrar todos os elementos de informação do produto na página de detalhes.");
        cart.showMessage("Erro ao obter detalhes do produto. Tente novamente.");
        return;
    }

    handleAddToCartInteraction(quantityInput,
      addToCartBtn.getAttribute("data-id"),
      productName,
      productBasePrice,
      productImageSrc,
      selectedSize.textContent);
  });

  const buyNowBtn = document.querySelector(".product-actions .buy-now");
  if (buyNowBtn) buyNowBtn.addEventListener("click", event => {
    const selectedSize = document.querySelector(".size-option.selected");
    if (!selectedSize) { cart.showMessage("Por favor, selecione um tamanho."); event.preventDefault(); return; }

    const productNameElem = document.querySelector(".product-info h1");
    const productPriceElem = document.querySelector(".product-info .price");
    const productImageElem = document.querySelector(".product-main-image img");

    const productName = productNameElem ? productNameElem.textContent : "Produto"; 
    const productBasePrice = productPriceElem ? parseFloat(productPriceElem.getAttribute("data-price")) : 0; 
    const productImageSrc = productImageElem ? productImageElem.src : "images/logos/PS-Logo_05.png"; 

    if (!productNameElem || !productPriceElem || !productImageElem) {
        console.error("Não foi possível encontrar todos os elementos de informação do produto na página de detalhes para Comprar Agora.");
        cart.showMessage("Erro ao obter detalhes do produto. Tente novamente.");
        event.preventDefault();
        return;
    }

    handleAddToCartInteraction(quantityInput,
        buyNowBtn.getAttribute("data-id"),
        productName,
        productBasePrice,
        productImageSrc,
        selectedSize.textContent);
    cart.updateTotals();
    const isWholesale = document.body.classList.contains("wholesale-mode");
    if (isWholesale) {
        let itemsOk = true; cart.items.forEach(item => { if (item.quantity < cart.MIN_WHOLESALE_ITEM_QUANTITY) itemsOk = false; });
        if (!itemsOk) { cart.showMessage(`No atacado, cada item deve ter no mínimo ${cart.MIN_WHOLESALE_ITEM_QUANTITY} unidades.`); event.preventDefault(); return; }
        if (cart.totalQuantity < cart.MIN_WHOLESALE_TOTAL_QUANTITY) { cart.showMessage(`Pedido mínimo de ${cart.MIN_WHOLESALE_TOTAL_QUANTITY} peças para atacado.`); event.preventDefault(); return; }
    }
    window.location.href = "../checkout.html"; 
  });
}

function openSizeModal(productId, productName, baseProductPrice, productImage) {
  const modal = document.createElement("div"); modal.classList.add("modal"); modal.id = "size-selection-modal";
  const product = productsData.find(p => p.id === productId);
  let sizesHTML = "<p>Selecione o Tamanho:</p>";
  if (product && product.sizes) product.sizes.forEach(s => sizesHTML += `<button class=\"modal-size-option\" data-size=\"${s}\">${s}</button>`);
  else sizesHTML = "<p>Tamanhos não disponíveis.</p>";
  const isWholesale = document.body.classList.contains("wholesale-mode");
  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close-button">&times;</span><h3>${productName}</h3>
      <img src="${productImage}" alt="${productName}" style="max-width: 150px; margin-bottom: 15px;">
      <div class="modal-size-options">${sizesHTML}</div>
      <div class="modal-quantity-control"><label for="modal-quantity">Quantidade:</label>
        <div class="quantity-control"><button id="modal-decrease">-</button><input type="number" id="modal-quantity"><button id="modal-increase">+</button></div>
      </div><button id="modal-add-to-cart" class="btn">Adicionar ao Carrinho</button>
    </div>`;
  document.body.appendChild(modal); modal.style.display = "flex";
  const qtyInput = modal.querySelector("#modal-quantity");
  const decBtn = modal.querySelector("#modal-decrease");
  const incBtn = modal.querySelector("#modal-increase");
  setupQuantityControls(qtyInput, decBtn, incBtn, isWholesale);
  modal.querySelectorAll(".modal-size-option").forEach(b => b.addEventListener("click", () => {
    modal.querySelectorAll(".modal-size-option").forEach(opt => opt.classList.remove("selected")); b.classList.add("selected");
  }));
  modal.querySelector(".modal-close-button").addEventListener("click", () => modal.remove());
  modal.querySelector("#modal-add-to-cart").addEventListener("click", () => {
    const selSizeBtn = modal.querySelector(".modal-size-option.selected");
    if (!selSizeBtn) { cart.showMessage("Por favor, selecione um tamanho."); return; }
    handleAddToCartInteraction(qtyInput, productId, productName, baseProductPrice, productImage, selSizeBtn.getAttribute("data-size"));
    modal.remove();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  cart.loadCart();
  const cartBtn = document.querySelector(".cart-button"); if (cartBtn) cartBtn.addEventListener("click", toggleCart);
  const cartCls = document.querySelector(".cart-close"); if (cartCls) cartCls.addEventListener("click", toggleCart);
  if (document.querySelector(".product-detail")) initProductPage();
  document.querySelectorAll(".product-card .add-to-cart").forEach(button => button.addEventListener("click", e => {
    e.preventDefault(); const card = button.closest(".product-card");
    openSizeModal(button.getAttribute("data-id"), card.querySelector("h3").textContent, parseFloat(card.querySelector(".price").getAttribute("data-price")), card.querySelector("img").src);
  }));
  const checkoutBtn = document.querySelector(".checkout-button");
  if (checkoutBtn) checkoutBtn.addEventListener("click", e => {
    cart.updateTotals(); const isWholesale = document.body.classList.contains("wholesale-mode");
    if (cart.items.length === 0) { cart.showMessage("Seu carrinho está vazio"); e.preventDefault(); return; }
    if (isWholesale) {
      let itemsOk = true; cart.items.forEach(item => { if (item.quantity < cart.MIN_WHOLESALE_ITEM_QUANTITY) itemsOk = false; });
      if (!itemsOk) { cart.showMessage(`No atacado, cada item deve ter no mínimo ${cart.MIN_WHOLESALE_ITEM_QUANTITY} unidades.`); e.preventDefault(); return; }
      if (cart.totalQuantity < cart.MIN_WHOLESALE_TOTAL_QUANTITY) { cart.showMessage(`Pedido mínimo de ${cart.MIN_WHOLESALE_TOTAL_QUANTITY} peças para atacado.`); e.preventDefault(); return; }
    }
    window.location.href = window.location.pathname.includes("pages/") ? "../checkout.html" : "checkout.html";
  });
  const contShopBtn = document.querySelector(".continue-shopping"); if (contShopBtn) contShopBtn.addEventListener("click", toggleCart);
  let currentSlide = 0; const slides = document.querySelectorAll(".banner-slide"); const dots = document.querySelectorAll(".banner-dot"); const totalSlides = slides.length;
  function showSlide(index) { slides.forEach((s, i) => { s.classList.remove("active"); if(dots[i]) dots[i].classList.remove("active"); }); slides[index].classList.add("active"); if(dots[index]) dots[index].classList.add("active"); }
  function nextSlide() { currentSlide = (currentSlide + 1) % totalSlides; showSlide(currentSlide); }
  if (totalSlides > 0) { if (dots.length > 0) dots.forEach((d, i) => d.addEventListener("click", () => { currentSlide = i; showSlide(currentSlide); })); setInterval(nextSlide, 5000); showSlide(currentSlide); }
  const TABS = document.querySelectorAll(".tab-button"); const TAB_CONTENTS = document.querySelectorAll(".tab-pane");
  TABS.forEach(tab => tab.addEventListener("click", () => { TABS.forEach(item => item.classList.remove("active")); tab.classList.add("active"); const target = tab.getAttribute("data-tab"); TAB_CONTENTS.forEach(c => c.classList.toggle("active", c.id === target)); }));
  window.productsData = [{id:"box-feminina-adulto",name:"Box Feminina Adulto",sizes:["P","M","G","GG"]},{id:"box-feminina-infantil",name:"Box Feminina Infantil",sizes:["P","M","G","GG"]},{id:"calcinha-fio-dental-duplo",name:"Calcinha Fio Dental Duplo",sizes:["P","M","G","GG"]},{id:"calcinha-tradicional",name:"Calcinha Tradicional",sizes:["P","M","G","GG"]},{id:"sutia-com-bojo",name:"Sutiã com Bojo",sizes:["P","M","G","GG"]},{id:"sutia-sem-bojo",name:"Sutiã sem Bojo",sizes:["P","M","G","GG"]}];
});

