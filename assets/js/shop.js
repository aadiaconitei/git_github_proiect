import ALL_PRODUCTS from "./product.js";

// filter state
let selectedColors = [];
let priceRange = { min: 0, max: 1000 };
let selectedBrands = [];

// helper methods for cart stored in localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
function updateCartIndicator() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count || "";
    el.style.display = count ? "inline-block" : "none";
  });

  // also update mini cart
  updateMiniCart(cart);
}

function updateMiniCart(cart) {
  const miniCartGallery = document.querySelector(".cart_gallery");
  if (!miniCartGallery) return;

  const cartItemsHtml = cart
    .map(
      (item) => `
    <div class="cart_item">
      <div class="cart_img">
        <a href="#"><img src="${item.image}" alt="${item.title}"></a>
      </div>
      <div class="cart_info">
        <a href="#">${item.title}</a>
        <p>${item.quantity || 1} x <span> ${item.price} </span></p>
      </div>
      <div class="cart_remove">
        <a href="#" data-cart-id="${item.id}"><i class="icon-close icons"></i></a>
      </div>
    </div>
  `,
    )
    .join("");

  if (!cart.length) {
    miniCartGallery.innerHTML =
      '<div class="cart_item"><div class="cart_info"><p>Cart is empty</p></div></div>';
  } else {
    miniCartGallery.innerHTML = cartItemsHtml;
  }

  // update subtotal in mini cart
  const subtotal = cart.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/[^0-9.\-]+/g, "")) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);
  const totalSpan = document.querySelector(
    ".mini_cart_table .cart_total span.price",
  );
  if (totalSpan) {
    totalSpan.textContent = "$" + subtotal.toFixed(2);
  }
}

const productContainer = document.querySelector(".shop_wrapper");
// remove bootstrap "row" if present to prevent flex/negative margins
if (productContainer && productContainer.classList.contains("row")) {
  productContainer.classList.remove("row");
}
const renderItems = (products) => {
  if (!productContainer) return;
  productContainer.innerHTML = "";
  products.forEach((product, index) => {
    const id = product.id || `product-${index}`;
    const productElement = document.createElement("div");
    // grid layout handled by CSS; no extra classes needed on each item
    productElement.innerHTML = `
            <div class="single_product" data-product-id="${id}">
                                 <div class="product_thumb">
                                    <a href="product-details.html" >
                                        <img class="primary_img" src="${product.image}" alt="consectetur">
                                    </a>
                                    <div class="product_action">
                                        <ul>
                                            <li class="wishlist"><a href="#" data-tippy="Wishlist" data-tippy-inertia="true" data-tippy-delay="50"
                                            data-tippy-arrow="true" data-tippy-placement="left"><i class="icon-heart icons"></i></a></li>

                                            <li class="quick_view"><a data-toggle="modal" data-target="#modal_box" data-tippy="Quick View" href="#" data-tippy-inertia="true" data-tippy-delay="50" data-tippy-arrow="true" data-tippy-placement="left"><i class="icon-size-fullscreen icons"></i></a></li>
                                            <li class="compare"><a data-tippy="Compare" href="#" data-tippy-inertia="true" data-tippy-delay="50"
                                            data-tippy-arrow="true" data-tippy-placement="left"><i class="icon-refresh icons"></i></a></li>
                                        </ul>
                                    </div>
                                    <div class="product_label">
                                        <span>-18%</span>
                                    </div>
                                </div>
                                <div class="product_content grid_content text-center">
                                    <div class="product_ratting">
                                        <ul class="d-flex justify-content-center">
                                            <li><a href="#"><i class="ion-android-star"></i></a></li>
                                            <li><a href="#"><i class="ion-android-star"></i></a></li>
                                            <li><a href="#"><i class="ion-android-star"></i></a></li>
                                            <li><a href="#"><i class="ion-android-star"></i></a></li>
                                            <li><a href="#"><i class="ion-android-star"></i></a></li>
                                            <li><span>(2)</span></li>
                                        </ul>
                                    </div>
                                    <h4 class="product_name"><a href="product-details.html">${product.title}</a></h4>
                                    <div class="price_box">
                                        <span class="current_price">${product.price}</span>
                                        <span class="old_price">${product.oldPrice}</span>
                                    </div>
                                    <div class="add_to_cart">
                                        <a class="btn btn-primary add-to-cart-btn" href="#" data-index="${index}" data-tippy="Add To Cart"  data-tippy-inertia="true" data-tippy-delay="50" data-tippy-arrow="true" data-tippy-placement="top">Add To Cart</a>
                                    </div>
                                </div>
                                <div class="product_list_content">
                                    <h4 class="product_name"><a href="product-details.html">${product.title}</a></h4>
                                    <p><a href="#">shows</a></p>
                                    <div class="price_box">
                                        <span class="current_price">${product.price}</span>
                                        <span class="old_price">${product.oldPrice}</span>
                                    </div>
                                    <div class="product_desc">
                                        <p>Nunc facilisis sagittis ullamcorper. Proin lectus ipsum, gravida et mattis vulputate, tristique ut lectus. Sed et lorem nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean eleifend laoreet congue. Viva..</p>
                                    </div>
                                    <div class="add_to_cart">
                                        <a class="btn btn-primary add-to-cart-btn" href="#" data-index="${index}" data-tippy="Add To Cart"  data-tippy-inertia="true" data-tippy-delay="50" data-tippy-arrow="true" data-tippy-placement="top">Add To Cart</a>

                                    </div>
                                </div>
                            </div>
        `;
    productContainer.appendChild(productElement);
  });

  // modal management
  const modal = document.getElementById("confirmationModal");
  const modalMessage = document.getElementById("confirmationMessage");
  const okBtn = document.getElementById("confirmationOkBtn");
  const cancelBtn = document.getElementById("confirmationCancelBtn");

  let pendingAction = null;

  function showConfirmation(message, callback) {
    modalMessage.textContent = message;
    pendingAction = callback;
    modal.style.display = "flex";
  }

  function closeModal() {
    modal.style.display = "none";
    pendingAction = null;
  }

  okBtn.addEventListener("click", () => {
    if (pendingAction) pendingAction();
    closeModal();
  });

  cancelBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // mini cart remove handler
  document.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".cart_remove a");
    if (removeBtn) {
      e.preventDefault();
      const id = removeBtn.dataset.cartId;
      if (id) {
        const cart = getCart().filter((item) => item.id !== id);
        saveCart(cart);
        updateCartIndicator();
      }
    }
  });

  // attach click listeners
  productContainer.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const idx = Number(this.dataset.index);
      const prod = products[idx];
      if (!prod) return;
      const productInfo = {
        id: prod.id || `product-${idx}`,
        title: prod.title,
        price: prod.price,
        image: prod.image,
      };

      showConfirmation(
        `You added this ${productInfo.title} to your cart`,
        () => {
          const cart = getCart();
          const existing = cart.find((item) => item.id === productInfo.id);
          if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
          } else {
            cart.push({ ...productInfo, quantity: 1 });
          }
          saveCart(cart);
          updateCartIndicator();
        },
      );
    });
  });
  // wishlist handling
  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch (e) {
      return [];
    }
  }
  function saveWishlist(arr) {
    localStorage.setItem("wishlist", JSON.stringify(arr));
  }
  function updateWishlistIndicator() {
    const fav = getWishlist();
    const count = fav.length;
    document.querySelectorAll(".wishlist-count").forEach((el) => {
      el.textContent = count || "";
      el.style.display = count ? "inline-block" : "none";
    });
  }

  // heart icon click
  productContainer.querySelectorAll(".wishlist a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const prodDiv = this.closest(".single_product");
      if (!prodDiv) return;
      const pid = prodDiv.dataset.productId;
      const prod = products.find((p) => p.id === pid);
      if (!prod) return;

      showConfirmation(`You added this ${prod.title} to your favorite`, () => {
        const wish = getWishlist();
        if (!wish.find((i) => i.id === pid)) {
          wish.push({ id: pid, title: prod.title, image: prod.image });
          saveWishlist(wish);
        }
        updateWishlistIndicator();
      });
    });
  });

  updateCartIndicator();
  updateWishlistIndicator();
};

// filter functions
function getFilteredProducts() {
  return ALL_PRODUCTS.filter((product) => {
    // color filter
    if (
      selectedColors.length > 0 &&
      !selectedColors.some((color) => product.colors.includes(color))
    ) {
      return false;
    }
    // price filter
    const price = parseFloat(product.price.replace(/[^0-9.]/g, ""));
    if (price < priceRange.min || price > priceRange.max) {
      return false;
    }
    // brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    return true;
  });
}

function colorChoosing() {
  const colorCheckboxes = document.querySelectorAll(
    '.color-filter input[type="checkbox"]',
  );
  selectedColors = Array.from(colorCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  renderItems(getFilteredProducts());
}

function priceParameter() {
  const priceInput = document.getElementById("amount");
  if (priceInput && priceInput.value) {
    const prices = priceInput.value
      .split(" - ")
      .map((p) => parseFloat(p.replace(/[^0-9.]/g, "")));
    if (prices.length === 2) {
      priceRange.min = prices[0] || 0;
      priceRange.max = prices[1] || 1000;
    }
  }
  renderItems(getFilteredProducts());
}

function brandChoosing() {
  const brandCheckboxes = document.querySelectorAll(
    '.brand-filter input[type="checkbox"]',
  );
  selectedBrands = Array.from(brandCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
  renderItems(getFilteredProducts());
}

// event listeners for filters
document.addEventListener("DOMContentLoaded", () => {
  // color filter listeners
  document
    .querySelectorAll('.color-filter input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", colorChoosing);
    });

  // price filter listeners
  document
    .getElementById("min-price")
    .addEventListener("input", priceParameter);
  document
    .getElementById("max-price")
    .addEventListener("input", priceParameter);

  // brand filter listeners
  document
    .querySelectorAll('.brand-filter input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", brandChoosing);
    });
});

renderItems(ALL_PRODUCTS);
updateCartIndicator();
