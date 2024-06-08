import UserCard from "../../components/UserCard";
import AdminNavbar from "../../components/AdminNavbar";
import Lenis from "@studio-freight/lenis";
import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function AdminUsers({ userList }) {
  const { token } = useContext(AuthContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        console.error("No token found");
        // setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/admin/registeredUsers`,
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
          console.log("Fetched users:", data);
          setUsers(data);
        } else {
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <div className="h-screen w-screen">
      <AdminNavbar />

      <div className="main-container mt-3 flex">
        <div className="spacer mx-auto"></div>
        <div className="cart-container w-[800px]">
          <h1 className="font-black text-6xl flex flex-row justify-center mb-6">
            Users
          </h1>
          <h2 className="font-light text-4xl flex flex-row justify-center">
            Total: {users.length}
          </h2>
          <UserCard users={users} />
        </div>
        <div className="spacer mx-auto"></div>
      </div>
    </div>
  );
}
