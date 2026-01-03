import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import { cartcontext } from "../App";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { skeletonBlock, skeletonLine } from "../utils/skeletons";

function CategoryProducts() {
  const { mainCategory, subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useContext(cartcontext);
  const [showScroll, setShowScroll] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products, main categories, and subcategories from your backend
        const [prodRes, catRes, subCatRes] = await Promise.all([
          fetch("https://ecommerce-app-1-igf3.onrender.com/products"),
          fetch("https://ecommerce-app-1-igf3.onrender.com/main-categories"),
          fetch("https://ecommerce-app-1-igf3.onrender.com/sub-categories"),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const subCatData = await subCatRes.json();

        // Save categories/subCategories
        setCategories(catData.categories || catData);
        setSubCategories(subCatData.subCategories || subCatData);
        let filteredProducts = [];

        if (subCategory) {
          filteredProducts = prodData.products.filter(
            (p) => p.subCategory?._id === subCategory
          );
        } else if (mainCategory) {
          const relatedSubCategories = subCatData.subCategories.filter(
            (sub) => sub.mainCategory === mainCategory
          );

          const subCategoryIds = relatedSubCategories.map((sub) => sub._id);
          filteredProducts = prodData.products.filter((p) =>
            subCategoryIds.includes(p.subCategory?._id)
          );
        } else {
          filteredProducts = prodData.products;
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mainCategory, subCategory]);

  // Find main and sub category objects to get their names
  const mainCatObj = categories.find((c) => c._id === mainCategory);
  const subCatObj = subCategories.find((s) => s._id === subCategory);

  const handleAddToCart = (product) => {
    addToCart(product);
    navigate("/cart");
  };

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

  return (
    <div className="container mt-4">
      <Breadcrumbs
        mainCategory={mainCatObj?.name}
        mainCategoryId={mainCategory}
        subCategory={subCatObj?.name}
      />

      <h4 className="mb-4">
        {subCatObj?.name || mainCatObj?.name || "Products"} Products
      </h4>

      <div className="row">
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
        ) : (
          products.map((p) => (
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
          ))
        )}
      </div>

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

export default CategoryProducts;
