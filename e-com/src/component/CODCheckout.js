import React, { useContext, useState } from "react";
import { cartcontext } from "../App";
import { useNavigate } from "react-router-dom";

function CODCheckout() {
  const { cartItems,setCartItems } = useContext(cartcontext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const total = cartItems.reduce((acc, item) => {
    const cleanPrice = parseFloat(
      item.price.toString().replace(/[^0-9.]/g, "")
    );
    return acc + cleanPrice;
  }, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
     if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      return alert("Please fill all fields");
    }

    const data = {
      userId: user.id,      
      username: user.name,
      name: form.name,
      phone: form.phone,
      address: form.address,
      items: cartItems,
      totalAmount: total,
      date: new Date(),
    };

    localStorage.setItem(`order_${user.id}`, JSON.stringify(data));

     const response = await fetch("https://ecommerce-app-1-igf3.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();

    if (response.ok) {
      localStorage.setItem("orderMessage", "Your order is confirmed!");
      setCartItems([]);
      navigate("/order-success");
    } 
    else
    {
      localStorage.setItem("orderMessage", "Order failed! Please try again.");
      navigate("/order-success");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-center mb-4">COD Checkout</h2>

      <div className="d-flex justify-content-center align-items-center mb-6">
        <div className="card p-4 shadow w-50" style={{ maxWidth: "450px" }}>
          <label>Name:</label>
          <input
            type="text"
            className="form-control mb-3"
            name="name"
            onChange={handleChange}
          />

          <label>Phone:</label>
          <input
            type="text"
            className="form-control mb-3"
            name="phone"
            onChange={handleChange}
          />

          <label>Address:</label>
          <textarea
            className="form-control mb-3"
            name="address"
            rows="3"
            onChange={handleChange}
          ></textarea>

          <h4>Total Amount: ₹{total}</h4>

          <button className="btn btn-success mt-3" onClick={placeOrder}>
            Place COD Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CODCheckout;
