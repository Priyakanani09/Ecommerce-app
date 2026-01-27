import "./App.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Route, Routes } from "react-router-dom";
import { createContext, useEffect, useState } from "react";

import SingUp from "./component/SingUp";
import Login from "./component/Login";
import Home from "./component/Home";
import Cart from "./component/Cart";
import Search from "./component/Search";
import Fashion from "./component/Fashion";
import CODCheckout from "./component/CODCheckout";
import OrderSuccess from "./component/OrderSuccess";
import Footer from "./component/Footer";
import CategoryProducts from "./component/CategoryProducts";
import ProductDetail from "./component/ProductDetail";
import NavBar from "./component/NavBar";

export const cartcontext = createContext();
export const AuthContext = createContext();
export const CategoryContext = createContext();

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  /* ================= GET CART (ONLY HERE) ================= */
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  fetch(`https://ecommerce-app-1-igf3.onrender.com/getcart`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setCartItems(data?.items || []);
    });
}, [user]); // 👈 dependency add

  /* ================= ADD TO CART ================= */
const addToCart = async (productId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch(
      "https://ecommerce-app-1-igf3.onrender.com/addtocart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Add to cart failed");
      return;
    }

    setCartItems(data.items || []);
  } catch (error) {
    console.log("Add to cart error:", error);
  }
};



  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const mainRes = await fetch(
          `https://ecommerce-app-1-igf3.onrender.com/main-categories`,
        );
        const mainData = await mainRes.json();
        setMainCategories(mainData.categories || []);

        const subRes = await fetch(
          `https://ecommerce-app-1-igf3.onrender.com/sub-categories`,
        );
        const subData = await subRes.json();
        setSubCategories(subData.subCategories || []);
      } catch (err) {
        console.error("Category fetch error", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <cartcontext.Provider value={{ cartItems, setCartItems, addToCart }}>
        <CategoryContext.Provider value={{ mainCategories, subCategories }}>
          <NavBar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SingUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<Search />} />
            <Route path="/fashion" element={<Fashion />} />
            <Route path="/checkout" element={<CODCheckout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route
              path="/category/:mainCategory"
              element={<CategoryProducts />}
            />
            <Route
              path="/category/:mainCategory/:subCategory"
              element={<CategoryProducts />}
            />
            <Route
              path="/product/:mainCategory/:subCategory/:id"
              element={<ProductDetail />}
            />
          </Routes>

          <Footer />
        </CategoryContext.Provider>
      </cartcontext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
