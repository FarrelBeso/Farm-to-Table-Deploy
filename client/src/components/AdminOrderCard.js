import { FaRegCircleXmark } from "react-icons/fa6";
import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

// TODO: connect to db

export default function AdminOrderCard({ users }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { token } = useContext(AuthContext);

  const openModal = (index) => {
    setShowModal(true);
    setSelectedIndex(index);
  };

  function getTotal(products) {
    let total = 0;
    products.forEach((product) => {
      total += product.count * product.price;
    });
    return total;
  }

  const confirmOrder = async (id) => {
    setShowModal(false);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/confirmOrder`,
        { orderId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.reload(); // refresh page to get current data
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Insufficient stock for one or more items in the order.");
    }
  };

  const getOverallSales = () => {
    let total = 0;
    if (
      selectedIndex !== null &&
      users[selectedIndex] &&
      users[selectedIndex].products
    ) {
      users[selectedIndex].products.forEach((product) => {
        total += product.count * product.price;
      });
    }
    return total;
  };

  const cancelOrder = async (id) => {
    setShowModal(false);
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/cancelOrder`,
        { orderId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error canceling order:", error);
    }
    window.location.reload(); // refresh page to get current data
  };

  return (
    <div className="list-container mt-8 flex flex-col gap-2 h-full">
      {users.map((user, i) => {
        return (
          <div
            className="list-container mt-8 flex flex-col gap-2 h-full cursor-pointer"
            onClick={() => openModal(i)}
            key={i}
          >
            <div className="w-full h-16 rounded-xl px-4 py-2">
              <div className="flex h-full items-center gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="font-bold">{user.name}</h1>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-end gap-1">
                    <div className="font-light">
                      (
                      {new Date(user.dateTimeOrdered).toLocaleDateString(
                        "default",
                        { month: "long", day: "numeric", year: "numeric" }
                      )}
                      )
                    </div>
                  </div>
                </div>
                <div className="spacer mx-auto"></div>
                <div className="flex flex-col gap-1">
                  <h1 className="font-bold">
                    Total - P{getTotal(user.products)}
                  </h1>
                </div>
                <div className="flex flex-col gap-1 rounded-xl px-4 py-2 font-black bg-[#ffc64d]">
                  <h1>Pending</h1>
                </div>
              </div>
            </div>
            {user.products.map((product, key) => {
              return (
                <div className="w-full h-24 bg-[#EEDBDB] rounded-xl px-4 py-2">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-4">
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="object-cover w-20 h-20 rounded-xl"
                      />
                      <h1 className="font-black">{product.name}</h1>
                    </div>

                    <div className="spacer mx-auto"></div>

                    <div className="flex bg-white rounded-xl px-4 py-2 justify-between items-center">
                      <div className="flex items-end gap-1">
                        <div className="font-black">x{product.count}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      {showModal && selectedIndex !== null && (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Order Information</h3>
                  <button
                    className="p-1 ml-16 text-black float-right text-3xl"
                    onClick={() => setShowModal(false)}
                  >
                    <FaRegCircleXmark />
                  </button>
                </div>
                <div className="relative p-6 flex-auto border-b border-solid border-blueGray-200 rounded-t">
                  <h1 className="font-bold">
                    Delivery Information{" "}
                    <span className="font-light">
                      {" "}
                      (
                      {new Date(
                        users[selectedIndex].dateTimeOrdered
                      ).toLocaleDateString("default", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      )
                    </span>
                  </h1>
                  <p className="font-medium">{users[selectedIndex].name}</p>
                  <p className="font-medium">{users[selectedIndex].email}</p>
                  <p className="font-medium">{users[selectedIndex].address}</p>
                </div>
                <div className="relative p-6 flex-auto border-b border-solid border-blueGray-200 rounded-t">
                  <h1 className="font-bold">
                    {users[selectedIndex].products.length === 1
                      ? "Order"
                      : "Orders"}
                  </h1>
                  {users[selectedIndex].products.map((product, key) => {
                    return (
                      <div className="w-full h-24 px-4 py-2 ">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt=""
                            className="object-cover w-20 h-20"
                          />
                          <div className="flex flex-col gap-1">
                            <h1 className="font-black">{product.name}</h1>
                            <h1 className="font-regular">{product.type}</h1>
                          </div>

                          <div className="spacer mx-auto"></div>

                          <div className="flex flex-col items-end gap-1">
                            <div className="font-regular">x{product.count}</div>
                            <div className="font-semibold">
                              P{product.count * product.price}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center relative p-6 flex-auto">
                  <h1 className="font-bold">Order Total </h1>
                  <div className="spacer mx-auto"></div>
                  <h1 className="font-bold">P{getOverallSales()}</h1>
                </div>
                <div className="flex items-center justify-end p-6">
                  <div>
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => cancelOrder(users[selectedIndex]._id)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-[#40573C] text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => confirmOrder(users[selectedIndex]._id)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </div>
  );
}
