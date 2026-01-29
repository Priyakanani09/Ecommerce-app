import React, { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "./Breadcrumbs";
import { cartcontext, CategoryContext } from "../App";
import { FaArrowUp, FaArrowDown, FaHeart } from "react-icons/fa";
import { skeletonBlock, skeletonLine } from "../utils/skeletons";
import { toast } from "react-toastify";

function CategoryProducts() {
  const { mainCategory, subCategory } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(cartcontext);
  const { mainCategories, subCategories } = useContext(CategoryContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [mainCategoryName, setMainCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const [watchlistIds, setWatchlistIds] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showScroll, setShowScroll] = useState(false);

  /* ================= FETCH PRODUCTS ================= */
  const fetchData = useCallback(
    async (pageNumber) => {
      try {
        setLoading(true);

        let url = `https://ecommerce-app-1-igf3.onrender.com/products?page=${pageNumber}`;

        if (subCategory) url += `&subCategory=${subCategory}`;
        else if (mainCategory) url += `&mainCategory=${mainCategory}`;

        const res = await fetch(url);
        const data = await res.json();

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [mainCategory, subCategory],
  );

  /* ================= FETCH WATCHLIST ================= */
  const fetchWatchlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        "https://ecommerce-app-1-igf3.onrender.com/get-watchlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();

      const ids = (data.watchlist || []).map((item) => item.productId._id);
      setWatchlistIds(ids);
    } catch (err) {
      console.error("Watchlist fetch error");
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  /* ================= CATEGORY NAME ================= */
  useEffect(() => {
    const main = mainCategories.find((c) => c._id === mainCategory);
    setMainCategoryName(main?.name || "");

    const sub = subCategories.find((c) => c._id === subCategory);
    setSubCategoryName(sub?.name || "");
  }, [mainCategory, subCategory, mainCategories, subCategories]);

  useEffect(() => {
    setPage(1);
  }, [mainCategory, subCategory]);

  useEffect(() => {
    fetchData(page);
    window.scrollTo({ top: 0 });
  }, [page, fetchData]);

  /* ================= TOGGLE WATCHLIST ================= */
  const toggleWatchlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        "https://ecommerce-app-1-igf3.onrender.com/add-watchlist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId }),
        },
      );

      const data = await res.json();

      if (data.action === "added") {
        setWatchlistIds((prev) => [...prev, productId]);
        toast.success("Added to watchlist");
      }

      if (data.action === "removed") {
        setWatchlistIds((prev) => prev.filter((id) => id !== productId));
        toast.info("Removed from watchlist");
      }
    } catch (err) {
      toast.error("Watchlist update failed");
    }
  };

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const exists = cartItems.some(
      (item) => item.productId?._id === product._id,
    );

    if (exists) {
      toast.info("Already in cart");
      return;
    }

    addToCart(product._id);
    toast.success("Added to cart");
  };

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

  const nextPage = () => page < totalPages && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div key={p._id} className="col-6 col-md-3 mb-4">
              <div className="card p-3 h-100 position-relative0">
                <button
                  className="btn position-absolute top-0 end-0 m-2"
                  style={{ background: "none", border: "none", zIndex: 10 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWatchlist(p._id);
                  }}
                >
                  <FaHeart
                    size={18}
                    color={watchlistIds.includes(p._id) ? "red" : "gray"}
                  />
                </button>

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
                              className="d-block product-img "
                              alt={`${p.name} ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Link>

                <div className="card-body text-center product-card">
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
            className="btn btn-secondary scroll-btn-up"
          >
            <FaArrowUp size={16} />
          </button>

          <button
            onClick={scrollToBottom}
            className="btn btn-secondary scroll-btn-down"
          >
            <FaArrowDown size={16} />
          </button>
        </>
      )}
    </div>
  );
}

export default CategoryProducts;
