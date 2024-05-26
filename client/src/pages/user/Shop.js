import "react-loading-skeleton/dist/skeleton.css";
import Card from "../../components/Card";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Popup from "../../components/Popup";
import SkeletonCard from "../../components/SkeletonCard";
import { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Lenis from "@studio-freight/lenis";

import IMAGE from "../../assets/shop/empty.png";
import BG from "../../assets/shop/bg-wheat.png";

export default function Shop() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupImage, setPopupImage] = useState("");
  const [popupName, setPopupName] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState();
  const [filterOption, setFilterOption] = useState({});
  const [activeSort, setActiveSort] = useState(null);
  const filterRef = useRef(null);

  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3001/customer/getProductListings",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched products:", data);
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error("Error fetching products:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  useEffect(() => {
    let filtered = [...products];

    if (filterOption.name) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filterOption.name.toLowerCase())
      );
    }

    if (sortOption) {
      const [key, order] = Object.entries(sortOption)[0];
      filtered.sort((a, b) => {
        if (order === 1) return a[key] > b[key] ? 1 : -1;
        else return a[key] < b[key] ? 1 : -1;
      });
    }

    setFilteredProducts(filtered);
  }, [filterOption, sortOption, products]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setShowPopup(true);
    setPopupImage(product.imageUrl);
    setPopupName(product.name);
  };

  const handleSort = (key, order) => {
    setActiveSort({ key, order });
    setSortOption({ [key]: order === "Ascending" ? 1 : -1 });
  };

  const handleFilter = (key, value) => {
    setFilterOption((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilterOption({});
    setSortOption(null);
    setActiveSort(null);
    filterRef.current.value = "";
  };

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <div className="main-container flex flex-col sm:flex-row flex-grow pt-3">
        <div className="filter-container w-5/6 sm:w-[275px] h-[780px] p-6 m-12 mt-0 bg-[#F2F2F2] rounded-2xl flex-shrink-0 sm:sticky sm:top-36">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black mb-2">SEARCH</h1>
            <input
              type="text"
              placeholder="Name"
              className="bg-white text-xl rounded-lg w-full p-4"
              onChange={(e) => handleFilter("name", e.target.value)}
              ref={filterRef}
            />
          </div>
          <div className="flex flex-col gap-2 mt-6">
            <h1 className="text-2xl font-black mb-2">SORT BY</h1>
            <button
              className={`bg-white text-xl rounded-lg w-full p-4 py-3  flex items-center gap-2 transition-colors ease-out ${
                activeSort?.key === "name" && activeSort?.order === "Ascending"
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleSort("name", "Ascending")}
            >
              <FaArrowUp /> Name Ascending
            </button>
            <button
              className={`bg-white text-xl rounded-lg w-full p-4 py-3  flex items-center gap-2 transition-colors ease-out ${
                activeSort?.key === "price" && activeSort?.order === "Ascending"
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleSort("price", "Ascending")}
            >
              <FaArrowUp />
              Price Ascending
            </button>

            <button
              className={`bg-white text-xl rounded-lg w-full p-4  py-3 flex items-center gap-2 transition-colors ease-out ${
                activeSort?.key === "type" && activeSort?.order === "Ascending"
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleSort("type", "Ascending")}
            >
              <FaArrowUp /> Type Ascending
            </button>
            <button
              className={`bg-white text-lg rounded-lg w-full p-4 py-3  flex items-center gap-2 transition-colors ease-out ${
                activeSort?.key === "quantity" &&
                activeSort?.order === "Ascending"
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleSort("quantity", "Ascending")}
            >
              <FaArrowUp /> Quantity Ascending
            </button>
            <button
              className={`bg-white text-xl rounded-lg w-full p-4 py-3  flex items-center gap-2  transition-colors ease-out mt-4 ${
                activeSort?.key === "name" && activeSort?.order === "Descending"
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleSort("name", "Descending")}
            >
              <FaArrowDown /> Name Descending
            </button>
            <button
              className={`bg-white text-xl rounded-lg w-full p-4 py-3  flex items-center gap-2 transition-colors ease-out ${
                activeSort?.key === "price" &&
                activeSort?.order === "Descending"
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleSort("price", "Descending")}
            >
              <FaArrowDown />
              Price Descending
            </button>
            <button
              className={`bg-white text-xl rounded-lg w-full p-4 py-3  flex items-center gap-2 transition-colors ease-out ${
                activeSort?.key === "type" && activeSort?.order === "Descending"
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleSort("type", "Descending")}
            >
              <FaArrowDown />
              Type Descending
            </button>
            <button
              className={`bg-white text-lg rounded-lg w-full p-4  py-3 flex items-center gap-2  transition-colors ease-out ${
                activeSort?.key === "quantity" &&
                activeSort?.order === "Descending"
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleSort("quantity", "Descending")}
            >
              <FaArrowDown /> Quantity Descending
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mt-4"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        </div>
        <div className="content-container p-6 pt-0 h-full w-full overflow-y-auto flex flex-col items-center sm:items-start">
          <h1 className="font-black text-6xl mb-6">OUR PRODUCTS</h1>

          {loading ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : filteredProducts.length == 0 ? (
            <div className="w-full flex flex-col items-center justify-center mt-20 lg:pr-48">
              <img src={IMAGE} alt="No product" />
              <span className="font-semibold">Oops! No products found.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  product={product}
                  addToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Popup
        show={showPopup}
        onClose={handleClosePopup}
        image={popupImage}
        title={popupName}
      />

      <Footer />

      <img
        src={BG}
        alt=""
        className="fixed -z-20 w-[500px] bottom-12 right-5 opacity-30"
      />
    </div>
  );
}
