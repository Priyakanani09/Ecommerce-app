import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
let recentCache = null;

function RecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    if (recentCache) {
      setRecentlyViewed(recentCache);
      return;
    }
    
    const token = localStorage.getItem("token");

    if (token) {
      fetch("https://ecommerce-app-1-igf3.onrender.com/recently-get", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.getproduct?.length > 0) {
            recentCache = data.getproduct.slice(0, 8);
            setRecentlyViewed(recentCache);
          }
        })
        .catch((err) => console.log(err));
    } else {
      const guestRecent =
        JSON.parse(localStorage.getItem("guest_recent")) || [];

      if (guestRecent.length > 0) {
        setRecentlyViewed(guestRecent.slice(0, 8));
      }
    }
  }, []);

  if (recentlyViewed.length === 0) return null;

  return (
    <div className="container-fluid mt-4 category-section">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5>Recently Viewed Products</h5>
        <button
          className="btn btn-light slider-arrow"
          onClick={() =>
            (document.getElementById("recent-slider").scrollLeft += 300)
          }
        >
          ❯
        </button>
      </div>

      <div className="hf-slider" id="recent-slider">
        {recentlyViewed.map((item) => {
          const product = item.productId || item;

          return (
            <div className="hf-card" key={product._id}>
              <Link
                to={`/product/${product.category}/${product.subCategory}/${product._id}`}
              >
                <img
                  src={`https://ecommerce-app-1-igf3.onrender.com${product.image?.[0]}`}
                  alt={product.name}
                  className="d-block product-img"
                />
              </Link>

              <div className="text-center mt-2">
                <p className="fw-semibold small mb-1">{product.name}</p>
                <p className="text-success fw-bold mb-0">₹{product.price}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentlyViewed;
