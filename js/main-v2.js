
// ARQUIVO CORRIGIDO: main-v2.js
// Funcionalidades principais do e-commerce Pele Sensual Moda Íntima

// Carrinho de compras (mantém a lógica existente)
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

  // ... (mantém todas as outras funções do carrinho)
  addItem: function(id, name, basePrice, size, image, quantity) {
    const price = this.getAdjustedPrice(basePrice);
    const existingItemIndex = this.items.findIndex(item => item.id === id && item.size === size);
    const isWholesale = document.body.classList.contains("wholesale-mode");
    let validatedQuantity = parseInt(quantity);

    if (isWholesale) {
      if (isNaN(validatedQuantity) || validatedQuantity < this.MIN_WHOLESALE_ITEM_QUANTITY) {
        validatedQuantity = this.MIN_WHOLESALE_ITEM_QUANTITY;
      }
      if (validatedQuantity % this.STEP_WHOLESALE_ITEM_QUANTITY !== 0) {
        validatedQuantity = Math.max(this.MIN_WHOLESALE_ITEM_QUANTITY, Math.round(validatedQuantity / this.STEP_WHOLESALE_ITEM_QUANTITY) * this.STEP_WHOLESALE_ITEM_QUANTITY);
        if (validatedQuantity < this.MIN_WHOLESALE_ITEM_QUANTITY) validatedQuantity = this.MIN_WHOLESALE_ITEM_QUANTITY;
      }
    } else {
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

  // ... (mantém outras funções)
  updateTotals: function() {
    this.items.forEach(item => {
      item.price = this.getAdjustedPrice(item.basePrice);
    });
    this.total = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    this.totalQuantity = this.items.reduce((count, item) => count + item.quantity, 0);
  },

  showMessage: function (message) {
    const el = document.createElement("div"); 
    el.classList.add("message"); 
    el.textContent = message;
    document.body.appendChild(el); 
    setTimeout(() => el.classList.add("show"), 10);
    setTimeout(() => { 
      el.classList.remove("show"); 
      setTimeout(() => document.body.removeChild(el), 300); 
    }, 3000);
  },

  // ... (mantém outras funções como updateCartUI, saveCart, loadCart, etc.)
};

// CORREÇÃO 1: Função para extrair parâmetros da URL
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// CORREÇÃO 2: Função para carregar dados do produto na página de detalhes
function loadProductDetails() {
  const productId = getURLParameter('id');
  if (!productId) {
    console.error('ID do produto não encontrado na URL');
    return;
  }

  // Dados dos produtos (expandir conforme necessário)
  const productsData = {
    '016': {
      id: '016',
      name: 'Calça Microfibra',
      basePrice: 4.70,
      material: 'Microfibra',
      sizes: ['P', 'M', 'G', 'GG'],
      images: ['images/calca_microfibra_frente_1.png', 'images/calca_microfibra_tras_1.png'],
      description: 'Calça confortável em microfibra, ideal para o dia a dia.'
    },
    '012': {
      id: '012',
      name: 'Calça Modal',
      basePrice: 5.20,
      material: 'Modal',
      sizes: ['P', 'M', 'G', 'GG'],
      images: ['images/calcola_modal_frente_1.png', 'images/calcola_modal_tras_1.png'],
      description: 'Calça em modal, tecido macio e respirável.'
    }
    // Adicionar mais produtos conforme necessário
  };

  const product = productsData[productId];
  if (!product) {
    console.error('Produto não encontrado:', productId);
    return;
  }

  // Atualizar elementos da página
  const productNameElem = document.querySelector('.product-info h1');
  const productPriceElem = document.querySelector('.product-info .price');
  const productMaterialElem = document.querySelector('.product-info .material');
  const productDescElem = document.querySelector('.product-info .description');
  const productImageElem = document.querySelector('.product-main-image img');
  const addToCartBtn = document.querySelector('.product-actions .add-to-cart');
  const buyNowBtn = document.querySelector('.product-actions .buy-now');

  if (productNameElem) productNameElem.textContent = product.name;
  if (productPriceElem) {
    const adjustedPrice = cart.getAdjustedPrice(product.basePrice);
    productPriceElem.textContent = `R$ ${adjustedPrice.toFixed(2).replace('.', ',')}`;
    productPriceElem.setAttribute('data-price', product.basePrice);
  }
  if (productMaterialElem) productMaterialElem.textContent = `Material: ${product.material}`;
  if (productDescElem) productDescElem.textContent = product.description;
  if (productImageElem) productImageElem.src = product.images[0];
  if (addToCartBtn) addToCartBtn.setAttribute('data-id', product.id);
  if (buyNowBtn) buyNowBtn.setAttribute('data-id', product.id);

  // Atualizar opções de tamanho
  const sizeOptions = document.querySelector('.size-options');
  if (sizeOptions) {
    sizeOptions.innerHTML = '';
    product.sizes.forEach(size => {
      const sizeBtn = document.createElement('button');
      sizeBtn.classList.add('size-option');
      sizeBtn.textContent = size;
      sizeOptions.appendChild(sizeBtn);
    });
  }
}

// CORREÇÃO 3: Modal de seleção melhorado (apenas seleção, não adiciona automaticamente)
function openSizeModal(productId, productName, baseProductPrice, productImage) {
  const modal = document.createElement("div"); 
  modal.classList.add("modal"); 
  modal.id = "size-selection-modal";

  const product = window.productsData?.find(p => p.id === productId);
  let sizesHTML = "<p>Selecione o Tamanho:</p>";

  if (product && product.sizes) {
    product.sizes.forEach(s => sizesHTML += `<button class="modal-size-option" data-size="${s}">${s}</button>`);
  } else {
    sizesHTML = "<p>Tamanhos não disponíveis.</p>";
  }

  const isWholesale = document.body.classList.contains("wholesale-mode");

  modal.innerHTML = `
    <div class="modal-content">
      <span class="modal-close-button">&times;</span>
      <h3>${productName}</h3>
      <img src="${productImage}" alt="${productName}" style="max-width: 150px; margin-bottom: 15px;">
      <div class="modal-size-options">${sizesHTML}</div>
      <div class="modal-quantity-control">
        <label for="modal-quantity">Quantidade:</label>
        <div class="quantity-control">
          <button id="modal-decrease">-</button>
          <input type="number" id="modal-quantity" min="1" value="1">
          <button id="modal-increase">+</button>
        </div>
      </div>
      <button id="modal-add-to-cart" class="btn">Adicionar ao Carrinho</button>
    </div>`;

  document.body.appendChild(modal); 
  modal.style.display = "flex";

  const qtyInput = modal.querySelector("#modal-quantity");
  const decBtn = modal.querySelector("#modal-decrease");
  const incBtn = modal.querySelector("#modal-increase");

  setupQuantityControls(qtyInput, decBtn, incBtn, isWholesale);

  modal.querySelectorAll(".modal-size-option").forEach(b => b.addEventListener("click", () => {
    modal.querySelectorAll(".modal-size-option").forEach(opt => opt.classList.remove("selected")); 
    b.classList.add("selected");
  }));

  modal.querySelector(".modal-close-button").addEventListener("click", () => modal.remove());

  modal.querySelector("#modal-add-to-cart").addEventListener("click", () => {
    const selSizeBtn = modal.querySelector(".modal-size-option.selected");
    if (!selSizeBtn) { 
      cart.showMessage("Por favor, selecione um tamanho."); 
      return; 
    }

    handleAddToCartInteraction(qtyInput, productId, productName, baseProductPrice, productImage, selSizeBtn.getAttribute("data-size"));
    modal.remove();
  });
}

// Resto das funções mantém igual...
// (setupQuantityControls, handleAddToCartInteraction, initProductPage, etc.)
