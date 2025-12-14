import React from "react";
import "../App.css";

const ProductSkeleton = () => {
  return (
    <div className="col-md-3 mb-3">
      <div className="card p-3 h-100">
        <div className="skeleton skeleton-img mb-3"></div>
        <div className="skeleton skeleton-text mb-2"></div>
        <div className="skeleton skeleton-text small mb-2"></div>
        <div className="skeleton skeleton-text small mb-3"></div>
        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;