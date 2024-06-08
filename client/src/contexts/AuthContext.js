import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * CONTEXT: AuthProvider
 * PURPOSE: Provides authentication context and functionality for the application.
 *
 * FUNCTIONS:
 *    - token (string or null): The authentication token for the currently logged-in user.
 *    - checkAuth (Function): A function to check authentication status and update state.
 *    - login (Function): A function to handle user login.
 *    - logout (Function): A function to handle user logout.
 *    - register (Function): A function to handle user registration.
 *    - isAuthenticated (boolean): Indicates whether a user is currently authenticated.
 *    - userEmail (string or null): The email of the currently logged-in user.
 *    - userFirstName (string or null): The first name of the currently logged-in user.
 *
 * USAGE:
 *  - Wraps the entire application to provide authentication context and functionality.
 */

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState(null);
  const [userFirstName, setUserFirstName] = useState(null);
  const [userType, setUserType] = useState(null);
  const [userAddress, setUserAddress] = useState(null);

  /**
   * checkAuth:
   * - Checks if a token is stored in local storage.
   * - If found, it sets authentication state to 'true', updates user data, and indicates successful login.
   * - If not found, it sets authentication state to 'false', indicating no active login session.
   */
  const checkAuth = () => {
    const storedToken = localStorage.getItem("token");
    const storedEmail = localStorage.getItem("email");
    const storedFirstName = localStorage.getItem("firstName");
    const storedUserType = localStorage.getItem("userType");
    const storedAddress = localStorage.getItem("address");

    if (storedToken) {
      setToken(storedToken);
      setUserEmail(storedEmail);
      setUserFirstName(storedFirstName);
      setUserType(storedUserType);
      setUserAddress(storedAddress);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  /**
   * useEffect (for initial auth check):
   * - Triggers the `checkAuth` function when the component mounts.
   * - This ensures the authentication status is verified on page load.
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * login:
   * - Sends a login request to the backend.
   * - If successful, updates authentication state, stores the token, user data, and redirects to the home page.
   * - If unsuccessful, logs an error and handles the error response appropriately.
   */
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        setIsAuthenticated(true);
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", email);
        localStorage.setItem("firstName", response.data.firstName);
        localStorage.setItem("userType", response.data.userType);
        localStorage.setItem("address", response.data.address);
        checkAuth();

        setUserEmail(email);
        setUserFirstName(response.data.firstName);
        setUserAddress(response.data.address);

        if (response.data.userType === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        return response.data.error;
      }
    } catch (error) {
      console.error("Error loggin in:", error);
      if (error.response.status === 401) {
        return "Wrong email or password. Please try again";
      } else {
        return "An error occured during login";
      }
    }
  };

  /**
   * logout:
   * - Clears authentication state and token.
   * - Removes stored data from local storage.
   * - Redirects the user to the login page.
   */
  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
    localStorage.removeItem("address");

    checkAuth();
    setUserEmail(null);
    setUserFirstName(null);
    setUserAddress(null);
    navigate("/login");
  };

  /**
   * register:
   * - Sends a registration request to the backend with the provided user data.
   * - If successful, displays a success message and redirects to the login page.
   * - If unsuccessful, displays an error message.
   */
  const register = async (userData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/register`,
        userData
      );

      if (response.status === 201) {
        alert("Registration successful! Please log in.");
        navigate("/");
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error registering:", error);
      alert("An error occured during registration");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        checkAuth,
        login,
        logout,
        register,
        isAuthenticated,
        userEmail,
        userFirstName,
        userType,
        userAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
