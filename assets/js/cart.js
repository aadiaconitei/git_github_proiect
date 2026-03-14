document.addEventListener("DOMContentLoaded", function () {
  // Suportă atât `products`, cât și `productsCart` (declarații globale cu const/let/var).
  var sourceProducts = [];

  if (typeof products !== "undefined" && Array.isArray(products)) {
    sourceProducts = products;
  } else if (
    typeof productsCart !== "undefined" &&
    Array.isArray(productsCart)
  ) {
    sourceProducts = productsCart;
  }

  // try loading saved cart from localStorage (takes precedence)
  try {
    var storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (Array.isArray(storedCart) && storedCart.length) {
      sourceProducts = storedCart.map(function (p, idx) {
        return {
          id: p.id || `cart-item-${idx}`, // fallback id if missing
          title: p.title || p.name || "Untitled Product",
          // preserve raw price string (or number) so normalization can parse correctly
          price: p.price,
          image: p.image || "",
          quantity: p.quantity || 1,
        };
      });
    }
  } catch (e) {
    // ignore parse errors and fall back to globals
  }

  var cartBody = document.getElementById("cart-products-body");
  var subtotalElement = document.getElementById("cart-subtotal");
  var grandTotalElement = document.getElementById("cart-grandtotal");

  if (!cartBody) {
    return;
  }

  if (!sourceProducts.length) {
    cartBody.innerHTML = "";
    return;
  }

  // Normalizează structura produselor pentru a accepta atât title, cât și name.
  // also parse numeric price from strings like "RON 150.00" for math,
  // but keep the original string for display.
  var normalizedProducts = sourceProducts.map(function (product) {
    var rawPrice = product.price || "";
    var numericPrice = Number(String(rawPrice).replace(/[^0-9.\-]+/g, "")) || 0;
    // determine currency prefix (non-digit characters at start)
    var currencyPrefix = "";
    if (typeof rawPrice === "string") {
      var match = rawPrice.match(/^[^0-9\-\.]+/);
      currencyPrefix = match ? match[0] : "";
    }
    return {
      id: product.id,
      title: product.title || product.name || "Untitled Product",
      price: numericPrice,
      priceString: rawPrice,
      priceCurrency: currencyPrefix,
      image: product.image || "",
      quantity: product.quantity || 1,
    };
  });

  // Generează rândurile din tabel folosind template literals.
  var rowsHtml = normalizedProducts
    .map(function (product) {
      // display unit price using original string when available
      var priceFormatted =
        product.priceString || product.priceCurrency + product.price.toFixed(2);

      return `
            <tr class="border-top" data-product-id="${product.id}" data-unit-price="${product.price}" data-currency="${product.priceCurrency}">
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
                        <input min="1" max="100" value="${product.quantity || 1}" type="number">
                    </div>
                </td>
                <td>
                    <div class="cart_product_price">
                        <span>${priceFormatted}</span>
                    </div>
                </td>
                <td>
                    <div class="cart_product_remove text-right">
                        <a href="#"><i class="ion-android-close"></i></a>
                    </div>
                </td>
            </tr>
        `;
    })
    .join("");

  cartBody.innerHTML = rowsHtml;

  function formatPrice(value, currency) {
    currency = currency || "$";
    return currency + Number(value).toFixed(2);
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
    var currency = row.dataset.currency || "$";
    var quantity = getRowQuantity(row);
    var total = unitPrice * quantity;
    var rowPriceSpans = row.querySelectorAll(".cart_product_price span");

    if (rowPriceSpans[0]) {
      rowPriceSpans[0].textContent = formatPrice(unitPrice, currency);
    }

    if (rowPriceSpans[1]) {
      rowPriceSpans[1].textContent = formatPrice(total, currency);
    }

    return total;
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
  }

  function saveCartFromRows() {
    var productRows = cartBody.querySelectorAll("tr[data-product-id]");
    var cartArr = [];
    productRows.forEach(function (row) {
      var id = row.dataset.productId;
      var titleElem = row.querySelector(".cart_product_text h4");
      var title = titleElem ? titleElem.textContent : "";
      var imageElem = row.querySelector(".cart_product_thumb img");
      var image = imageElem ? imageElem.src : "";
      var price = Number(row.dataset.unitPrice || 0);
      var quantity = getRowQuantity(row);
      cartArr.push({
        id: id,
        title: title,
        price: price,
        image: image,
        quantity: quantity,
      });
    });
    localStorage.setItem("cart", JSON.stringify(cartArr));
  }

  function updateCartIndicator() {
    var cart = [];
    try {
      cart = JSON.parse(localStorage.getItem("cart") || "[]");
    } catch (e) {}
    var count = cart.reduce(function (acc, item) {
      return acc + (item.quantity || 1);
    }, 0);
    document.querySelectorAll(".cart-count").forEach(function (el) {
      el.textContent = count || "";
      el.style.display = count ? "inline-block" : "none";
    });
  }

  function recalculateCartTotal() {
    var productRows = cartBody.querySelectorAll("tr[data-product-id]");

    if (!productRows.length) {
      renderEmptyCartMessage();
      if (subtotalElement) {
        var subtotalSpan = subtotalElement.querySelector("span");
        if (subtotalSpan) {
          subtotalSpan.textContent = formatPrice(0);
        }
      }
      if (grandTotalElement) {
        var grandTotalSpan = grandTotalElement.querySelector("span");
        if (grandTotalSpan) {
          grandTotalSpan.textContent = formatPrice(0);
        }
      }
      saveCartFromRows();
      updateCartIndicator();
      return;
    }

    var subtotal = 0;
    productRows.forEach(function (row) {
      subtotal += updateRowTotal(row);
    });

    var currency = productRows.length
      ? productRows[0].dataset.currency || "$"
      : "$";
    var formattedSubtotal = formatPrice(subtotal, currency);
    if (subtotalElement) {
      var subtotalSpan = subtotalElement.querySelector("span");
      if (subtotalSpan) {
        subtotalSpan.textContent = formattedSubtotal;
      }
    }
    if (grandTotalElement) {
      var grandTotalSpan = grandTotalElement.querySelector("span");
      if (grandTotalSpan) {
        grandTotalSpan.textContent = formattedSubtotal;
      }
    }
    saveCartFromRows();
    updateCartIndicator();
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
      cartBody.innerHTML = "";
      localStorage.removeItem("cart");
      recalculateCartTotal();
      updateCartIndicator();
    });
  }

  cartBody.addEventListener("click", function (event) {
    var removeButton = event.target.closest(".cart_product_remove a");
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
    updateRowTotal(event.target.closest("tr[data-product-id]"));
    recalculateCartTotal();
  });

  recalculateCartTotal();
  // make sure the cart counter in header matches storage when page loads
  updateCartIndicator();
});
