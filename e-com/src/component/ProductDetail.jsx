import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ImageGallery from "./ImageGallery";
import { cartcontext } from "../App";
import { FaShoppingCart, FaBolt } from "react-icons/fa";
import Breadcrumbs from "./Breadcrumbs";

function ProductDetail() {
  const { id, mainCategory, subCategory } = useParams();

  const [allProducts, setAllProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(cartcontext);
  const [mainCategoryName, setMainCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");

  useEffect(() => {
    const fetchAllProducts = async () => {
      let all = [];
      let currentPage = 1;
      let total = 1;

      while (currentPage <= total) {
        const res = await fetch(
          `https://ecommerce-app-1-igf3.onrender.com/products?page=${currentPage}`
        );
        const data = await res.json();
        all = [...all, ...data.products];
        total = data.totalPages;
        currentPage++;
      }
      setAllProducts(all);
    };

    fetchAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      const found = allProducts.find((p) => p._id === id);
      setProduct(found);
    }
  }, [id, allProducts]);

  useEffect(() => {
    const fetchCategoryNames = async () => {
      try {
        if (mainCategory) {
          const res = await fetch(
            `https://ecommerce-app-1-igf3.onrender.com/main-categories`
          );
          const data = await res.json();

          const objectMainCategory = data?.categories?.find(
            (d1) => d1._id === mainCategory
          );
          setMainCategoryName(objectMainCategory?.name);
        }

        if (subCategory) {
          const res = await fetch(
            "https://ecommerce-app-1-igf3.onrender.com/sub-categories"
          );
          const data = await res.json();

          const objectSubCategory = data?.subCategories?.find(
            (d1) => d1._id === subCategory
          );

          setSubCategoryName(objectSubCategory?.name);
        } else {
          setSubCategoryName("");
        }
      } catch (err) {
        console.error("Category name error:", err);
      }
    };

    fetchCategoryNames();
  }, [mainCategory, subCategory]);

  if (!product) return <h4 className="text-center mt-5">Loading...</h4>;

  const related = allProducts.filter(
    (p) =>
      p.subCategory?._id === product.subCategory?._id && p._id !== product._id
  );
  console.log({ related });

  const handleAddToCart = (item) => {
    addToCart(item);
    navigate("/cart");
  };

  const CODCart = (item) => {
    addToCart(item);
    navigate("/checkout");
  };

  return (
    <div className="container bg-white p-4 mt-4">
      <div className="row">
        <div className="col-md-5">
          <ImageGallery images={product.image} />
        </div>

        <div className="col-md-7">
          <Breadcrumbs
            mainCategory={mainCategoryName}
            subCategory={subCategoryName}
            mainCategoryId={mainCategory}
            subCategoryId={subCategory}
            productName={product.name}
          />

          <h3 className="font-semibold">{product.name}</h3>

          <p className=" text-gray-500 font-medium mt-2">
            {product.description}
          </p>

          <h3 className="font-semibold text-4xl mt-3">₹{product.price}</h3>

          <div className="mt-4 d-flex flex-column flex-md-row gap-3">
            <button
              className="btn btn-warning text-white px-4 d-flex align-items-center justify-content-center fw-bold gap-2 "
              onClick={() => handleAddToCart(product)}
            >
              <FaShoppingCart size={18} />
              ADD TO CART
            </button>

            <button
              className="btn btn-success fw-bold px-4 d-flex align-items-center justify-content-center gap-2"
              onClick={() => CODCart(product)}
            >
              <FaBolt size={18} />
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      <h4 className="mt-5 mb-3">Related Products</h4>

      <div className="row">
        {related.map((p) => (
          <div key={p._id} className="col-md-3 mb-3">
            <div className="card p-3 h-100">
              <Link
                to={`/product/${p.category?._id}/${p.subCategory?._id}/${p._id}`}
                key={p._id}
              >
                {p.image && p.image.length > 0 && (
                  <div
                    id={`carousel-${p._id}`}
                    className="carousel slide"
                    data-bs-ride="carousel"
                    data-bs-interval="3000"
                    data-bs-pause="hover"
                  >
                    <div className="carousel-indicators custom-indicators">
                      {p.image.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          data-bs-target={`#carousel-${p._id}`}
                          data-bs-slide-to={index}
                          className={index === 0 ? "active" : ""}
                          aria-current={index === 0 ? "true" : "false"}
                          aria-label={`Slide ${index + 1}`}
                        ></button>
                      ))}
                    </div>

                    <div className="carousel-inner">
                      {p.image.map((img, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${
                            index === 0 ? "active" : ""
                          }`}
                        >
                          <img
                            src={`https://ecommerce-app-1-igf3.onrender.com${img}`}
                            className="d-block w-100"
                            alt={`${p.name} ${index + 1}`}
                            style={{
                              height: "250px",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Link>
              <div className="card-body text-center">
                <h5>{p.name}</h5>
                <p className="text-muted">{p.description}</p>
                <p className="fw-bold text-primary">₹{p.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetail;
