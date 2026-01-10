import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../App.css";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import slider1 from "./img/slider(1).png";
import slider3 from "./img/slider(3).png";
import slider4 from "./img/slider(4).png";
import slider5 from "./img/slider(5).png";
import {
  skeletonBlock,
  skeletonLine,
  skeletonHeading,
} from "../utils/skeletons";
import RecentlyViewed from "./RecentlyViewed";

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
  const sliderImages = [slider1, slider3, slider4, slider5];
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // 🔥 IMPORTANT
      }
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (!allProducts.length) return;
    const mobileProducts = allProducts.filter(
      (p) =>
        p.subCategory?.name &&
        (p.subCategory.name.toLowerCase().includes("smart phone") ||
          p.subCategory.name.toLowerCase().includes("tablet") ||
          p.subCategory.name.toLowerCase().includes("mobile accessories") ||
          p.subCategory.name.toLowerCase().includes("smart watches"))
    );

    const homeProducts = allProducts.filter(
      (p) =>
        p.category?.name &&
        p.category.name.toLowerCase().includes("home & furniture")
    );

    const beautyProducts = allProducts.filter(
      (p) =>
        p.subCategory?.name &&
        (p.subCategory?.name?.toLowerCase().includes("beauty") ||
          p.subCategory?.name?.toLowerCase().includes("bags"))
    );

    const womenProducts = allProducts.filter(
      (p) =>
        p.subCategory?.name &&
        (p.subCategory.name.toLowerCase().startsWith("women wear") ||
          p.subCategory.name.toLowerCase().startsWith("women footwear"))
    );

    const menProducts = allProducts.filter(
      (p) =>
        p.subCategory?.name &&
        (p.subCategory.name.toLowerCase().startsWith("men wear") ||
          p.subCategory.name.toLowerCase().startsWith("men footwear"))
    );

    const electronicsProducts = allProducts.filter(
      (p) =>
        p.subCategory?.name &&
        (p.subCategory.name.toLowerCase().includes("laptops") ||
          p.subCategory.name.toLowerCase().includes("speakear") ||
          p.subCategory.name.toLowerCase().includes("cameras") ||
          p.subCategory.name.toLowerCase().includes("network components"))
    );

    setProducts(mobileProducts.slice(0, 4));
    setHomeproduct(homeProducts.slice(0, 4));
    setHomeFurnitureSlider(homeProducts.slice(4, 12));
    setBeautyproduct(beautyProducts.slice(0, 4));
    setWomenproduct(womenProducts.slice(0, 4));
    setMenproduct(menProducts.slice(0, 4));
    setMobileElectronics(electronicsProducts.slice(0, 4));
  }, [allProducts]);

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
            {sliderImages.map((img, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={img}
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
        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Best Gadgets & Appliances</h5>}
            <Link to=" " className="arrow-link">
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
                    <Link
                      to={`/category/${p.category?._id}/${p.subCategory?._id}`}
                    >
                      <img
                        src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                        alt={p.name}
                      />
                    </Link>

                    <h6>{p.name}</h6>
                    <p className="offer">Min. 50% Off</p>
                  </div>
                ))}
          </div>
        </div>

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
                    <Link
                      to={`/category/${p.category?._id}/${p.subCategory?._id}`}
                    >
                      <img
                        src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                        alt={p.name}
                      />
                    </Link>
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 50% Off</p>
                  </div>
                ))}
          </div>
        </div>

        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Beauty product</h5>}
            <Link to="" className="arrow-link">
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
                    <Link
                      to={`/category/${p.category?._id}/${p.subCategory?._id}`}
                    >
                      <img
                        src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                        alt={p.name}
                      />
                    </Link>
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
                    <Link
                      to={`/category/${p.category?._id}/${p.subCategory?._id}`}
                    >
                      <img
                        src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                        alt={p.name}
                      />
                    </Link>
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 40% Off</p>
                  </div>
                ))}
          </div>
        </div>

        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Men Wear and Footwear</h5>}
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
                    <Link
                      to={`/category/${p.category?._id}/${p.subCategory?._id}`}
                    >
                      <img
                        src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                        alt={p.name}
                      />
                    </Link>
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 28% Off</p>
                  </div>
                ))}
          </div>
        </div>

        <div className="category-section">
          <div className="category-header">
            {loading ? skeletonHeading() : <h5>Electronics Appliances</h5>}
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
                    <Link
                      to={`/category/${p.category?._id}/${p.subCategory?._id}`}
                    >
                      <img
                        src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                        alt={p.name}
                      />
                    </Link>
                    <h6>{p.name}</h6>
                    <p className="offer">Min. 30% Off</p>
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4 category-section">
        <div className="d-flex justify-content-between align-items-center mb-2 ">
          {loading ? skeletonHeading() : <h4>Home & Furniture</h4>}
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
                  <Link
                    to={`/category/${p.category?._id}/${p.subCategory?._id}`}
                  >
                    <img
                      src={`https://ecommerce-app-1-igf3.onrender.com${p.image[0]}`}
                      alt={p.name}
                    />
                  </Link>
                  <div className="text-center mt-2">
                    <p className="fw-semibold small mb-1">{p.name}</p>
                    <p className="text-success fw-bold mb-0">₹{p.price}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {showScroll && (
        <div className="mt-4">
          {loading ? (
            <div className="hf-slider">
              {Array.from({ length: 7 }).map((_, i) => (
                <div className="hf-card" key={i}>
                  {skeletonBlock("100%", 150)}
                  {skeletonLine("80%", 14)}
                  {skeletonLine("40%", 14)}
                </div>
              ))}
            </div>
          ) : (
            <RecentlyViewed />
          )}
        </div>
      )}

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
