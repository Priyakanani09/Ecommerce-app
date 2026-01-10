import React, { useContext, useState } from "react";
import { cartcontext } from "../App";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";

function CODCheckout() {
  const { cartItems, setCartItems } = useContext(cartcontext);
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
    console.log("Sending order data:", data);

    const response = await fetch(
      "https://ecommerce-app-1-igf3.onrender.com/order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const resData = await response.json();
    console.log("Response from server:", resData);

    if (response.ok) {
      localStorage.setItem("orderMessage", "Your order is confirmed!");
      setCartItems([]);
      navigate("/order-success");
    } else {
      localStorage.setItem("orderMessage", "Order failed! Please try again.");
      navigate("/order-success");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-center">COD Checkout</h2>

      <div className="d-flex justify-content-center align-items-center mb-6">
        <Form>
          {/* Name */}
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3" controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Address */}
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="address"
              placeholder="Enter delivery address"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="fw-bold fs-5 mb-3 text-center">
            Total Amount: ₹{total}
          </div>

          {/* Button */}
          <Button variant="success" className="w-100" onClick={placeOrder}>
            Place COD Order
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default CODCheckout;
