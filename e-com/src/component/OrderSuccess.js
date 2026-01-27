import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cartcontext } from "../App";

function OrderSuccess() {
  const { setCartItems } = useContext(cartcontext);
  const [message, setMessage] = useState("Order Placed Successfully");

  useEffect(() => {
    const msg =
      localStorage.getItem("orderMessage") ||
      "Your order has been placed successfully!";
    setMessage(msg);

    const clearCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await fetch("https://ecommerce-app-1-igf3.onrender.com/clearcart", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Failed to clear cart", err);
      }
    };

    clearCart();
    setCartItems([]);
    localStorage.removeItem("cart");
  }, [setCartItems]);

  return (
    <div className="container mt-5 text-center">
      <div className="d-flex justify-content-center align-items-center">
        <div className="card shadow p-5" style={{ width: "450px" }}>
          <h2 className="fw-bold text-success">{message}</h2>

          <p className="mt-3">Thank you for shopping with us!</p>

          <Link to="/" className="btn btn-primary mt-4 w-100">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
