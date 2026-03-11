document.addEventListener("DOMContentLoaded", function () {
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
          id: item.id,
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
