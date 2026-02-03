import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdCurrencyRupee } from "react-icons/md";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    fetch("https://ecommerce-app-1-igf3.onrender.com/getorder", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="mt-10 flex justify-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
            You have not placed any orders yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm p-4 md:p-6"
              >
                {/* ORDER HEADER */}
                <div className="flex justify-between items-start border-b pb-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="text-sm font-semibold break-all">
                      {order._id}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-600">
                    <p>
                      Payment:
                      <span className="font-semibold ml-1">
                        {order.paymentMethod}
                      </span>
                    </p>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* TABLE HEADER – DESKTOP ONLY */}
                <div className="hidden md:grid grid-cols-5 gap-3 text-base font-semibold text-gray-500 border-b pb-3">
                  <div className="col-span-2">Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Subtotal</div>
                </div>

                {/* ITEMS */}
                {order.items.map((item, index) => (
                  <div key={index} className="border-b last:border-b-0 py-4">
                    {/* ================= MOBILE VIEW ================= */}
                    <div className="md:hidden space-y-3">
                      <div className="flex justify-center">
                        <Link
                          to={`/product/${item.productId.category}/${item.productId.subCategory}/${item.productId._id}`}
                        >
                          <img
                            src={`https://ecommerce-app-1-igf3.onrender.com${item.productId.image[0]}`}
                            alt={item.name}
                            className="w-28 h-28 object-cover rounded border"
                          />
                        </Link>
                      </div>

                      <p className="text-sm">
                        <span className="font-semibold">Product :</span>{" "}
                        {item.name}
                      </p>

                      <p className="text-sm flex items-center gap-1">
                        <span className="font-semibold">Price :</span>
                        <MdCurrencyRupee size={14} className="-mr-1 mt-1" />
                        {item.price.toLocaleString("en-IN")}
                      </p>

                      <p className="text-sm">
                        <span className="font-semibold">Quantity :</span>{" "}
                        {item.qty}
                      </p>

                      <p className="text-sm flex font-semibold text-green-600">
                        Subtotal :{" "}
                        <MdCurrencyRupee size={14} className="-mr-1 mt-1" />
                        {(item.price * item.qty).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* ================= DESKTOP VIEW ================= */}
                    <div className="hidden md:grid grid-cols-5 gap-3 items-center">
                      <div className="col-span-2 flex items-center gap-4">
                        <Link
                          to={`/product/${item.productId.category}/${item.productId.subCategory}/${item.productId._id}`}
                        >
                          <img
                            src={`https://ecommerce-app-1-igf3.onrender.com${item.productId.image[0]}`}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded border hover:scale-105 transition"
                          />
                        </Link>
                        <p className="text-sm font-medium">{item.name}</p>
                      </div>

                      <div className="text-center text-sm flex items-center justify-center">
                        <MdCurrencyRupee size={14} className="-mr-1" />
                        {item.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-center font-semibold text-sm">{item.qty}</div>

                      <div className="text-right text-sm font-semibold flex items-center justify-end">
                        <MdCurrencyRupee size={14} className="-mr-1 mt-1" />
                        {(item.price * item.qty).toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>
                ))}

                {/* ORDER FOOTER */}
                <div className="flex justify-between items-center pt-4 mt-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                    {order.status}
                  </span>

                  <div className="text-green-600  flex font-bold text-sm">
                    SubTotal :{" "}
                    <MdCurrencyRupee size={14} className="-mr-1 mt-1" />
                    {order.totalAmount.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
