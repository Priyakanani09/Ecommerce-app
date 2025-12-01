import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { cartcontext } from "../App";

function TvsAppliances() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(cartcontext);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = (pageNumber) => {
    fetch(
      `http://localhost:5002/products?page=${pageNumber}&category=tvs & appliances`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        const filteredProducts = data.products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase().includes("tvs & appliances")
        );
        setProducts(filteredProducts);
        setTotalPages(data.totalPages);
        setPage(data.currentPage);
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts(page);
    window.scrollTo(0,0);
  }, [page]);

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 fw-bold text-2xl">Tvs & Appliances</h2>

      <div className="row">
        {products.map((p) => (
          <div key={p._id} className="col-md-3 mb-3">
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
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                      >
                        <img
                          src={`http://localhost:5002${img}`}
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
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center align-items-center my-4">
        <button
          className="btn btn-outline-primary mx-2"
          onClick={prevPage}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="fw-bold">
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-outline-primary mx-2"
          onClick={nextPage}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default TvsAppliances;
