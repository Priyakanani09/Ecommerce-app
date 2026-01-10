import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import { cartcontext } from "../App";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { skeletonBlock, skeletonLine } from "../utils/skeletons";

function CategoryProducts() {
  const { mainCategory, subCategory } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(cartcontext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [mainCategoryName, setMainCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showScroll, setShowScroll] = useState(false);

  const fetchData = async (pageNumber) => {
    try {
      setLoading(true);
      let url = `https://ecommerce-app-1-igf3.onrender.com/products?page=${pageNumber}`;

      if (subCategory) {
        url += `&subCategory=${subCategory}`;
      } else if (mainCategory) {
        url += `&mainCategory=${mainCategory}`;
      }

      const prodRes = await fetch(url);
      const prodData = await prodRes.json();

      setProducts(prodData.products);
      setTotalPages(prodData.totalPages);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        if (mainCategory) {
          const res = await fetch(
            `https://ecommerce-app-1-igf3.onrender.com/main-categories`
          );
          const data = await res.json();

          const objectMainCategory = data?.categories?.find(
            (d1) => d1._id === mainCategory
          );
          setMainCategoryName(objectMainCategory?.name);
        }

        if (subCategory) {
          const res = await fetch(
            "https://ecommerce-app-1-igf3.onrender.com/sub-categories"
          );
          const data = await res.json();

          const objectSubCategory = data?.subCategories?.find(
            (d1) => d1._id === subCategory
          );

          setSubCategoryName(objectSubCategory?.name);
        } else {
          setSubCategoryName("");
        }
      } catch (err) {
        console.error("Category name error:", err);
      }
    };

    fetchCategoryNames();
  }, [mainCategory, subCategory]);

  useEffect(() => {
    fetchData(page);
    window.scrollTo(0, 0);
  }, [mainCategory, subCategory, page]);

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

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };
  return (
    <div className="container mt-4">
      <Breadcrumbs
        mainCategory={mainCategoryName}
        subCategory={subCategoryName}
        mainCategoryId={mainCategory}
      />

      <h4 className="mb-4">
        {(subCategoryName || mainCategoryName || "Products") + " Products"}
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
                <Link
                  to={`/product/${p.category?._id}/${p.subCategory?._id}/${p._id}`}
                >
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
                </Link>
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