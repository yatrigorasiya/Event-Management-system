import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../store/auth"; // Import authentication context

export const Organizerform = () => {
  const navigate = useNavigate();
  const { userAuthentication } = useAuth(); // To refresh user data after form submission

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // add data in field:-

  const [userData, setUserData] = useState(true);
  const { user } = useAuth();
  if (userData && user) {
    setFormData({
      username: user.username,
      email: user.email,
      message: "",
    });
    setUserData(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/organizer-form`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Organizer form submitted successfully!");
        await userAuthentication(); // Refresh user data
        navigate("/organizer-dashboard");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit organizer form."
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-green-600">
        Organizer Registration
      </h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Organization Name
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Organization Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">
            Contact Number
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
