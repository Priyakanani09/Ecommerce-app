import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import "../App.css"; // CSS में overlay style डालें

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="global-overlay">
      <ClipLoader size={60} color="#36d7b7" />
    </div>
  );
};

export default LoadingOverlay;
