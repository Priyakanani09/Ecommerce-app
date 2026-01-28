import React, { useContext, useEffect, useState } from "react";
import { cartcontext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { toast } from "react-toastify";


function Cart() {
  const { cartItems, setCartItems } = useContext(cartcontext);
  const [showScroll, setShowScroll] = useState(false);
  const navigate = useNavigate();

  /* ================= SCROLL ================= */
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const scrollToBottom = () =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });

  /* ================= UPDATE QTY (API) ================= */
  const updateQty = async (productId, qty) => {
    const token = localStorage.getItem("token");
    if (!token || qty < 1) return;

    try {
      const res = await fetch(
        "https://ecommerce-app-1-igf3.onrender.com/updatecart",
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
        setCartItems(data.items || data.cartItems || []); // 🔥 DB → UI sync
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= REMOVE ITEM (API) ================= */
  const removeItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `https://ecommerce-app-1-igf3.onrender.com/removecart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      if (data.success) {
        setCartItems(data.items || data.cartItems || []);
        toast.error("Item removed from cart");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= TOTAL ================= */
  const total = cartItems.reduce((sum, item) => {
    const rawPrice = item.price ?? item.productId?.price ?? 0;

    const price = Number(rawPrice.toString().replace(/[^0-9.]/g, ""));

    return sum + price * item.qty;
  }, 0);

  return (
    <div className="container mt-5">
      <h2 className="text-center fw-bold mb-3">Your Cart</h2>

      <h4 className="text-center text-success mb-1">Subtotal: ₹{total}</h4>
      <h6 className="text-center text-muted mb-3">Delivery: FREE</h6>

      {cartItems.length > 0 && (
        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            className="btn btn-outline-success px-4"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
          <button
            className="btn btn-outline-primary px-4"
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
          {cartItems.map((item) => {
            const product = item.productId;

            if (!product) return null;

            return (
              <div key={item._id} className="col-md-3 mb-4">
                <div className="card shadow p-3 h-100">
                  <Link
                    to={`/product/${product.category}/${product.subCategory}/${product._id}`}
                  >
                    {product.image?.length > 0 && (
                      <div
                        id={`carousel-${product._id}`}
                        className="carousel slide"
                        data-bs-ride="carousel"
                        data-bs-interval="3000"
                        data-bs-pause="hover"
                      >
                        <div className="carousel-indicators custom-indicators">
                          {product.image.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              data-bs-target={`#carousel-${product._id}`}
                              data-bs-slide-to={index}
                              className={index === 0 ? "active" : ""}
                              aria-current={index === 0 ? "true" : "false"}
                              aria-label={`Slide ${index + 1}`}
                            ></button>
                          ))}
                        </div>

                        <div className="carousel-inner">
                          {product.image.map((img, index) => (
                            <div
                              key={index}
                              className={`carousel-item ${
                                index === 0 ? "active" : ""
                              }`}
                            >
                              <img
                                src={`https://ecommerce-app-1-igf3.onrender.com${img}`}
                                className="d-block product-img "
                                alt={`${product.name} ${index + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Link>

                  <div className="card-body text-center">
                    <h5>{product.name}</h5>
                    <p className="text-muted">{product.description}</p>
                    <p className="fw-bold text-primary">₹{product.price}</p>

                    <div className="d-flex justify-content-center align-items-center gap-3">
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          item.qty === 1
                            ? removeItem(product._id)
                            : updateQty(product._id, item.qty - 1)
                        }
                      >
                        -
                      </button>

                      <span className="fw-bold">{item.qty}</span>

                      <button
                        className="btn btn-success"
                        onClick={() => updateQty(product._id, item.qty + 1)}
                      >
                        +
                      </button>
                    </div>
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
            className="btn btn-secondary d-flex align-items-center justify-content-center scroll-btn-up"
          >
            <FaArrowUp size={16} />
          </button>

          <button
            onClick={scrollToBottom}
            className="btn btn-secondary d-flex align-items-center justify-content-center scroll-btn-down "
          >
            <FaArrowDown size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
