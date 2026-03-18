// Simple localStorage-based authentication helper (for demo purposes only)

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem("users") || "[]");
  } catch (e) {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

export function registerUser({ name, email, password }) {
  const users = getUsers();
  const exists = users.find(
    (u) => u.email?.toLowerCase() === email?.toLowerCase(),
  );
  if (exists) {
    return { error: "Email is already registered." };
  }

  const user = { name: name || "", email, password };
  users.push(user);
  saveUsers(users);
  setCurrentUser({ name: user.name, email: user.email });
  return { success: true, user };
}

export function loginUser({ email, password }) {
  const user = getUsers().find(
    (u) =>
      u.email?.toLowerCase() === email?.toLowerCase() &&
      u.password === password,
  );
  if (!user) {
    return { error: "Invalid email or password." };
  }
  setCurrentUser({ name: user.name, email: user.email });
  return { success: true, user: { name: user.name, email: user.email } };
}

export function logout() {
  clearCurrentUser();
}

export function requireAuth(redirect = "login.html") {
  const current = getCurrentUser();
  if (!current) {
    window.location.href = redirect;
    return null;
  }
  return current;
}
