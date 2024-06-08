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

/**
 * PAGE: Shop
 * PURPOSE: Displays the product catalog with filtering and sorting options, allows adding products to cart, and shows a popup notification.
 *
 * STATE:
 *  - showPopup (boolean): Controls the visibility of the popup notification.
 *  - popupImage (string): URL of the image displayed in the popup.
 *  - popupName (string): Name of the product displayed in the popup.
 *  - products (array): The full list of product objects fetched from the server.
 *  - filteredProducts (array): The list of product objects after applying filters and sorting.
 *  - loading (boolean): Indicates whether products are being loaded.
 *  - sortOption (object): Stores the current sorting option (e.g., { price: -1 } for descending price).
 *  - filterOption (object): Stores the current filter values (e.g., { name: 'rice' }).
 *  - activeSort (object or null): Stores the currently active sorting key and order.
 *
 * CONTEXT:
 *  - CartContext: Used to access the `addToCart` function to add products to the cart.
 *  - AuthContext: Used to access the user's authentication token.
 *
 * USAGE:
 *  - Renders the main shopping page where users can browse and select products.
 */

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

  /**
   * useEffect (for smooth scrolling):
   * - Initializes and configures the Lenis smooth scrolling library.
   * - This effect runs only once when the component mounts.
   */
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  /**
   * useEffect (for fetching products):
   * - Fetches the product data from the backend API when the component mounts.
   * - Updates the `products` and `filteredProducts` state with the fetched data.
   * - Sets `loading` to `false` after the data is fetched.
   * - This effect has a dependency on the `token` to re-fetch data if the user's authentication changes.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/customer/getProductListings`,
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

  /**
   * useEffect (for filtering and sorting):
   * - Filters and sorts the `products` array based on the `filterOption` and `sortOption` states.
   * - Updates the `filteredProducts` state with the resulting array.
   * - This effect runs whenever `filterOption`, `sortOption`, or `products` change.
   */
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

  // --- Event Handlers ---
  /** handleClosePopup: Hides the popup notification. */
  const handleClosePopup = () => {
    setShowPopup(false);
  };

  /** handleAddToCart: Adds the selected product to the cart and shows the popup. */
  const handleAddToCart = (product) => {
    addToCart(product);
    setShowPopup(true);
    setPopupImage(product.imageUrl);
    setPopupName(product.name);
  };

  /** handleSort: Sets the sorting option based on the clicked button. */
  const handleSort = (key, order) => {
    setActiveSort({ key, order });
    setSortOption({ [key]: order === "Ascending" ? 1 : -1 });
  };

  /** handleFilter: Updates the filter options based on user input. */
  const handleFilter = (key, value) => {
    setFilterOption((prev) => ({ ...prev, [key]: value }));
  };

  /** handleReset: Clears all filter and sorting options. */
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
