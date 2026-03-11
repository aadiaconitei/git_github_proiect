document.addEventListener("DOMContentLoaded", function () {
    if (typeof WishlistStore === "undefined") {
        return;
    }

    var tableBody = document.getElementById("wishlist-products-body");
    var emptyMessage = document.getElementById("wishlist-empty");

    if (!tableBody) {
        return;
    }

    function formatPrice(value) {
        return `$${Number(value || 0).toFixed(2)}`;
    }

    function showWishlistRemoveModal() {
        return new Promise(function (resolve) {
            var modalElement = $("#wishlist_remove_modal");
            var confirmButton = document.getElementById("wishlist-remove-confirm");
            var cancelButton = document.getElementById("wishlist-remove-cancel");
            var isResolved = false;

            function cleanup() {
                confirmButton.removeEventListener("click", onConfirm);
                cancelButton.removeEventListener("click", onCancel);
                modalElement.off("hidden.bs.modal", onHidden);
            }

            function finish(result) {
                if (isResolved) {
                    return;
                }

                isResolved = true;
                cleanup();
                resolve(result);
            }

            function onConfirm(event) {
                event.preventDefault();
                finish(true);
                modalElement.modal("hide");
            }

            function onCancel(event) {
                event.preventDefault();
                finish(false);
                modalElement.modal("hide");
            }

            function onHidden() {
                finish(false);
            }

            confirmButton.addEventListener("click", onConfirm);
            cancelButton.addEventListener("click", onCancel);
            modalElement.on("hidden.bs.modal", onHidden);
            modalElement.modal("show");
        });
    }

    function render() {
        var wishlistItems = WishlistStore.getAll();

        if (!wishlistItems.length) {
            tableBody.innerHTML = "";
            if (emptyMessage) {
                emptyMessage.style.display = "block";
            }
            return;
        }

        if (emptyMessage) {
            emptyMessage.style.display = "none";
        }

        tableBody.innerHTML = wishlistItems.map(function (product) {
            var productName = product.name || product.title || "Product";

            return `
                <tr class="border-top" data-product-id="${product.id}">
                    <td>
                        <div class="cart_product_thumb">
                            <img src="${product.image || ""}" alt="${productName}">
                        </div>
                    </td>
                    <td>
                        <div class="cart_product_text">
                            <h4>${productName}</h4>
                            <ul>
                                <li><i class="ion-ios-arrow-right"></i> Category : <span>${product.category || "N/A"}</span></li>
                            </ul>
                        </div>
                    </td>
                    <td>
                        <div class="cart_product_price">
                            <span>${formatPrice(product.price)}</span>
                        </div>
                    </td>
                    <td>
                        <div class="cart_product_remove text-right">
                            <a href="#" class="js-remove-wishlist"><i class="ion-android-close"></i></a>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");
    }

    tableBody.addEventListener("click", async function (event) {
        var removeButton = event.target.closest(".js-remove-wishlist");
        if (!removeButton) {
            return;
        }

        event.preventDefault();
        var row = removeButton.closest("tr[data-product-id]");
        if (!row) {
            return;
        }

        var shouldRemove = await showWishlistRemoveModal();
        if (!shouldRemove) {
            return;
        }

        WishlistStore.remove(row.getAttribute("data-product-id"));
        render();
    });

    render();
});
