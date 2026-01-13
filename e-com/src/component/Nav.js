import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaAngleDown } from "react-icons/fa";
import axios from "axios";
import { cartcontext } from "../App";

function Nav() {
  const [search, setSearch] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { cartItems } = useContext(cartcontext);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?query=${search}`);
      setSearch("");
    }
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        let all = [];
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const res = await fetch(
            `https://ecommerce-app-1-igf3.onrender.com/products?page=${page}`
          );
          const data = await res.json();

          all = [...all, ...data.products];
          totalPages = data.totalPages;
          page++;
        }

        setAllProducts(all);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts
      .filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.subCategory?.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.name?.toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, 8);

    setSuggestions(filtered);
  }, [search, allProducts]);

  useEffect(() => {
    axios
      .get("https://ecommerce-app-1-igf3.onrender.com/main-categories")
      .then((res) => {
        setCategories(res.data.categories);
      })

      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("https://ecommerce-app-1-igf3.onrender.com/sub-categories")
      .then((res) => {
        setSubCategories(res.data.subCategories);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="bg-white lg:px-28 md:px-36 py-2 relative z-50">
        {/* ===== TOP BAR ===== */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={require("./img/logo1.png")}
              alt="logo"
              className="w-24 sm:w-28 md:w-32 lg:w-36 rounded-full border-2 border-transparent hover:border-gray-400 transition-all duration-300"
            />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={logout}
                className="text-sm md:text-lg font-semibold text-gray-800 hover:text-blue-500"
              >
               Hi,{user.name}  Logout
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-sm md:text-lg font-semibold no-underline text-gray-800 hover:text-blue-500"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="text-sm md:text-lg font-semibold no-underline text-gray-800 hover:text-blue-500"
                >
                  Login
                </Link>
              </>
            )}

            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-xl md:text-2xl text-gray-700  hover:text-blue-500" />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartItems.length}
              </span>
            </Link>
          </div>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div className="mt-3 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-2 md:w-[50%]">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products..."
              className="w-full border rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* 🔥 SEARCH SUGGESTION */}
            {suggestions.length > 0 && (
              <div
                className="absolute top-full left-0 w-full mt-2
               bg-white 
               rounded-xl shadow-2xl
               border border-gray-200
               max-h-80 overflow-y-auto
               z-[9999]"
              >
                {suggestions.map((p, index) => (
                  <Link
                    key={p._id}
                    to={`/product/${p.category?._id}/${p.subCategory?._id}/${p._id}`}
                    onClick={() => {
                      setSearch("");
                      setSuggestions([]);
                    }}
                    className={`flex items-center px-4 py-3
                    text-gray-800 no-underline
                    hover:bg-blue-50 transition
                    ${
                      index !== suggestions.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <FaSearch className="text-gray-400 text-sm mr-3" />
                    <span className="text-sm font-medium">{p.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= CATEGORY BAR ================= */}
        <div className="bg-white shadow-sm py-3 md:px-40 md:my-3">
          
  <div className="flex sm:overflow-y-auto md:overflow-visible md:gap-24 my-2 justify-start md:justify-center">
    {categories.map((cat) => (
      <div
        key={cat._id}
        className="relative flex-shrink-0 w-32 md:w-auto flex flex-col items-center"
        onMouseEnter={!isMobile ? () => setOpenId(cat._id) : undefined}
        onMouseLeave={!isMobile ? () => setOpenId(null) : undefined}
      >
        {cat.image && (
          <img
            src={`https://ecommerce-app-1-igf3.onrender.com${cat.image}`}
            alt={cat.name}
            className="mb-2"
          />
        )}

        {/* Category button */}
        <button
          onClick={() =>
            isMobile
              ? setOpenId(openId === cat._id ? null : cat._id)
              : null
          }
          className="flex items-center  font-semibold text-gray-800 space-x-1"
        >
          <span>{cat.name}</span>
          <FaAngleDown
            className={`transition-transform ${
              openId === cat._id ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Subcategory */}
        {openId === cat._id && (
          <div
            className={`absolute ${
              isMobile
                ? "mt-2 w-full"
                : "mt-24 left-1/2 -translate-x-1/2 w-52"
            } bg-white shadow-lg rounded-lg p-2 z-50`}
          >
            {subCategories
              .filter((sub) => sub.mainCategory?._id === cat._id)
              .map((sub) => (
                <Link
                  key={sub._id}
                  to={`/category/${cat._id}/${sub._id}`}
                  className="block px-3 py-2 font-semibold text-gray-800 no-underline hover:bg-blue-100 rounded"
                >
                  {sub.name}
                </Link>
              ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>

    </div>
  );
}

export default Nav;
