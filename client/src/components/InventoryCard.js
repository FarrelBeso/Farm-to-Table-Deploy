import axios from "axios";
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Card({ product }) {
  const [quantity, setQuantity] = useState(product.quantity);

  const { token } = useContext(AuthContext);

  const handleUpdate = async (e) => {
    if (quantity < 0 || isNaN(quantity)) {
      alert("Please input number of stocks!");
      return; // Prevent further execution if not all fields are filled
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/admin/updateStock`,
        {
          productId: product._id,
          quantity: quantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Stock updated!");
      window.location.reload(); // refresh page to get current data
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[470px] w-[270px] bg-[#F2F2F2] rounded-2xl flex flex-col p-2 border-2 border-white hover:border-black">
      <div className="h-[230px] w-full object-cover rounded-2xl overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="flex flex-col gap-1 p-2">
        <span className="font-bold text-xl overflow-hidden whitespace-nowrap text-ellipsis">
          {product.name}
        </span>
        <div className="flex justify-between items-center">
          <div className="bg-white p-1 rounded-md text-sm w-16 flex justify-center">
            {product.type === 1 ? "Crop" : "Poultry"}
          </div>
          <div className="mr-1 text-sm font-bold">
            Stock: {product.quantity}
          </div>
        </div>

        <p className="h-12 w-full overflow-hidden text-ellipsis line-clamp-3 text-sm text-[12px] leading-4">
          {product.description}
        </p>
        <div className="flex gap-1 items-end mb-1">
          <div className="text-xl font-bold">PHP</div>
          <div className="text-4xl font-bold">{product.price}</div>
          <div className="font-bold">/ piece</div>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            max="999999999999"
            step="1"
            value={quantity}
            // onChange={handleProductStockChange} // Update quantity state on change
            onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value)))} // Update quantity state on change
            className="p-2 pl-4 rounded-xl w-20"
          />
          <button
            className="rounded-xl bg-[#40573C] text-white px-4 w-full mx-auto text-md font-bold"
            onClick={handleUpdate}
          >
            {" "}
            Update stock
          </button>
        </div>
      </div>
    </div>
  );
}
