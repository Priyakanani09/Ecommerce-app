import React, { useEffect, useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

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
      <div className="mt-10 flex justify-center items-center">
        <h3 className="text-gray-500">Loading orders...</h3>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6">
      <div className="max-w-7xl  mx-auto px-4">
        <h1 className="text-xl md:text-2xl font-bold mb-5 text-center">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
            You have not placed any orders yet.
          </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm p-4 md:p-5"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start border-b pb-3 mb-3">
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

                {/* ITEMS */}
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/product/${item.productId.category}/${item.productId.subCategory}/${item.productId._id}`}
                      >
                        <img
                          src={`https://ecommerce-app-1-igf3.onrender.com${item.productId.image[0]}`}
                          alt={item.name}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border hover:scale-105 transition"
                        />
                      </Link>

                      <div>
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.qty}
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center text-sm font-semibold">
                      <MdCurrencyRupee size={14} className="-mr-1" />
                      {(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}

                {/* FOOTER */}
                <div className="flex justify-between items-center border-t pt-3 mt-3">
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                    {order.status}
                  </span>

                  <div className="flex items-center gap-1 font-bold text-green-600">
                    <span>SubTotal:</span>
                    <MdCurrencyRupee size={15} className="-mr-1" />
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
