import { useEffect, useState } from "react";

const BASE_URL = "https://ecommerce-app-1-igf3.onrender.com";

function ImageGallery({ images }) {
  const [mainImg, setMainImg] = useState(images?.[0]);

  useEffect(() => {
    if (images?.length) {
      setMainImg(images[0]);
    }
  }, [images]);

  return (
    <div className="d-flex">
      <div>
        {images.map((img, i) => (
          <img
            key={i}
            src={`${BASE_URL}${img}`}
            width={60}
            className="mb-2 border"
            style={{ cursor: "pointer" }}
            onClick={() => setMainImg(img)} // 👈 relative path
            alt="thumb"
          />
        ))}
      </div>

      <img
        src={`${BASE_URL}${mainImg}`} // 👈 SAME BASE
        width={400}
        className="ms-4 border rounded"
        alt="main"
      />
    </div>
  );
}


export default ImageGallery;
