import InventoryCard from "../../components/InventoryCard";
import AdminNavbar from "../../components/AdminNavbar";
import Popup from "../../components/Popup";
import { useState } from "react";

export default function Shop() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupImage, setPopupImage] = useState("");
  const [popupName, setPopupName] = useState("");

  const handleButtonClick = (image, name) => {
    setShowPopup(true);
    setPopupImage(image);
    setPopupName(name);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const products = [
    {
        name: "Orange",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/2560px-Orange-Fruit-Pieces.jpg",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores cupiditate quam veniam vel fugit error explicabo quaerat ducimus doloremque nesciunt mollitia laborum eius ullam quod velit, nostrum consequuntur delectus illo.",
        type: "Fruit",
        price: 99,
        item: "piece"
    },
    {
        name: "Orange orange",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Orange-Fruit-Pieces.jpg/2560px-Orange-Fruit-Pieces.jpg",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores cupiditate quam veniam vel fugit error explicabo quaerat ducimus doloremque nesciunt mollitia laborum eius ullam quod velit, nostrum consequuntur delectus illo.",
        type: "Fruit",
        price: 299,
        item: "piece"
    },
  ]

  return (
    <div className="h-screen w-screen">
      <AdminNavbar />

      <div className="main-container flex flex-grow mt-3">
        <div className="filter-container w-[275px] h-[600px] p-6 m-12 mt-0 bg-[#F2F2F2] rounded-2xl flex-shrink-0">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black mb-2">FILTER BY</h1>
            <button className="bg-white text-xl rounded-lg w-full p-4 ">
              Name
            </button>
            <button className="bg-white text-xl rounded-lg w-full p-4 ">
              Type
            </button>
            <button className="bg-white text-xl rounded-lg w-full p-4 ">
              Price
            </button>
            <button className="bg-white text-xl rounded-lg w-full p-4 ">
              Quantity
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-6">
            <h1 className="text-2xl font-black mb-2">SORT BY</h1>
            <button className="bg-white text-xl rounded-lg w-full p-4 ">
              Ascending
            </button>
            <button className="bg-white text-xl rounded-lg w-full p-4 ">
              Descending
            </button>
          </div>
        </div>
        <div className="content-container p-6 pt-0 h-screen overflow-y-auto">
          <h1 className="font-black text-6xl mb-6">PRODUCT INVENTORY</h1>
          <div className="flex flex-wrap gap-2">
            {/* <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} />
            <Card show={handleButtonClick} /> */}
            <InventoryCard show={handleButtonClick} products={products}/>
          </div>
        </div>
      </div>
      <Popup
        show={showPopup}
        onClose={handleClosePopup}
        image={popupImage}
        title={popupName}
      />
    </div>
  );
}
