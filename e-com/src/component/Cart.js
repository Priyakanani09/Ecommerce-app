import React, { useContext, useEffect, useState } from "react";
import { cartcontext } from "../App";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

function Cart() {
  const { cartItems, setCartItems } = useContext(cartcontext);
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  /* UPDATE QTY */
  const increaseQty = async (productId, qty) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://ecommerce-app-1-igf3.onrender.com/update-qty",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, qty }),
      },
    );

    const data = await res.json();
    if (data.success) {
      setCartItems(data.items || []);
    }
  };

  /* REMOVE ITEM */
  const decreaseQty = async (productId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://ecommerce-app-1-igf3.onrender.com/remove-item/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    if (data.success) {
      setCartItems(data.items || []);
    }
  };

  let total = 0;
  for (let item of cartItems) {
    const cleanPrice =
      parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) || 0;
    total += cleanPrice * item.qty;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-4">Your Cart</h2>

      <h4 className="text-center mb-4">Total Amount: ₹{total}</h4>

      {cartItems.length > 0 && (
        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            className="btn btn-outline-success px-4 py-2"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout (COD)
          </button>

          <button
            className="btn btn-outline-primary px-4 py-2"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      )}

      {cartItems.length === 0 ? (
        <h5 className="text-center text-muted">Your cart is empty</h5>
      ) : (
        <div className="row">
          {cartItems.map((item, index) => {
            const cleanPrice =
              parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) || 0;

            return (
              <div key={index} className="col-md-3 mb-4">
                <div className="card shadow p-3">
                  <Link
                    to={`/product/${item.category?._id}/${item.subCategory?._id}/${item.productId}`}
                  >
                    {item.image && item.image.length > 0 && (
                      <div
                        id={`cart-carousel-${index}`}
                        className="carousel slide"
                        data-bs-ride="carousel"
                      >
                        <div className="carousel-indicators custom-indicators">
                          {item.image.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              data-bs-target={`#cart-carousel-${index}`}
                              data-bs-slide-to={i}
                              className={i === 0 ? "active" : ""}
                            ></button>
                          ))}
                        </div>

                        <div className="carousel-inner">
                          {item.image.map((img, i) => (
                            <div
                              key={i}
                              className={`carousel-item ${
                                i === 0 ? "active" : ""
                              }`}
                            >
                              <img
                                src={`https://ecommerce-app-1-igf3.onrender.com${img}`}
                                alt={item.name}
                                className="d-block w-100"
                                style={{
                                  height: "280px",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Link>
                  <div className="card-body text-center">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="text-muted">{item.description}</p>
                    <p className="text-primary fw-bold">₹{item.price}</p>

                    <div className="d-flex justify-content-center align-items-center gap-3 mt-2">
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          item.qty === 1
                            ? decreaseQty(item.productId)
                            : increaseQty(item.productId, item.qty - 1)
                        }
                      >
                        -
                      </button>

                      <span className="fw-bold">{item.qty}</span>

                      <button
                        className="btn btn-success"
                        onClick={() =>
                          increaseQty(item.productId, item.qty + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <p className="mt-2 fw-bold text-success">
                      Subtotal: ₹{cleanPrice * item.qty}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showScroll && (
        <>
          <button
            onClick={scrollToTop}
            className="btn btn-secondary d-flex align-items-center justify-content-center"
            style={{
              position: "fixed",
              bottom: "80px",
              right: "20px",
              zIndex: 1000,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
          >
            <FaArrowUp size={18} />
          </button>

          <button
            onClick={scrollToBottom}
            className="btn btn-secondary d-flex align-items-center justify-content-center"
            style={{
              position: "fixed",
              bottom: "30px",
              right: "20px",
              zIndex: 1000,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
            }}
          >
            <FaArrowDown size={18} />
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
