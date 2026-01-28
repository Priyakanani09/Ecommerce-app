import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeartBroken } from "react-icons/fa";
import { toast } from "react-toastify";
import { cartcontext } from "../App";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { addToCart, cartItems } = useContext(cartcontext);

  // 🔹 GET WATCHLIST
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("https://ecommerce-app-1-igf3.onrender.com/get-watchlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setWatchlist(data.watchlist || []);
      })
      .catch(() => toast.error("Failed to load watchlist"))
      .finally(() => setLoading(false));
  }, [navigate]);

  // 🔹 REMOVE FROM WATCHLIST
  const removeFromWatchlist = async (productId) => {
    const token = localStorage.getItem("token");

    await fetch(
      `https://ecommerce-app-1-igf3.onrender.com/remove-watchlist/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setWatchlist((prev) =>
      prev.filter((item) => item.productId._id !== productId)
    );

  };

  // 🔹 ADD TO CART
  const handleAddToCart = (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const alreadyInCart = cartItems.some(
      (item) => item.productId?._id === product._id
    );

    if (alreadyInCart) {
      toast.info("Already in cart");
      return;
    }

    addToCart(product._id);
    toast.success("Added to cart");
  };

  if (loading) return <h4 className="text-center">Loading...</h4>;

  if (watchlist.length === 0)
    return <h4 className="text-center mt-5">No items in watchlist ❤️</h4>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My Watchlist</h3>

      <div className="row">
        {watchlist.map((item) => {
          const product = item.productId;

          return (
            <div key={item._id} className="col-6 col-md-3 mb-4">
              <div className="card h-100 p-3 position-relative">

                <Link
                  to={`/product/${product.category?._id}/${product.subCategory?._id}/${product._id}`}
                >
                  {product.image && product.image.length > 0 && (
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
                              className="d-block product-img"
                              alt={`${product.name} ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>

                <div className="card-body text-center product-card">
                  <h5>{product.name}</h5>
                  <p className="text-muted">{product.description}</p>
                  <p className="fw-bold text-primary">₹{product.price}</p>

                  <button
                    className="btn btn-success btn-sm mb-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeFromWatchlist(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Watchlist;
