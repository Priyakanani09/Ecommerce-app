import './App.css';
import Nav from './component/Nav';
import { Route, Routes } from 'react-router-dom';
import SingUp from './component/SingUp';
import Login from './component/Login';
import Home from './component/Home';
import Mobile from './component/Mobile';
import Cart from './component/Cart';
import { createContext, useEffect, useState } from 'react';
import Search from './component/Search';
import Menwear from './component/Menwear';
import Womenwear from './component/Womenwear';
import Menfootwear from './component/Menfootwear';
import Womenfootwear from './component/Womenfootwear';
import TvsAppliances from './component/TvsAppliances';
import Electronics from './component/Electronics';
import HomeFurniture from './component/HomeFurniture';
import Grocery from './component/Grocery';
import Beautyproduct from './component/Beautyproduct';
import Fashion from './component/Fashion';
import CODCheckout from './component/CODCheckout';
import OrderSuccess from './component/OrderSuccess';
import Footer from './component/Footer';



export const cartcontext = createContext();

function App() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      const saved = localStorage.getItem(`cart_${user._id}`);
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    }
  }, []);

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  return (
    <>
    <cartcontext.Provider value={{ cartItems, setCartItems, addToCart }}>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/mobile' element={<Mobile />} />
        <Route path='/signup' element={<SingUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/search' element={<Search />} />
        <Route path='/fashion' element={<Fashion />} />
        <Route path='/fashion/male' element={<Menwear />} />
        <Route path='/fashion/female' element={<Womenwear />} />
        <Route path='/fashion/MenFootwear' element={<Menfootwear />} />
        <Route path='/fashion/WomenFootwear' element={<Womenfootwear />} />
        <Route path='/fashion/BeautyProducts' element={<Beautyproduct />} />
        <Route path='/TvsAppliances' element={<TvsAppliances />} />
        <Route path='/Electronics' element={<Electronics />} />
        <Route path='/HomeFurniture' element={<HomeFurniture />} />
        <Route path='/Grocery' element={<Grocery />} />
        <Route path="/checkout" element={<CODCheckout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      <Footer />
    </cartcontext.Provider>
  </>
  );
}

export default App;