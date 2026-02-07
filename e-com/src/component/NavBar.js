import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaAngleDown,
  FaUser,
  FaBox,
  FaSignOutAlt,
} from "react-icons/fa";
import { cartcontext } from "../App";
import { AuthContext } from "../App";
import { CategoryContext } from "../App";

function NavBar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [mobileCat, setMobileCat] = useState(null); // ⭐ mobile drawer state

  const { user, setUser } = useContext(AuthContext);
  const { cartItems, setCartItems } = useContext(cartcontext);
  const { mainCategories, subCategories } = useContext(CategoryContext);

  const navigate = useNavigate();
  const [loginMenu, setLoginMenu] = useState(false);

  /* ================= LOGOUT ================= */
  const logout = async () => {
    setCartItems([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoginMenu(false);
    navigate("/");
  };

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?query=${search}`);
      setSearch("");
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://ecommerce-app-1-igf3.onrender.com/search?query=${search}`,
        );
        const data = await res.json();
        setSuggestions(data.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestions();
  }, [search]);

  return (
    <div>
      {/* ================= HEADER ================= */}
      <header className="bg-white lg:px-28 md:px-36 py-2 relative z-50">
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
          <div className="flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setLoginMenu(true)}
              onMouseLeave={() => setLoginMenu(false)}
            >
              {!user ? (
                <div className="flex items-center gap-1 text-lg hover:!text-blue-600 font-semibold text-black">
                  <Link
                    to="/login"
                    className="no-underline text-black hover:!text-blue-600"
                  >
                    Login
                  </Link>

                  <FaAngleDown
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoginMenu(!loginMenu);
                    }}
                    className={`cursor-pointer transition-transform duration-200 ${
                      loginMenu ? "rotate-180" : ""
                    }`}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setLoginMenu(!loginMenu)}
                  className="flex items-center gap-1 text-lg font-semibold"
                >
                  Hi, {user.name}
                  <FaAngleDown
                    className={`transition-transform duration-200 ${
                      loginMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {loginMenu && (
                <div className="absolute left-1/2 -translate-x-1/2 w-56 bg-white shadow-2xl border rounded-md z-50">
                  {!user && (
                    <div className="flex justify-between items-center px-3 py-3 border-b">
                      <span>New customer?</span>
                      <Link
                        to="/signup"
                        className="text-blue-600 font-bold no-underline"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}

                  <Link
                    to={user ? "/profile" : "/login"}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 no-underline text-gray-700"
                  >
                    <FaUser /> My Profile
                  </Link>

                  <Link
                    to={user ? "/orders" : "/login"}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 no-underline text-gray-700"
                  >
                    <FaBox /> Orders
                  </Link>

                  <Link
                    to={user ? "/watchlist" : "/login"}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 no-underline text-gray-700"
                  >
                    <FaHeart /> Wishlist
                  </Link>

                  {user && (
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 border-t hover:bg-red-50"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-xl md:text-2xl text-gray-700 hover:text-blue-500" />
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {cartItems.length}
              </span>
            </Link>
          </div>
        </div>

        {/* Search */}
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

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-80 overflow-y-auto z-[9999]">
                {suggestions.map((p, index) => (
                  <Link
                    key={p._id}
                    to={`/product/${p.category?._id}/${p.subCategory?._id}/${p._id}`}
                    onClick={() => {
                      setSearch("");
                      setSuggestions([]);
                    }}
                    className={`flex items-center px-4 py-3 text-gray-800 no-underline hover:bg-blue-50 transition ${
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

      {/* ================= CATEGORY BAR ================= */}
      <div className="bg-white shadow-sm py-3 md:my-4">
        {/* ================= MOBILE (scroll + bottom drawer) ================= */}
        <div className="flex md:hidden gap-6 px-4 my-2 overflow-x-auto">
          {mainCategories.map((cat) => (
            <div
              key={cat._id}
              className="flex-shrink-0 w-24 flex flex-col items-center"
              onClick={() => setMobileCat(cat)} // 👉 open drawer
            >
              {cat.image && (
                <img
                  src={`https://ecommerce-app-1-igf3.onrender.com${cat.image}`}
                  alt={cat.name}
                  className="h-12 mb-2 object-contain"
                />
              )}

              <div className="flex items-center gap-1 text-sm font-semibold hover:text-blue-600 text-gray-800">
                <span className="text-center">{cat.name}</span>

                <FaAngleDown
                  className={`transition-transform duration-200 ${
                    openId === cat._id ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP (no scroll + hover dropdown) ================= */}
        <div className="hidden md:flex max-w-7xl mx-auto flex-wrap justify-center gap-12 lg:gap-16">
          {mainCategories.map((cat) => (
            <div
              key={cat._id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setOpenId(cat._id)}
              onMouseLeave={() => setOpenId(null)}
            >
              {cat.image && (
                <img
                  src={`https://ecommerce-app-1-igf3.onrender.com${cat.image}`}
                  alt={cat.name}
                  className="h-16 mb-2 object-contain"
                />
              )}

              <div className="flex items-center gap-1 font-semibold hover:text-blue-600 text-gray-800">
                <span
                  onClick={() => navigate(`/category/${cat._id}`)}
                  className="cursor-pointer"
                >
                  {cat.name}
                </span>

                <FaAngleDown
                  className={`transition-transform duration-200  ${
                    openId === cat._id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Desktop dropdown */}
              {openId === cat._id && (
                <div className="absolute top-20 mt-3 left-1/2 -translate-x-1/2 w-56 bg-white shadow-xl rounded-xl p-2 z-50">
                  {subCategories
                    .filter((sub) => sub.mainCategory?._id === cat._id)
                    .map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/category/${cat._id}/${sub._id}`}
                        className="block px-4 py-2 font-medium text-gray-800 no-underline hover:bg-blue-100 rounded"
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

      {/* ================= MOBILE CATEGORY DRAWER ================= */}
      {mobileCat && (
        <div className="fixed inset-0 bg-black/40 z-[9999] flex items-end md:hidden">
          <div className="bg-white w-full rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto animate-slideUp">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-3">
              <Link
                to={`/category/${mobileCat._id}`}
                onClick={() => setMobileCat(null)}
                className="text-lg font-semibold text-black no-underline hover:text-blue-600"
              >
                {mobileCat.name}
              </Link>

              <button
                onClick={() => setMobileCat(null)}
                className="text-red-500 font-semibold"
              >
                Close ✕
              </button>
            </div>

            {/* Subcategories */}
            {subCategories
              .filter((sub) => sub.mainCategory?._id === mobileCat._id)
              .map((sub) => (
                <Link
                  key={sub._id}
                  to={`/category/${mobileCat._id}/${sub._id}`}
                  onClick={() => setMobileCat(null)}
                  className="block px-3 py-3 rounded-lg text-gray-800 font-medium no-underline hover:bg-blue-100"
                >
                  {sub.name}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
