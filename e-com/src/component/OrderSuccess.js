import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function OrderSuccess() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const msg = localStorage.getItem("orderMessage") || "Order Status Unknown";
    setMessage(msg);
  }, []);

  return (
    <div className="container mt-5 text-center">
      <div className="d-flex justify-content-center align-items-center mb-6">
        <div className="card shadow p-5" style={{ width: "450px" }}>
          <h2 className="fw-bold">{message}</h2>

          <p className="mt-3">Thank you for shopping with us!</p>

          <div className="text-center">
            <Link to="/" className="btn btn-primary mt-4 w-40">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
