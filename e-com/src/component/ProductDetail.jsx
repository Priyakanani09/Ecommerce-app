import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ImageGallery from "./ImageGallery";
import { cartcontext, CategoryContext } from "../App";
import { FaShoppingCart, FaBolt, FaArrowUp, FaArrowDown } from "react-icons/fa";
import Breadcrumbs from "./Breadcrumbs";

function ProductDetail() {
  const { id, mainCategory, subCategory } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(cartcontext);
  const { mainCategories, subCategories } = useContext(CategoryContext);

  const [allProducts, setAllProducts] = useState([]);
  const [product, setProduct] = useState(null);

  const [mainCategoryName, setMainCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  const [showScroll, setShowScroll] = useState(false);

  /* ================= SCROLL TO TOP ON PRODUCT CHANGE ================= */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  /* ================= FETCH ALL PRODUCTS (EXISTING LOGIC) ================= */
  useEffect(() => {
    const fetchAllProducts = async () => {
      let all = [];
      let currentPage = 1;
      let total = 1;

      while (currentPage <= total) {
        const res = await fetch(
          `https://ecommerce-app-1-igf3.onrender.com/products?page=${currentPage}`
        );
        const data = await res.json();
        all = [...all, ...data.products];
        total = data.totalPages;
        currentPage++;
      }

      setAllProducts(all);
    };

    fetchAllProducts();
  }, []);

  /* ================= FIND CURRENT PRODUCT ================= */
  useEffect(() => {
    if (allProducts.length > 0) {
      const found = allProducts.find((p) => p._id === id);
      setProduct(found);
    }
  }, [id, allProducts]);

  /* ================= CATEGORY NAMES FROM CONTEXT ================= */
  useEffect(() => {
    const main = mainCategories.find((c) => c._id === mainCategory);
    setMainCategoryName(main?.name || "");

    const sub = subCategories.find((c) => c._id === subCategory);
    setSubCategoryName(sub?.name || "");
  }, [mainCategory, subCategory, mainCategories, subCategories]);

  /* ================= RECENTLY VIEWED ================= */
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

  /* ================= SCROLL BUTTON ================= */
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) return <h4 className="text-center mt-5">Loading...</h4>;

  const related = allProducts.filter(
    (p) =>
      p.subCategory?._id === product.subCategory?._id &&
      p._id !== product._id
  );

  const handleAddToCart = (item) => {
    addToCart(item);
    navigate("/cart");
  };

  const buyNow = (item) => {
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

          <ImageGallery images={product.image} />
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
