import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { cartcontext } from "../App";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { skeletonBlock, skeletonLine } from "../utils/skeletons";

function Search() {
  const [filtered, setFiltered] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const { addToCart } = useContext(cartcontext);
  const navigate = useNavigate();
  const [showScroll, setShowScroll] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch product data from API
  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`https://ecommerce-app-1-igf3.onrender.com/search?query=${query}`, {
        method: "GET",
        headers: { "Cache-Control": "no-cache" },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setFiltered(data.data)})
        .catch((err) => console.error("Error fetching search results:", err))
        .finally(() => setLoading(false));
    }
  }, [query]);

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
    <div className="p-5">
      <h2>Search Results for "{query}"</h2>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="card p-3" key={i}>
              {skeletonBlock("100%", 280)}
              {skeletonLine("80%", 18)}
              {skeletonLine("60%", 16)}
              {skeletonBlock("100%", 36)}
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {filtered.map((p, index) => (
            <div  key={p._id} className="card p-3">
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
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text text-muted">{p.description}</p>
                <p className="text-primary fw-bold">₹{p.price}</p>
                <button
                  className="btn btn-success"
                  onClick={() => handleAddToCart(p)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No products found.</p>
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

export default Search;
