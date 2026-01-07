import './App.css';
import "react-loading-skeleton/dist/skeleton.css";
import Nav from './component/Nav';
import { Route, Routes } from 'react-router-dom';
import SingUp from './component/SingUp';
import Login from './component/Login';
import Home from './component/Home';
import Cart from './component/Cart';
import { createContext, useEffect, useState } from 'react';
import Search from './component/Search';
import Fashion from './component/Fashion';
import CODCheckout from './component/CODCheckout';
import OrderSuccess from './component/OrderSuccess';
import Footer from './component/Footer';
import CategoryProducts from "./component/CategoryProducts";
import ProductDetail from './component/ProductDetail';

export const cartcontext = createContext();

function App() {
  const [cartItems, setCartItems] = useState([]);

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
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
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

  // Save cart to localStorage on changes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  return (
    <cartcontext.Provider value={{ cartItems, setCartItems, addToCart }}>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SingUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/search' element={<Search />} />
         <Route path='/fashion' element={<Fashion />} />
        <Route path="/checkout" element={<CODCheckout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/category/:mainCategory" element={<CategoryProducts />} />
        <Route path="/category/:mainCategory/:subCategory" element={<CategoryProducts />} />
        <Route path="/product/:id" element={<ProductDetail />} />

      </Routes>
      <Footer />
    </cartcontext.Provider>
  );
}

export default App;

