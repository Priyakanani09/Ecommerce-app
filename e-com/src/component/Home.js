import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { skeletonBlock, skeletonLine, skeletonHeading } from "../utils/skeletons";

function Home() {
  const [products, setProducts] = useState([]);
  const [homeproduct, setHomeproduct] = useState([]);
  const [beautyproduct, setBeautyproduct] = useState([]);
  const [womenproduct, setWomenproduct] = useState([]);
  const [menproduct, setMenproduct] = useState([]);
  const [mobileElectronics, setMobileElectronics] = useState([]);
  const [homeFurnitureSlider, setHomeFurnitureSlider] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showScroll, setShowScroll] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch(`https://ecommerce-app-1-igf3.onrender.com/products`)
      .then((res) => res.json())
      .then((data) => {
        const filteredProducts = data.products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase().includes("tvs & appliances")
        );
        const homeProducts = data.products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase().includes("home & furniture")
        );
        const beautyProducts = data.products.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase().includes("beauty product")
        );
        const womenproduct = data.products.filter(
          (product) =>
            product.category &&
            (product.category.toLowerCase().includes("women wear") ||
              product.category.toLowerCase().includes("women footwear"))
        );
        const menproduct = data.products.filter(
          (product) =>
            product.category &&
            (product.category.toLowerCase().startsWith("men wear") ||
              product.category.toLowerCase().startsWith("men footwear"))
        );
        const mobileElectronics = data.products.filter(
          (product) =>
            product.category &&
            (product.category.toLowerCase().includes("mobiles & tablets") ||
              product.category.toLowerCase().includes("electronics"))
        );
        setProducts(filteredProducts.slice(0, 4));
        setHomeproduct(homeProducts.slice(0, 4));
        setHomeFurnitureSlider(homeProducts.slice(4, 12));
        setBeautyproduct(beautyProducts.slice(0, 4));
        setWomenproduct(womenproduct.slice(0, 4));
        setMenproduct(menproduct.slice(0, 4));
        setMobileElectronics(mobileElectronics.slice(0, 4));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

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

  const renderSkeletonGrid = () =>
    Array.from({ length: 4 }).map((_, i) => (
      <div className="product-box" key={i}>
        {skeletonBlock("100%", 120)}
        {skeletonLine("80%", 16)}
        {skeletonLine("60%", 14)}
      </div>
    ));
  return (
    <div className="container mt-2">
      <div className="container-fluid px-0">
        <div
          id="carouselExampleIndicators"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="2000"
        >
          <div className="carousel-indicators">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={i}
                className={i === 0 ? "active" : ""}
              />
            ))}
          </div>

          <div className="carousel-inner">
            {[1, 3, 4, 5].map((img, index) => (
              <div
                key={img}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={require(`../component/img/slider(${img}).png`)}
                  className="d-block w-100 img-fluid"
                  alt="slide"
                />
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" />
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" />
          </button>
        </div>
      </div>

      <div className="homepage-grid">
        {/* LEFT – TVs */}
        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Best Gadgets & Appliances</h5>}
            <Link to="" className="arrow-link">
              <span className="arrow-btn1">
                <FaChevronRight />
              </span>
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? renderSkeletonGrid()
              : products.map((p) => (
                  <div className="product-box" key={p._id}>
                    <img
                      src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                      alt=""
                    />
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 50% Off</p>
                  </div>
                ))}
          </div>
        </div>

        {/* RIGHT – Home */}
        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Make your home stylish</h5>}
            <Link to="" className="arrow-link">
              <span className="arrow-btn1">
                <FaChevronRight />
              </span>
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? renderSkeletonGrid()
              : homeproduct.map((p) => (
                  <div className="product-box" key={p._id}>
                    <img
                      src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                      alt=""
                    />
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 50% Off</p>
                  </div>
                ))}
          </div>
        </div>

        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Beauty product</h5>}
            <Link to="/fashion/Beauty Product" className="arrow-link">
              <span className="arrow-btn1">
                <FaChevronRight />
              </span>
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? renderSkeletonGrid()
              : beautyproduct.map((p) => (
                  <div className="product-box" key={p._id}>
                    <img
                      src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                      alt=""
                    />
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 30% Off</p>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="homepage-grid">
        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Women Wear and Footwear</h5>}
            <Link to="" className="arrow-link">
              <span className="arrow-btn1">
                <FaChevronRight />
              </span>
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? renderSkeletonGrid()
              : womenproduct.map((p) => (
                  <div className="product-box" key={p._id}>
                    <img
                      src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                      alt=""
                    />
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 40% Off</p>
                  </div>
                ))}
          </div>
        </div>

        {/* RIGHT – Home */}
        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Men Wear and Footwear</h5> }           
            <Link to="" className="arrow-link">
              <span className="arrow-btn1">
                <FaChevronRight />
              </span>
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? renderSkeletonGrid()
              : menproduct.map((p) => (
                  <div className="product-box" key={p._id}>
                    <img
                      src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                      alt=""
                    />
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 28% Off</p>
                  </div>
                ))}
          </div>
        </div>

        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Mobiles, Tablets & Electronics</h5> }
            <Link to="/fashion/Beauty Product" className="arrow-link">
              <span className="arrow-btn1">
                <FaChevronRight />
              </span>
            </Link>
          </div>

          <div className="product-grid">
            {loading
              ? renderSkeletonGrid()
              : mobileElectronics.map((p) => (
                  <div className="product-box" key={p._id}>
                    <img
                      src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                      alt=""
                    />
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 30% Off</p>
                  </div>
                ))}
          </div>
        </div>
      </div>
      {/* ===== HOME & FURNITURE HORIZONTAL SLIDER ===== */}
      <div className="container-fluid mt-4 category-section">
        <div className="d-flex justify-content-between align-items-center mb-2 ">
          {loading ? skeletonHeading() : <h4>Home & Furniture</h4> }
          <button
            className="btn btn-light slider-arrow"
            onClick={() =>
              (document.getElementById("hf-slider").scrollLeft += 300)
            }
          >
            ❯
          </button>
        </div>

        <div className="hf-slider" id="hf-slider">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => (
                <div className="hf-card" key={i}>
                  {skeletonBlock("100%", 150)}
                  {skeletonLine("80%", 14)}
                  {skeletonLine("40%", 14)}
                </div>
              ))
            : homeFurnitureSlider.map((p) => (
                <div key={p._id} className="hf-card">
                  {/* PRODUCT IMAGE CAROUSEL (SAME AS YOUR CODE) */}
                  {p.image && (
                    <div
                      id={`carousel-${p._id}`}
                      className="carousel slide"
                      data-bs-ride="carousel"
                      data-bs-interval="2500"
                    >
                      <div className="carousel-inner ">
                        {p.image.map((img, index) => (
                          <div
                            key={index}
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                          >
                            <img
                              src={`https://ecommerce-app-1-igf3.onrender.com${img}`}
                              alt={p.name}
                              className="d-block w-100"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PRODUCT INFO */}
                  <div className="text-center mt-2">
                    <p className="fw-semibold small mb-1">{p.name}</p>
                    <p className="text-success fw-bold mb-0">₹{p.price}</p>
                  </div>
                </div>
              ))}
        </div>
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
