import React, { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://ecommerce-app-1-igf3.onrender.com/getorder", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-12 py-6">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center text-gray-600">
          You have not placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow p-4 md:p-6"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-3 mb-4 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold break-all">{order._id}</p>
                </div>

                <div className="text-sm">
                  <p>
                    Payment :
                    <span className="font-semibold ml-1">
                      {order.paymentMethod}
                    </span>
                  </p>
                  <p className="text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between py-3 text-sm"
                  >
                    <span className="pr-4">
                      {item.name} × {item.qty}
                    </span>
                    <span className="flex items-center font-medium">
                      <MdCurrencyRupee size={14} className="-mr-1" />
                      {(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* TOTAL */}
              <div className="flex justify-between items-center mt-4 font-bold text-lg">
                <span>Total</span>
                <span className="flex items-center text-green-600">
                  <MdCurrencyRupee size={16} className="-mr-1" />
                  {order.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>

              {/* STATUS (future ready) */}
              <div className="mt-3 text-sm">
                <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                  Pending
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
