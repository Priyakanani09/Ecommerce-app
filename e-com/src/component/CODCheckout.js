import React, { useContext, useEffect, useState } from "react";
import { cartcontext } from "../App";
import { useNavigate } from "react-router-dom";
import { MdCurrencyRupee } from "react-icons/md";

function CODCheckout() {
  const { cartItems, setCartItems } = useContext(cartcontext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
  });

  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  

  const user = JSON.parse(localStorage.getItem("user"));

  const getCleanPrice = (price) =>
    parseFloat(price?.toString().replace(/[^0-9.]/g, "")) || 0;

 const subtotal = cartItems.reduce((acc, item) => {
    const price = getCleanPrice(item.price || item.productId?.price);
    const qty = item.qty || 1;
    return acc + price * qty;
  }, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    for (let key in form) {
      if (!form[key]) {
        alert("Please fill all fields");
        return;
      }
    }

    const orderData = {
      userId: user._id,
      customer: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        address: {
          address1: form.address1,
          address2: form.address2,
          city: form.city,
          state: form.state,
          pin: form.pin,
        },
      },
     items: cartItems.map((item) => ({
        productId: item.productId?._id || item.productId,
        name: item.productId?.name,
        price: getCleanPrice(item.price || item.productId?.price),
        qty: item.qty || 1,
      })),
      totalAmount: subtotal,
      paymentMethod: "COD",
    };

    const response = await fetch(
      "https://ecommerce-app-1-igf3.onrender.com/order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      },
    );

    if (response.ok) {
      setCartItems([]);
      navigate("/order-success");
    } else {
      alert("Order failed");
    }
  };

  return (
    <div className="bg-gray-50  py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="lg:col-span-2 bg-white rounded-md shadow-sm p-6">
          <h2 className="text-lg font-semibold border-b pb-3 mb-6">
            Billing Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm p-1 font-medium mb-1">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                name="firstName"
                placeholder="First name"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                          focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium p-1 mb-1">
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                name="lastName"
                placeholder="Last name"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                          focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm p-1 font-medium mb-1">
              Email address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium p-1 mb-1">
              Street address <span className="text-red-500">*</span>
            </label>
            <input
              name="address1"
              placeholder="House number and street name"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 mb-3 focus:ring-green-500"
            />
            <input
              name="address2"
              placeholder="Apartment, suite, unit (optional)"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium p-1 mb-1">
                Town / City <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                placeholder="Town / City"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium p-1 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                name="state"
                placeholder="State"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium p-1 mb-1">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                name="pin"
                placeholder="PIN Code"
                maxLength={6}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium p-1 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                placeholder="Phone"
                maxLength={10}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* ================= RIGHT : YOUR ORDER ================= */}
        <div className="bg-white rounded-md shadow-sm p-6 self-start">
          <h2 className="text-lg font-semibold border-b pb-3 mb-4">
            Your Order
          </h2>

          <div className="flex uppercase justify-between text-sm font-medium text-gray-600 border-b pb-2 mb-3">
            <span>Product</span>
            <span>Subtotal</span>
          </div>

          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between text-sm mb-2">
              <span>
               {item.productId?.name} × {item.qty || 1}
              </span>
              <span className="text-green-600 flex items-center">
                <MdCurrencyRupee size={14} className="-mr-1 mt-1" />
                {(getCleanPrice(item.productId?.price) * (item.qty || 1)).toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>
          ))}

          <div className="flex justify-between bg-gray-100 px-3 py-3 mt-4 font-semibold">
            <span>Total</span>
            <span className="text-green-600 flex  items-center">
              <MdCurrencyRupee size={14} className="-mr-1 mt-1" />
              {subtotal.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-4 border-t pt-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked readOnly />
              <span className="font-medium">Cash on delivery</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Pay with cash upon delivery.
            </p>
          </div>

          <button
            onClick={placeOrder}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CODCheckout;
