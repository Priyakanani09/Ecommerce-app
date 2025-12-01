import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import "../App.css";

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold">My E-Commerce</h4>
            <p className="">
              Your one-stop shop for the best products at amazing prices.
              Quality and customer satisfaction guaranteed.
            </p>

            <div className="d-flex gap-3 mt-3">
              <p className="text-light fs-5">
                <FaFacebook />
              </p>
              <p className="text-light fs-5">
                <FaInstagram />
              </p>
              <p className="text-light fs-5">
                <FaTwitter />
              </p>
              <p className="text-light fs-5">
                <FaYoutube />
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4 pleft">
            <h5 className="fw-bold mb-3">About</h5>
            <h6 className="text-[15px] mb-2">
              <a href="/" className="text-light text-decoration-none">
                Home
              </a>
            </h6>

            <h6 className="text-[15px] mb-2">
              <a href="/cart" className="text-light text-decoration-none">
                My Cart
              </a>
            </h6>

            <h6 className="text-[15px] mb-2 text-gray-300">
              <a href="/" className="text-light text-decoration-none">
                Products
              </a>
            </h6>

            <h6 className="text-[15px] mb-2 text-gray-300">
              <a href="/contact" className="text-light text-decoration-none">
                Contact Us
              </a>
            </h6>
          </div>

          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Customer Support</h5>
            <h6 className="text-[15px] mb-2 text-gray-300">Privacy Policy</h6>
            <h6 className="text-[15px] mb-2 text-gray-300">
              Terms & Conditions
            </h6>
            <h6 className="text-[15px] mb-2 text-gray-300">Refund Policy</h6>
            <h6 className="text-[15px] mb-2 text-gray-300">Help / FAQ</h6>
          </div>
        </div>

        <hr className="border-secondary" />

        <div className="text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} My E-Commerce. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer> 
  );
}

export default Footer;
