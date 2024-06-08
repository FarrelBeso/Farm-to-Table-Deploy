import AdminOrderCard from "../../components/AdminOrderCard";
import SaleReportCard from "../../components/SaleReportCard";
import IMAGE from "../../assets/shop/empty.png";
import AdminNavbar from "../../components/AdminNavbar";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { FaCircleMinus, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import Lenis from "@studio-freight/lenis";

export default function Cart() {
  const { token } = useContext(AuthContext);

  const [pendingItems, setPendingItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const [cancelledItems, setCancelledItems] = useState([]);
  const [activeStatus, setActiveStatus] = useState(0);

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

  useEffect(() => {
    const fetchPendingOrders = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const status = 0;
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/getOrders?status=${status}`,
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
          console.log("Fetched orders:", data);
          setPendingItems(data);
        } else {
          console.error("Error fetching orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchConfirmedOrders = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const earliestDate = "2020-01-01";
        const limit = 50;
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/report/getRecentSales?earliestDate=${earliestDate}&limit=${limit}`,
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
          console.log("Fetched orders:", data);
          setConfirmedItems(data);
        } else {
          console.error("Error fetching orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchCancelledOrders = async () => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const earliestDate = "2020-01-01";
        const limit = 50;
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/report/getCancelledOrders?earliestDate=${earliestDate}&limit=${limit}`,
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
          console.log("Fetched orders:", data);
          setCancelledItems(data);
        } else {
          console.error("Error fetching orders:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchPendingOrders();
    fetchConfirmedOrders();
    fetchCancelledOrders();
  }, [token]);

  return (
    <div className="h-screen w-screen">
      <AdminNavbar />

      <div className="main-container p-3 flex flex-grow mb-12">
        <div className="spacer mx-auto"></div>
        <div className="cart-container w-[800px]">
          <h1 className="font-black text-6xl">ORDERS</h1>
          <div className="flex gap-2 mt-4">
            <button
              className={`p-2 px-4 flex items-center justify-center gap-2 transition-colors ease-out rounded-full border-2 border-green-600 hover:bg-green-50 ${
                activeStatus === 0
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : ""
              }`}
              onClick={() => setActiveStatus(0)}
            >
              <FaCircleMinus />
              Pending
            </button>
            <button
              className={`p-2 px-4 flex items-center justify-center gap-2 transition-colors ease-out rounded-full border-2 border-green-600 hover:bg-green-50 ${
                activeStatus === 1
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : ""
              }`}
              onClick={() => setActiveStatus(1)}
            >
              <FaCircleCheck />
              Completed
            </button>
            <button
              className={`p-2 px-4 flex items-center justify-center gap-2 transition-colors ease-out rounded-full border-2 border-green-600 hover:bg-green-50 ${
                activeStatus === 2
                  ? "bg-green-600 hover:bg-green-600 text-white"
                  : ""
              }`}
              onClick={() => setActiveStatus(2)}
            >
              <FaCircleXmark />
              Cancelled
            </button>
          </div>
          {activeStatus === 0 ? (
            pendingItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20">
                <img src={IMAGE} alt="No product" />
                <span className="font-semibold">
                  Oops! No orders placed yet.
                </span>
              </div>
            ) : (
              <div className="mt-4 mb-10">
                <AdminOrderCard users={pendingItems} />
              </div>
            )
          ) : activeStatus === 1 ? (
            confirmedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20">
                <img src={IMAGE} alt="No product" />
                <span className="font-semibold">
                  Oops! No orders confirmed yet.
                </span>
              </div>
            ) : (
              <div className="mt-4 mb-10">
                <SaleReportCard users={confirmedItems} />
              </div>
            )
          ) : cancelledItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <img src={IMAGE} alt="No product" />
              <span className="font-semibold">
                Oops! No orders cancelled yet.
              </span>
            </div>
          ) : (
            <div className="mt-4 mb-10">
              <SaleReportCard users={cancelledItems} />
            </div>
          )}
        </div>
        <div className="spacer mx-auto"></div>
      </div>
    </div>
  );
}
