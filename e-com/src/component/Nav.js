import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaAngleDown } from "react-icons/fa";
import "../App.css";
import { cartcontext } from "../App";

function Nav() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItems } = useContext(cartcontext);

  // ✅ SAFE USER FETCH
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    user = null;
  }

  // ✅ SAFE LOGOUT
  const logout = () => {
    if (user && user._id) {
      localStorage.removeItem(`cart_${user._id}`);
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?query=${search}`);
      setSearch("");
    }
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="bg-white py-1 md:px-36 flex flex-col md:flex-row items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
          <Link to="/">
            <img
              src={require("./img/logo1.png")}
              alt="logo"
              className="md:w-36 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-300"
            />
          </Link>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-1/2">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* LOGIN / LOGOUT */}
        <div className="flex items-center justify-center gap-3">
          {user ? (
            <button
              onClick={logout}
              className="text-gray-800 text-[18px] font-semibold hover:text-blue-500 bg-transparent border-0"
            >
              Logout ({user.name || user.email})
            </button>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-gray-800 text-[18px] no-underline font-semibold hover:text-blue-500"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="text-gray-800 text-[18px] no-underline font-semibold hover:text-blue-500"
              >
                Login
              </Link>
            </>
          )}

          {/* CART */}
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl text-gray-700 hover:text-blue-500" />
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          </Link>
        </div>
      </header>

      {/* ================= CATEGORY BAR ================= */}
      <div className="bg-white shadow-sm py-3 md:px-40  md:my-3 flex flex-wrap items-center justify-center gap-24">
        <Link
          to="/mobile"
          className="text-gray-800 font-semibold no-underline hover:text-blue-500 flex flex-col items-center"
        >
          <img src={require("./img/Mobile.png")} alt="" />
          <span className="mt-2">Mobiles & Tablets</span>
        </Link>

        {/* FASHION DROPDOWN */}
        <div
          className="relative"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            to="/fashion"
            className="text-gray-800 font-semibold no-underline hover:text-blue-500 flex flex-col items-center"
          >
            <img src={require("./img/Fashion.png")} alt="" />
            <div className="flex items-center mt-2">
              <span>Fashion</span>
              <FaAngleDown
                className={`ml-1 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          </Link>

          {open && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2  bg-white shadow-lg rounded-lg p-2 w-48 z-10">
              <Link
                to="/fashion/male"
                className="block px-3 py-1 text-gray-800 no-underline hover:bg-blue-100 rounded"
              >
                Men Wear
              </Link>
              <Link
                to="/fashion/female"
                className="block px-3 py-1 text-gray-800 no-underline hover:bg-blue-100 rounded"
              >
                Women Wear
              </Link>
              <Link
                to="/fashion/MenFootwear"
                className="block px-3 py-1 text-gray-800 no-underline hover:bg-blue-100 rounded"
              >
                Men Footwear
              </Link>
              <Link
                to="/fashion/WomenFootwear"
                className="block px-3 py-1 text-gray-800 no-underline hover:bg-blue-100 rounded"
              >
                Women Footwear
              </Link>
              <Link
                to="/fashion/BeautyProducts"
                className="block px-3 py-1 text-gray-800 no-underline hover:bg-blue-100 rounded"
              >
                Beauty Products
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/TvsAppliances"
          className="text-gray-800 font-semibold no-underline hover:text-blue-500 flex flex-col items-center"
        >
          <img src={require("./img/Tv.png")} alt="" />
          <span className="mt-2">TVs & Appliances</span>
        </Link>

        <Link
          to="/Electronics"
          className="text-gray-800 font-semibold no-underline hover:text-blue-500 flex flex-col items-center"
        >
          <img src={require("./img/Electronics.png")} alt="" />
          <span className="mt-2">Electronics</span>
        </Link>

        <Link
          to="/HomeFurniture"
          className="text-gray-800 font-semibold no-underline hover:text-blue-500 flex flex-col items-center"
        >
          <img src={require("./img/Furniture.png")} alt="" />
          <span className="mt-2">Home & Furniture</span>
        </Link>

        <Link
          to="/Grocery"
          className="text-gray-800 font-semibold no-underline hover:text-blue-500 flex flex-col items-center"
        >
          <img src={require("./img/Grocery.png")} alt="" />
          <span className="mt-2">Grocery</span>
        </Link>
      </div>
    </div>
  );
}

export default Nav;
