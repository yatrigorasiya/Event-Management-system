import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/api/auth";

export const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleResendOTP = async () => {
    try {
      await axios.post(`${API_BASE_URL}/resend-otp`, { email });
    } catch (error) {
      console.log("resend otp error", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(otp, email);
    try {
      await axios.post(`${API_BASE_URL}/register`, {
        email,
        otp,
      });

      navigate("/login");
    } catch (error) {
      console.log("OTP verification failed", error);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
            Verify OTP
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Verify
            </button>

            {/* Resend OTP Button */}
            <button
              type="submit"
              onClick={handleResendOTP}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Resend OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
