import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ImageGallery from "./ImageGallery";
import { cartcontext, CategoryContext } from "../App";
import {
  FaShoppingCart,
  FaBolt,
  FaArrowUp,
  FaArrowDown,
  FaHeart,
} from "react-icons/fa";
import Breadcrumbs from "./Breadcrumbs";
import { toast } from "react-toastify";

function ProductDetail() {
  const { id, mainCategory, subCategory } = useParams();
  const navigate = useNavigate();

  const { addToCart, cartItems } = useContext(cartcontext);
  const { mainCategories, subCategories } = useContext(CategoryContext);

  const [watchlistIds, setWatchlistIds] = useState([]);

  const [allProducts, setAllProducts] = useState([]);
  const [product, setProduct] = useState(null);

  const [mainCategoryName, setMainCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(
          "https://ecommerce-app-1-igf3.onrender.com/products?allproduct=true",
        );
        const data = await res.json();
        setAllProducts(data.products);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const found = allProducts.find((p) => p._id === id);
      setProduct(found);
    }
  }, [id, allProducts]);

  useEffect(() => {
    const main = mainCategories.find((c) => c._id === mainCategory);
    setMainCategoryName(main?.name || "");

    const sub = subCategories.find((c) => c._id === subCategory);
    setSubCategoryName(sub?.name || "");
  }, [mainCategory, subCategory, mainCategories, subCategories]);

  useEffect(() => {
    if (!product) return;

    const token = localStorage.getItem("token");

    if (token) {
      fetch("https://ecommerce-app-1-igf3.onrender.com/recently-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      }).catch(() => {});
    } else {
      let recent = JSON.parse(localStorage.getItem("guest_recent")) || [];
      recent = recent.filter((p) => p._id !== product._id);
      recent.unshift(product);
      localStorage.setItem("guest_recent", JSON.stringify(recent.slice(0, 8)));
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  if (!product) return <h4 className="text-center mt-5">Loading...</h4>;

  const related = allProducts.filter(
    (p) =>
      p.subCategory?._id === product.subCategory?._id && p._id !== product._id,
  );

  const handleAddToCart = (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    const alreadyInCart = cartItems.some(
      (item) => item.productId?._id === product._id,
    );

    if (alreadyInCart) {
      toast.info("Already in cart");
      return;
    }
    addToCart(product._id);
  };

  const buyNow = (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    addToCart(item);
    navigate("/checkout");
  };

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
    <div className="container bg-white p-3 mt-4">
      <div className="row">
        <div className="col-md-5">
          <div className="d-block d-md-none">
            <Breadcrumbs
              mainCategory={mainCategoryName}
              subCategory={subCategoryName}
              mainCategoryId={mainCategory}
              subCategoryId={subCategory}
              productName={product.name}
            />
          </div>

          <div className="position-relative">
            {/* ❤️ WATCHLIST ICON ON IMAGE */}
            <button
              className="btn position-absolute top-0 end-0 m-2"
              style={{ background: "none", border: "none", zIndex: 10 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWatchlist(product._id);
              }}
            >
              <FaHeart
                size={18}
                color={watchlistIds.includes(product._id) ? "red" : "gray"}
              />
            </button>
            <ImageGallery images={product.image} />
          </div>
        </div>

        <div className="col-md-7">
          <div className="d-none d-md-block my-2">
            <Breadcrumbs
              mainCategory={mainCategoryName}
              subCategory={subCategoryName}
              mainCategoryId={mainCategory}
              subCategoryId={subCategory}
              productName={product.name}
            />
          </div>

          <h3>{product.name}</h3>
          <p className="text-muted">{product.description}</p>
          <h3 className="text-primary">₹{product.price}</h3>

          <div className="mt-4 d-flex flex-column flex-md-row gap-3">
            <button
              className="btn btn-warning text-white px-4 d-flex align-items-center justify-content-center fw-bold gap-2 "
              onClick={() => handleAddToCart(product)}
            >
              <FaShoppingCart size={18} />
              ADD TO CART
            </button>

            <button
              className="btn btn-success fw-bold px-4 d-flex align-items-center justify-content-center gap-2"
              onClick={() => buyNow(product)}
            >
              <FaBolt size={18} />
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      <h4 className="mt-5">Related Products</h4>

      <div className="row">
        {related.map((p) => (
          <div key={p._id} className="col-6 col-sm-6 col-md-3 mb-4">
            <div className="card p-3 h-100">
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
              </div>
            </div>
          </div>
        ))}
      </div>

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

export default ProductDetail;
