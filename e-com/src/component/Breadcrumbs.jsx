import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

function Breadcrumbs({ mainCategory, subCategory }) {
  return (
    <nav className="text-sm mb-4 flex items-center gap-2 text-gray-600 font-medium">
      {/* HOME */}
      <Link
        to="/"
        className="no-underline text-gray-900 font-semibold hover:text-blue-500"
      >
        Home
      </Link>

      {mainCategory && (
        <>
          <FaChevronRight className="text-gray-400 text-xs" />

          <Link
            to={`/${mainCategory.toLowerCase()}`}
            className="no-underline text-gray-900 font-semibold capitalize hover:text-blue-500"
          >
            {mainCategory}
          </Link>
        </>
      )}

      {subCategory && (
        <>
          <FaChevronRight className="text-gray-400 text-xs" />

          <span className="text-gray-800 font-bold capitalize">
            {subCategory}
          </span>
        </>
      )}
    </nav>
  );
}

export default Breadcrumbs;
