import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { toast } from "react-toastify";
import { FaUserCircle, FaBars } from "react-icons/fa";
import axios from "axios";
import { AdminRequestModal } from "../../pages/Adminmodel";

export const Header = () => {
  const navigate = useNavigate();
  const { isloggin, user, Logoutuser, role, userAuthentication } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    Logoutuser();
    toast.success("Logout successfully");
    navigate("/login");
  };

  //  Handle event search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter an event name.");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:3000/api/event/search?query=${searchQuery}`
      );
      navigate("/search-results", { state: { events: res.data } });
    } catch (error) {
      toast.error("No events found.");
    }
  };

  const handleSwitchRole = async () => {
    if (role === "organizer") return;
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("User not authenticated. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/switch-role",
        { role: "organizer" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await userAuthentication();

      if (res.data.isOrganizerApproved) {
        navigate("/organizer-dashboard");
      } else {
        navigate("/organizer-form");
      }

      toast.success("Switched to Organizer successfully!");
    } catch (error) {
      console.error("Error switching role:", error);
      toast.error("Failed to switch role. Please try again.");
    }
  };

  const handleOrganizerAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      // Refresh authentication to ensure correct role is checked
      await userAuthentication();

      const res = await axios.get(
        "http://localhost:3000/api/auth/access-organizer-dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        navigate("/organizer-dashboard");
        toast.success("Successfully accessed the organizer dashboard!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Access denied.");
    }
  };

  const handleAdminAccess = () => {
    if (user.isAdmin) {
      navigate("/admin-dashboard");
    } else {
      setAdminModalOpen(true);
    }
  };

  return (
    <>
      <nav className=" top-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center sticky  z-50">
        <span className="text-2xl font-bold text-red-600">EVENT</span>

        {/* Search Bar */}
        <form
          className="hidden md:flex flex-1 justify-center"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search for Events"
            className="border px-4 py-2 rounded-md w-96 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-gray-800 text-white rounded-lg"
          >
            Search
          </button>
        </form>

        <div className="relative">
          {isloggin ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="font-medium px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all flex items-center gap-2"
              >
                <FaUserCircle className="text-lg" /> {user.username}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden border z-50">
                  <ul className="py-2 text-gray-700">
                    {user.role === "user" && (
                      <li>
                        <button
                          onClick={handleSwitchRole}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Switch to Organizer
                        </button>
                      </li>
                    )}

                    {user.role === "organizer" && (
                      <li>
                        <button
                          onClick={handleOrganizerAccess}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Organizer
                        </button>
                      </li>
                    )}

                    {user.isAdmin === false && (
                      <li>
                        <button
                          onClick={() => setAdminModalOpen(true)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Request Admin Access
                        </button>
                      </li>
                    )}

                    {user.isAdmin && (
                      <li>
                        <button
                          onClick={handleAdminAccess}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                        >
                          Admin Dashboard
                        </button>
                      </li>
                    )}

                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-medium transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaBars />
        </button>
      </nav>

      {/* Admin Request Modal */}
      <AdminRequestModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onAdminApproved={userAuthentication}
      />

      {/* Navigation Links - Stays on Top */}
      <div className=" top-16 left-0 w-full bg-gray-100 p-2 border-b border-gray-300 z-40">
        <div className="container mx-auto flex justify-between items-center py-2 px-4">
          <div className="flex space-x-6 text-gray-700 text-sm font-medium">
            <NavLink to="/home" className="hover:text-red-500">
              Home
            </NavLink>
            <NavLink to="/about" className="hover:text-red-500">
              About
            </NavLink>
            <NavLink to="/contact" className="hover:text-red-500">
              Contact
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Stays on Top */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md md:hidden z-50">
          <ul className="flex flex-col text-gray-700 text-center py-2">
            <NavLink to="/home" className="py-2 hover:text-red-500">
              Event
            </NavLink>
            <NavLink to="/about" className="py-2 hover:text-red-500">
              About
            </NavLink>
            <NavLink to="/contact" className="py-2 hover:text-red-500">
              Contact
            </NavLink>
            <NavLink to="/blog" className="py-2 hover:text-red-500">
              Blog
            </NavLink>
          </ul>
        </div>
      )}
    </>
  );
};
