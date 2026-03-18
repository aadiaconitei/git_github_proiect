// Favorites helper (stored in localStorage as an array of product IDs)

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch (e) {
    return [];
  }
}

export function saveFavorites(ids) {
  localStorage.setItem("favorites", JSON.stringify(ids));
}

export function isFavorite(id) {
  const ids = getFavorites();
  return ids.includes(id);
}

export function addToFavorites(id) {
  const ids = getFavorites();
  if (!ids.includes(id)) {
    ids.push(id);
    saveFavorites(ids);
  }
  return ids;
}

export function removeFromFavorites(id) {
  const ids = getFavorites().filter((x) => x !== id);
  saveFavorites(ids);
  return ids;
}

export function toggleFavorite(id) {
  return isFavorite(id) ? removeFromFavorites(id) : addToFavorites(id);
}

export function updateFavoritesIndicator() {
  const count = getFavorites().length;
  document.querySelectorAll(".wishlist-count").forEach((el) => {
    el.textContent = count || "";
    el.style.display = count ? "inline-block" : "none";
  });
}
