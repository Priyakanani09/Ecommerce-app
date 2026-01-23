import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

function Breadcrumbs({
  mainCategory,
  subCategory,
  mainCategoryId,
  subCategoryId,
  productName,
}) {
  return (
    <nav className="mb-4 flex items-center md:gap-2 gap-1 font-medium text-[10px]  md:text-[14px] text-gray-600">
      <Link
        to="/"
        className="no-underline text-gray-900 font-semibold hover:text-blue-500"
      >
        Home
      </Link>

      {mainCategory && (
        <>
          <FaChevronRight className="text-gray-400 text-[10px] md:text-xs" />
          <Link
            to={`/category/${mainCategoryId}`}
            className="no-underline text-gray-800 font-bold hover:text-blue-500"
          >
            {mainCategory || "Loading..."}
          </Link>
        </>
      )}

      {subCategory && (
        <>
          <FaChevronRight className="text-gray-400 text-[10px] md:text-xs" />
          <Link
            to={`/category/${mainCategoryId}/${subCategoryId}`}
            className="no-underline text-gray-800 font-bold hover:text-blue-500"
          >
            {subCategory || "Loading..."}
          </Link>
        </>
      )}

      {productName && (
        <>
          <FaChevronRight className="text-gray-400 text-[10px] md:text-xs" />
          <span className="text-muted">{productName}</span>
        </>
      )}
    </nav>
  );
}

export default Breadcrumbs;
