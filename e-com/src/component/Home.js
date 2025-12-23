import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { cartcontext } from "../App";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import ProductSkeleton from "./ProductSkeleton";

function Home() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(cartcontext);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const fetchProducts = (pageNumber) => {
    setLoading(true);
    fetch(
      `https://ecommerce-app-1-igf3.onrender.com/products?page=${pageNumber}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts(page);
    window.scrollTo(0, 0);
  }, [page]);

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

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold">All Products</h2>

      <div className="row">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((p) => (
              <div key={p._id} className="col-md-3 mb-3">
                <div className="card p-3 h-100">
                  {p.image && p.image.length > 0 && (
                    <div
                      id={`carousel-${p._id}`}
                      className="carousel slide"
                      data-bs-ride="carousel"
                      data-bs-interval="3000"
                      data-bs-pause="hover"
                    >
                      <div className="carousel-indicators custom-indicators">
                        {p.image.map((_, index) => (
                          <button
                            key={index}
                            type="button"
                            data-bs-target={`#carousel-${p._id}`}
                            data-bs-slide-to={index}
                            className={index === 0 ? "active" : ""}
                            aria-current={index === 0 ? "true" : "false"}
                            aria-label={`Slide ${index + 1}`}
                          ></button>
                        ))}
                      </div>

                      <div className="carousel-inner">
                        {p.image.map((img, index) => (
                          <div
                            key={index}
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                          >
                            <img
                              src={`https://ecommerce-app-1-igf3.onrender.com${img}`}
                              className="d-block w-100"
                              alt={`${p.name} ${index + 1}`}
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

                  <div className="card-body text-center">
                    <h5>{p.name}</h5>
                    <p className="text-muted">{p.description}</p>
                    <p className="fw-bold text-primary">₹{p.price}</p>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAddToCart(p)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center my-4">
        <button
          className="btn btn-outline-primary mx-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span className="fw-bold mt-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary mx-2"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* Scroll Buttons */}
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

export default Home;
