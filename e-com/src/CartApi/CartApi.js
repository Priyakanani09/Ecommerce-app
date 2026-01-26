const API = "https://ecommerce-app-1-igf3.onrender.com";

const getToken = () => localStorage.getItem("token");

// GET CART
// GET /getcart
export const getCartApi = async () => {
  const res = await fetch(`${API}/getcart`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

// ADD TO CART
// POST /addtocart
export const addToCartApi = async (product) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/addtocart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔥 REQUIRED
    },
    body: JSON.stringify(product),
  });

  return res.json();
};


// UPDATE QTY
// PUT /updatecart
export const updateCartApi = async (productId, qty) => {
  const res = await fetch(`${API}/updatecart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ productId, qty }),
  });
  return res.json();
};

// REMOVE ITEM
// DELETE /removecart/:id
export const removeCartItemApi = async (productId) => {
  const res = await fetch(`${API}/removecart/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

// CLEAR CART
// DELETE /clearcart
export const clearCartApi = async () => {
  const res = await fetch(`${API}/clearcart`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};