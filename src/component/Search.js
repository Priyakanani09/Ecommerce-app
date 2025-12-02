import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { cartcontext } from "../App";

function Search() {
  const [filtered, setFiltered] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const {addToCart} = useContext(cartcontext);
  const navigate = useNavigate();

  // Fetch product data from API
  useEffect(() => {
  if (query) {
     fetch(`http://localhost:5002/search?query=${query}`, {
      method: "GET",
      headers: { "Cache-Control": "no-cache" }
    })
      .then((res) => res.json())
      .then((data) => setFiltered(data))
      .catch((err) => console.error("Error fetching search results:", err));
  }
}, [query]);

   const handleAddToCart = (product) => {
        addToCart(product);
        navigate('/cart');
      }
  return (
    <div className="p-5">
      <h2>Search Results for "{query}"</h2>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {filtered.map((p,index) => (
             <div className="card p-3">
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
                        className={`carousel-item ${index === 0 ? "active" : ""}`}
                      >
                        <img
                          src={`http://localhost:5002${img}`}
                          className="d-block w-100"
                          alt={`${p.name} ${index + 1}`}
                          style={{
                            height: "280px",
                            objectFit: "contain"
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
                <button className="btn btn-success" onClick={() => handleAddToCart(p)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No products found.</p>
      )}
    </div>
  );
}

export default Search;