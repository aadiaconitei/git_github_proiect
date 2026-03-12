var CART_STORAGE_KEY = "uthr_local_cart";

function getCartFromStorage() {
  try {
    var raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    var parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.map(function (item) {
      return {
        id: Number(item.id),
        title: item.name || item.title || "Untitled Product",
        price: Number(item.price || 0),
        image: item.image || "",
        quantity: Number(item.quantity || 1),
      };
    });
  } catch (e) {
    console.warn("Unable to parse cart data from localStorage", e);
    return [];
  }
}

function saveCartToStorage(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.warn("Unable to save cart data", e);
  }
}

function addProductToCart(product) {
  if (!product || !product.id) {
    console.warn("Invalid product for addProductToCart", product);
    return;
  }

  var cart = getCartFromStorage();
  var existing = cart.find(function (item) {
    return Number(item.id) === Number(product.id);
  });

  if (existing) {
    existing.quantity =
      Number(existing.quantity || 1) + Number(product.quantity || 1);
  } else {
    cart.push({
      id: Number(product.id),
      name: product.name || product.title || "Untitled Product",
      price: Number(product.price || 0),
      image: product.image || "",
      quantity: Number(product.quantity || 1),
    });
  }

  saveCartToStorage(cart);
  updateShoppingCartUI();
  return cart;
}

function getCartItemCount(cart) {
  cart = Array.isArray(cart) ? cart : getCartFromStorage();
  return cart.reduce(function (sum, item) {
    return sum + (Number(item.quantity) || 0);
  }, 0);
}

function updateCartCountUI() {
  var cartCountElement = document.querySelector(".shopping_cart .item_count");
  if (cartCountElement) {
    cartCountElement.textContent = getCartItemCount();
  }
}

function renderMiniCart() {
  var cartItems = getCartFromStorage();
  var cartGallery = document.querySelector(".mini_cart .cart_gallery");
  if (!cartGallery) {
    return;
  }

  if (!cartItems.length) {
    cartGallery.innerHTML =
      '<div class="cart_item"><div class="cart_info"><p>Coșul este gol.</p></div></div>';
  } else {
    cartGallery.innerHTML = cartItems
      .map(function (item) {
        var itemName = item.name || item.title || "Untitled Product";
        return `
                    <div class="cart_item" data-product-id="${item.id}">
                        <div class="cart_img">
                            <a href="#"><img src="${item.image}" alt="${itemName}"></a>
                        </div>
                        <div class="cart_info">
                            <a href="#">${itemName}</a>
                            <p>${item.quantity} x <span>$${Number(item.price).toFixed(2)}</span></p>
                        </div>
                        <div class="cart_remove">
                            <a href="#" class="js-mini-cart-remove" data-product-id="${item.id}"><i class="icon-close icons"></i></a>
                        </div>
                    </div>
                `;
      })
      .join("");
  }

  var grandTotal = cartItems.reduce(function (acc, item) {
    return acc + Number(item.price) * Number(item.quantity);
  }, 0);

  var subtotalEl = document.querySelector(
    ".mini_cart_table .cart_total .price",
  );
  if (subtotalEl) {
    subtotalEl.textContent = `$${grandTotal.toFixed(2)}`;
  }
}

function getStableProductId(name) {
  if (!name) {
    return Date.now();
  }

  var hash = 0;
  for (var i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }

  // Ensure stable positive ID offset from existing numeric IDs
  return Math.abs(hash) + 1000000;
}

function findProductFromCard(cardEl) {
  if (!cardEl) {
    return null;
  }

  var titleEl = cardEl.querySelector(".product_name a");
  var name = titleEl?.textContent?.trim();
  var priceEl =
    cardEl.querySelector(".price_box .current_price") ||
    cardEl.querySelector(".price_box");
  var price = 0;
  if (priceEl) {
    var rawText = String(priceEl.textContent || "");
    var numberMatch = rawText.match(/\d+[\.,]?\d*/g);
    if (numberMatch && numberMatch.length > 0) {
      price = Number(numberMatch[0].replace(/,/g, "")) || 0;
    }
  }
  var imgEl = cardEl.querySelector(".product_thumb img");
  var image = imgEl?.getAttribute("src") || "";

  if (typeof products !== "undefined" && Array.isArray(products) && name) {
    var product = products.find(function (p) {
      return String(p.name).trim() === String(name).trim();
    });
    if (product) {
      return product;
    }
  }

  if (!name) {
    return null;
  }

  var idFromAttr = cardEl.getAttribute("data-product-id");
  var stableId = idFromAttr ? Number(idFromAttr) : getStableProductId(name);

  return {
    id: Number(stableId),
    name: name,
    price: price,
    image: image,
    quantity: 1,
  };
}

function initIndexAddToCart() {
  document.body.addEventListener("click", function (event) {
    var cartBtn = event.target.closest(".add_to_cart a, .js-add-cart");
    if (!cartBtn) {
      return;
    }

    event.preventDefault();

    var card = cartBtn.closest(".single_product");
    if (!card) {
      return;
    }

    var product = findProductFromCard(card);
    if (!product || !product.name) {
      return;
    }

    addProductToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    var addToCartMessage = document.createElement("div");
    addToCartMessage.textContent = "Produsul a fost adăugat în coș.";
    addToCartMessage.style.position = "fixed";
    addToCartMessage.style.bottom = "20px";
    addToCartMessage.style.right = "20px";
    addToCartMessage.style.backgroundColor = "rgba(0,0,0,0.75)";
    addToCartMessage.style.color = "#fff";
    addToCartMessage.style.padding = "10px 14px";
    addToCartMessage.style.borderRadius = "6px";
    addToCartMessage.style.zIndex = "9999";
    document.body.appendChild(addToCartMessage);

    setTimeout(function () {
      addToCartMessage.remove();
    }, 1300);
  });
}

function updateShoppingCartUI() {
  updateCartCountUI();
  renderMiniCart();
}

window.addEventListener("storage", function (event) {
  if (event.key === CART_STORAGE_KEY) {
    updateShoppingCartUI();
  }
});

document.addEventListener("DOMContentLoaded", function () {
  initIndexAddToCart();

  // Global mini-cart remove handler (index/shop/product-details)
  document.body.addEventListener("click", function (event) {
    var removeBtn = event.target.closest(".js-mini-cart-remove");
    if (!removeBtn) {
      return;
    }

    event.preventDefault();

    var removeId = Number(
      removeBtn.getAttribute("data-product-id") || removeBtn.dataset.productId,
    );
    if (Number.isNaN(removeId)) {
      return;
    }

    var cart = getCartFromStorage();
    var updatedCart = cart.filter(function (item) {
      return Number(item.id) !== removeId;
    });

    saveCartToStorage(updatedCart);
    updateShoppingCartUI();
  });

  updateShoppingCartUI();

  var cartBody = document.getElementById("cart-products-body");
  var subtotalElement = document.getElementById("cart-subtotal");
  var grandTotalElement = document.getElementById("cart-grandtotal");

  if (!cartBody) {
    updateShoppingCartUI();
    return;
  }

  updateShoppingCartUI();

  function updateCartFromUI() {
    var rows = cartBody.querySelectorAll("tr[data-product-id]");
    var newCart = [];

    rows.forEach(function (row) {
      var id = row.getAttribute("data-product-id");
      var unitPrice = Number(row.getAttribute("data-unit-price") || 0);
      var title =
        row.querySelector(".cart_product_text h4")?.textContent || "Untitled";
      var image = row.querySelector(".cart_product_thumb img")?.src || "";
      var quantity = Number(
        row.querySelector(".cart_product_quantity input").value || 1,
      );

      if (id) {
        newCart.push({
          id: Number(id),
          name: title,
          price: unitPrice,
          image: image,
          quantity: quantity,
        });
      }
    });

    saveCartToStorage(newCart);
  }

  function saveCartToStorage(cart) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Unable to save cart data", e);
    }
  }

  function updateCartFromUI() {
    var rows = cartBody.querySelectorAll("tr[data-product-id]");
    var newCart = [];

    rows.forEach(function (row) {
      var id = row.getAttribute("data-product-id");
      var unitPrice = Number(row.getAttribute("data-unit-price") || 0);
      var title =
        row.querySelector(".cart_product_text h4")?.textContent || "Untitled";
      var image = row.querySelector(".cart_product_thumb img")?.src || "";
      var quantity = Number(
        row.querySelector(".cart_product_quantity input").value || 1,
      );

      if (id) {
        newCart.push({
          id: Number(id),
          name: title,
          price: unitPrice,
          image: image,
          quantity: quantity,
        });
      }
    });

    saveCartToStorage(newCart);
  }

  var cartBody = document.getElementById("cart-products-body");
  var subtotalElement = document.getElementById("cart-subtotal");
  var grandTotalElement = document.getElementById("cart-grandtotal");

  if (!cartBody) {
    return;
  }

  var sourceProducts = getCartFromStorage();

  function formatPrice(value) {
    return `$${Number(value).toFixed(2)}`;
  }

  function renderEmptyCartMessage() {
    cartBody.innerHTML = `
            <tr class="border-top">
                <td colspan="6">
                    <div class="cart_product_text">
                        <h4>Cart is empty.</h4>
                    </div>
                </td>
            </tr>
        `;

    if (subtotalElement) {
      subtotalElement.textContent = formatPrice(0);
    }
    if (grandTotalElement) {
      grandTotalElement.textContent = formatPrice(0);
    }
  }

  function renderCartRows(products) {
    if (!products || !products.length) {
      renderEmptyCartMessage();
      return;
    }

    var rowsHtml = products
      .map(function (product) {
        var priceFormatted = formatPrice(product.price);
        var quantity = Number(product.quantity || 1);
        var rowTotal = product.price * quantity;

        return `
                <tr class="border-top" data-product-id="${product.id}" data-unit-price="${product.price}">
                    <td>
                        <div class="cart_product_thumb">
                            <img src="${product.image}" alt="${product.title}">
                        </div>
                    </td>
                    <td>
                        <div class="cart_product_text">
                            <h4>${product.title}</h4>
                            <ul>
                                <li><i class="ion-ios-arrow-right"></i> Product ID : <span>${product.id}</span></li>
                            </ul>
                        </div>
                    </td>
                    <td>
                        <div class="cart_product_price">
                            <span>${priceFormatted}</span>
                        </div>
                    </td>
                    <td class="product_quantity">
                        <div class="cart_product_quantity">
                            <input min="1" max="100" value="${quantity}" type="number">
                        </div>
                    </td>
                    <td>
                        <div class="cart_product_price">
                            <span>${formatPrice(rowTotal)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="cart_product_remove text-right">
                            <a href="#" class="js-remove-product"><i class="ion-android-close"></i></a>
                        </div>
                    </td>
                </tr>
            `;
      })
      .join("");

    cartBody.innerHTML = rowsHtml;
  }

  function getRowQuantity(row) {
    var quantityInput = row.querySelector(".cart_product_quantity input");
    if (!quantityInput) {
      return 1;
    }

    var quantity = Number(quantityInput.value);
    if (!quantity || quantity < 1) {
      quantity = 1;
      quantityInput.value = 1;
    }

    return quantity;
  }

  function updateRowTotal(row) {
    var unitPrice = Number(row.dataset.unitPrice || 0);
    var quantity = getRowQuantity(row);
    var total = unitPrice * quantity;
    var rowPriceSpans = row.querySelectorAll(".cart_product_price span");

    if (rowPriceSpans[1]) {
      rowPriceSpans[1].textContent = formatPrice(total);
    }

    return total;
  }

  function recalculateCartTotal() {
    var productRows = cartBody.querySelectorAll("tr[data-product-id]");

    if (!productRows.length) {
      renderEmptyCartMessage();
      saveCartToStorage([]);
      return;
    }

    var subtotal = 0;

    productRows.forEach(function (row) {
      subtotal += updateRowTotal(row);
    });

    var formattedSubtotal = formatPrice(subtotal);
    if (subtotalElement) {
      subtotalElement.textContent = formattedSubtotal;
    }
    if (grandTotalElement) {
      grandTotalElement.textContent = formattedSubtotal;
    }

    updateCartFromUI();
  }

  var updateCartButton = document.querySelector(
    ".shopping_cart_btn button[type='submit']",
  );
  if (updateCartButton) {
    updateCartButton.addEventListener("click", function (event) {
      event.preventDefault();
      recalculateCartTotal();
    });
  }

  var clearCartButton = document.querySelector(".shopping_cart_btn a.btn");
  if (clearCartButton) {
    clearCartButton.addEventListener("click", function (event) {
      event.preventDefault();
      saveCartToStorage([]);
      renderEmptyCartMessage();
    });
  }

  cartBody.addEventListener("click", function (event) {
    var removeButton = event.target.closest(".js-remove-product");
    if (!removeButton) {
      return;
    }

    event.preventDefault();

    var row = removeButton.closest("tr[data-product-id]");
    if (!row) {
      return;
    }

    row.remove();
    recalculateCartTotal();
  });

  cartBody.addEventListener("input", function (event) {
    if (!event.target.matches(".cart_product_quantity input")) {
      return;
    }

    var row = event.target.closest("tr[data-product-id]");
    if (row) {
      updateRowTotal(row);
      updateCartFromUI();

      var subtotal = 0;
      cartBody.querySelectorAll("tr[data-product-id]").forEach(function (row) {
        subtotal += Number(row.dataset.unitPrice || 0) * getRowQuantity(row);
      });

      if (subtotalElement) {
        subtotalElement.textContent = formatPrice(subtotal);
      }
      if (grandTotalElement) {
        grandTotalElement.textContent = formatPrice(subtotal);
      }
    }
  });

  renderCartRows(sourceProducts);
  recalculateCartTotal();
});
