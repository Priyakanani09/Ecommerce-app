import { useEffect, useState } from "react";
import "../App.css";

const BASE_URL = "https://ecommerce-app-1-igf3.onrender.com";

function ImageGallery({ images = [] }) {
  const [mainImg, setMainImg] = useState(images[0]);

  useEffect(() => {
    if (images.length) {
      setMainImg(images[0]);
    }
  }, [images]);

  if (!images.length) return null;

  return (
    <div className="row g-3 align-items-start">

      <div className="col-12 col-md-10 order-1 order-md-2 text-center d-flex justify-content-center">
        <img
          src={`${BASE_URL}${mainImg}`}
          className="img-fluid main-img rounded border"
          alt="main"
        />
      </div>

      <div className="col-12 col-md-2 order-2 order-md-1 my-4 d-flex flex-row flex-md-column gap-2 justify-content-center">
        {images.map((img, i) => (
          <img
            key={i}
            src={`${BASE_URL}${img}`}
            className="img-thumbnail thumb-img"
            onClick={() => setMainImg(img)}
            alt="thumb"
          />
        ))}
      </div>

    </div>
  );
}

export default ImageGallery;
