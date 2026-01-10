import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart ,FaAngleDown } from "react-icons/fa";
import axios from "axios";
import { cartcontext } from "../App";

function Nav() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [openId, setOpenId] = useState(null);

  const { cartItems } = useContext(cartcontext);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

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
      <header className="bg-white py-1 md:px-36 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
          <Link to="/">
            <img
              src={require("./img/logo1.png")}
              alt="logo"
              className="md:w-36 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-gray-400 transition-all duration-300"
            />
          </Link>
        </div>

        <div className="relative w-1/2">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

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
        {categories.map((cat) => (
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
                className="mb-2"
              />
            )}

            {/* CATEGORY NAME */}
            <Link
            to={`/category/${cat._id}`}
            className="flex items-center text-gray-800  font-semibold hover:text-blue-500 space-x-1 no-underline"
          >
            <span>{cat.name}</span>
            <FaAngleDown
              className={`transition-transform ${
                openId === cat._id ? "rotate-180" : ""
              }`}
            />
          </Link>

            {/* SUBCATEGORY DROPDOWN */}
            {openId === cat._id && (
              <div className="absolute mt-24 left-1/2 -translate-x-1/2 font-medium bg-white shadow-lg rounded-lg p-2 w-52 z-10">
                {subCategories
                  .filter((sub) => sub.mainCategory?._id === cat._id)
                  .map((sub) => (
                    <Link
                      key={sub._id}
                      to={`/category/${cat._id}/${sub._id}`}
                      className="block px-3 py-1 text-gray-800 no-underline hover:bg-blue-100 rounded"
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
  );
}

export default Nav;
