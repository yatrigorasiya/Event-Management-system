import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { toast } from "react-toastify";


export const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const naviagte = useNavigate();
  const { storetokenInLs } = useAuth();

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    console.log(user);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/send-otp`, user);

      setMessage("OTP sent successfully! Please check your email.");
      toast.success("OTP sent successfully! Please check your email.");

      storetokenInLs(data.token);
      localStorage.setItem("email", user.email);

      naviagte("/verify-otp");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Registration failed");
        toast.error(error.response.data.message || "Registration failed");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6 ">
            Register Now
          </h1>

          {/* Message Alerts */}
          {message && (
            <p className="text-green-600 text-center font-medium">{message}</p>
          )}
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-gray-600 font-semibold mb-1"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleInput}
                required
                autoComplete="off"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 shadow-sm"
              />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-600 font-semibold mb-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInput}
                required
                autoComplete="off"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 shadow-sm"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-gray-600 font-semibold mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleInput}
                required
                autoComplete="off"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 shadow-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold text-lg shadow-md"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
