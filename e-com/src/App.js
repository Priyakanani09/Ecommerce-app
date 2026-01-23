import "./App.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Route, Routes } from "react-router-dom";
import SingUp from "./component/SingUp";
import Login from "./component/Login";
import Home from "./component/Home";
import Cart from "./component/Cart";
import { createContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Load cart items for logged-in user
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      const saved = localStorage.getItem(`cart_${user._id}`);
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    }
  }, []);

  // Add item to cart
  const addToCart = (product) => {
    const exist = cartItems.find((item) => item._id === product._id);

    let updatedCart;
    if (exist) {
      updatedCart = cartItems.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item,
      );
    } else {
      updatedCart = [...cartItems, { ...product, qty: 1 }];
    }

    setCartItems(updatedCart);

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedCart));
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const mainRes = await fetch(
          "https://ecommerce-app-1-igf3.onrender.com/main-categories",
        );
        const mainData = await mainRes.json();
        setMainCategories(mainData.categories || []);

        const subRes = await fetch(
          "https://ecommerce-app-1-igf3.onrender.com/sub-categories",
        );
        const subData = await subRes.json();
        setSubCategories(subData.subCategories || []);
      } catch (err) {
        console.error("Category fetch error", err);
      }
    };
    fetchCategories();
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems]);

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
