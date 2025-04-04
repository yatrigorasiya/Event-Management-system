import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AdminRequestModal = ({ isOpen, onClose, onAdminApproved }) => {
  const [adminReason, setAdminReason] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setAdminReason({
      ...adminReason,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      const res = await axios.post(
       `${import.meta.env.VITE_BACKEND_URL}/api/auth/request-admin`,
        { reason: adminReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.isAdmin) {
        toast.success("You are now an Admin!");
        onAdminApproved();
        onClose();
        navigate("/admin-dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to request Admin access."
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Request Admin Access</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={adminReason.name}
              onChange={handleInput}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="text"
              name="email"
              value={adminReason.email}
              onChange={handleInput}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={adminReason.password}
              onChange={handleInput}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
