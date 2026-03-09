document.addEventListener("DOMContentLoaded", function () {
    // Suportă atât `products`, cât și `productsCart` (declarații globale cu const/let/var).
    var sourceProducts = [];

    if (typeof products !== "undefined" && Array.isArray(products)) {
        sourceProducts = products;
    } else if (typeof productsCart !== "undefined" && Array.isArray(productsCart)) {
        sourceProducts = productsCart;
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
    var normalizedProducts = sourceProducts.map(function (product) {
        return {
            id: product.id,
            title: product.title || product.name || "Untitled Product",
            price: Number(product.price || 0),
            image: product.image || ""
        };
    });

    // Generează rândurile din tabel folosind template literals.
    var rowsHtml = normalizedProducts.map(function (product) {
        var priceFormatted = `$${product.price.toFixed(2)}`;

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
                        <input min="1" max="100" value="1" type="number">
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
    }).join("");

    cartBody.innerHTML = rowsHtml;

    function formatPrice(value) {
        return `$${Number(value).toFixed(2)}`;
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

        if (rowPriceSpans[0]) {
            rowPriceSpans[0].textContent = formatPrice(unitPrice);
        }

        if (rowPriceSpans[1]) {
            rowPriceSpans[1].textContent = formatPrice(total);
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

    function recalculateCartTotal() {
        var productRows = cartBody.querySelectorAll("tr[data-product-id]");

        if (!productRows.length) {
            renderEmptyCartMessage();
            if (subtotalElement) {
                subtotalElement.textContent = formatPrice(0);
            }
            if (grandTotalElement) {
                grandTotalElement.textContent = formatPrice(0);
            }
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
    }

    var updateCartButton = document.querySelector(".shopping_cart_btn button[type='submit']");
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
            recalculateCartTotal();
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
    });

    recalculateCartTotal();
});
