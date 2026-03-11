(function () {
    var WISHLIST_STORAGE_KEY = "wishlistProducts";

    function getAll() {
        try {
            var rawValue = localStorage.getItem(WISHLIST_STORAGE_KEY);
            var parsed = rawValue ? JSON.parse(rawValue) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function saveAll(items) {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
        updateCount();
    }

    function add(product) {
        if (!product || typeof product.id === "undefined") {
            return;
        }

        var wishlistItems = getAll();
        var alreadyExists = wishlistItems.some(function (item) {
            return Number(item.id) === Number(product.id);
        });

        if (alreadyExists) {
            return;
        }

        wishlistItems.push(product);
        saveAll(wishlistItems);
    }

    function has(productId) {
        return getAll().some(function (item) {
            return Number(item.id) === Number(productId);
        });
    }

    function remove(productId) {
        var wishlistItems = getAll();
        var filteredItems = wishlistItems.filter(function (item) {
            return Number(item.id) !== Number(productId);
        });
        saveAll(filteredItems);
    }

    function clear() {
        saveAll([]);
    }

    function getCount() {
        return getAll().length;
    }

    function updateCount() {
        var count = getCount();
        document.querySelectorAll("[data-wishlist-count]").forEach(function (element) {
            element.textContent = String(count);
        });
    }

    function initCount() {
        updateCount();
    }

    window.WishlistStore = {
        getAll: getAll,
        has: has,
        add: add,
        remove: remove,
        clear: clear,
        getCount: getCount,
        initCount: initCount,
        updateCount: updateCount
    };

    document.addEventListener("DOMContentLoaded", initCount);
})();
