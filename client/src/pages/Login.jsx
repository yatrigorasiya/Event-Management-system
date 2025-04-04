import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";


export const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
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
    console.log(user);

    // Redirect to home
    navigate("/home");
    try {
      const { data } = await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, user);
      storetokenInLs(data.token);
      // localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate("/home");
    } catch (error) {
      console.log("Login Failed", error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                name="email"
                required
                value={user.email}
                onChange={handleInput}
                autoComplete="off"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Your Password"
                name="password"
                required
                value={user.password}
                onChange={handleInput}
                autoComplete="off"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
