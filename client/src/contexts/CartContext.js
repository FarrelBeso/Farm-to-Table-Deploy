import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * CONTEXT: CartProvider
 * PURPOSE: Provides cart context and functionality (adding, removing, updating items, creating/cancelling orders) for the application.
 *
 * FUNCTIONS:
 *    - cart (array): The current items in the user's cart.
 *    - addToCart (Function): Function to add a product to the cart.
 *    - removeFromCart (Function): Function to remove a product from the cart.
 *    - updateQuantity (Function): Function to update the quantity of a product in the cart.
 *    - createOrder (Function): Function to create an order from the cart items.
 *    - cancelOrder (Function): Function to cancel a previously placed order.
 *
 * USAGE:
 *  - Wraps components that need to interact with the shopping cart.
 */

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { userEmail, userFirstName, userAddress, token } =
    useContext(AuthContext);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  /**
   * useEffect (for fetching cart data):
   * - Fetches the user's cart items from the backend when the component mounts and whenever userEmail or token changes.
   * - If userEmail is available, it makes an authorized request to get cart data.
   * - Otherwise, it resets the cart to an empty array.
   */
  useEffect(() => {
    const fetchCartItems = async () => {
      if (userEmail) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/customer/getCart?email=${userEmail}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCart(response.data.items);
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      } else {
        setCart([]);
      }
    };

    fetchCartItems();
  }, [userEmail, token, forceUpdate]);

  /**
   * addToCart:
   * - Adds a product to the cart in the backend.
   * - Updates the local cart state with the new data.
   * - Triggers a re-render to reflect changes.
   */
  const addToCart = async (product) => {
    if (!userEmail) {
      console.error("User email is not available");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/customer/addToCart`,
        { email: userEmail, product },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.items);
      setForceUpdate(forceUpdate + 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  /**
   * removeFromCart:
   * - Removes a product from the cart in the backend.
   * - Updates the local cart state with the new data.
   * - Triggers a re-render to reflect changes.
   */
  const removeFromCart = async (productId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/customer/removeFromCart`,
        { email: userEmail, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart(response.data.items);
      setForceUpdate(forceUpdate + 1);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  /**
   * updateQuantity:
   * - Updates the quantity of a product in the cart in the backend.
   * - Updates the local cart state with the new data.
   * - Triggers a re-render to reflect changes.
   */
  const updateQuantity = async (productId, quantity) => {
    if (quantity) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/customer/updateCartQuantity`,
          { email: userEmail, productId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCart(response.data.items);
        setForceUpdate(forceUpdate + 1);
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    }
  };

  /**
   * createOrder:
   * - Creates an order in the backend based on the current items in the cart.
   * - Clears the cart after the order is successfully created.
   */
  const createOrder = async (shippingFee, token) => {
    try {
      const orderData = {
        name: userFirstName,
        email: userEmail,
        address: userAddress,
        products: cart.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          count: item.quantity,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
        })),
        dateTimeOrdered: new Date().toISOString(),
        shippingFee: shippingFee,
        status: 0,
      };

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/customer/orderProduct`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear the cart in the backend
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/customer/clearCart`,
          {
            email: userEmail,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          navigate("/my-orders");
          setCart([]);
          setForceUpdate(forceUpdate + 1);
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error clearing cart:", error);
        });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Insufficient stock for one or more items in the order.");
    }
  };

  /**
   * cancelOrder:
   * - Cancels a previously placed order in the backend.
   */
  const cancelOrder = async (orderId) => {
    if (!userEmail) {
      console.error("User email is not available");
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/customer/cancelOrder`,
        { orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        createOrder,
        cancelOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
