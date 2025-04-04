import { useState } from "react";
import { useAuth } from "../store/auth";
import axios from "axios";
import { toast } from "react-toastify";

export const Contact = () => {
  const [contact, setContact] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [userData, setUserData] = useState(true);
  const { user } = useAuth();
  if (userData && user) {
    setContact({
      username: user.username,
      email: user.email,
      message: "",
    });
    setUserData(false);
  }

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setContact({
      ...contact,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(contact);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/contact/contact-details`,
        contact
      );

      console.log("contact data", data);
      setContact(data);
      if (data) {
        setContact({
          username: "",
          email: "",
          message: "",
        });
      }
      toast.success("mesage send succesfully");
    } catch (error) {
      console.log("contact data error", error);
      toast.error(
        error.response?.data?.message || "Failed to submit contact form"
      );
    }
  };
  return (
    <>
      <section className="max-w-6xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <img
              src="/images/contact.jpg"
              alt="Contact Us"
              className="w-full rounded-2xl shadow-lg"
            />
          </div>

          <div className="bg-white p-8 shadow-lg rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Get in Touch
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  name="username"
                  value={contact.username}
                  onChange={handleInput}
                  className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={contact.email}
                  onChange={handleInput}
                  className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Message
                </label>
                <textarea
                  placeholder="Write your message here..."
                  rows="4"
                  name="message"
                  value={contact.message}
                  onChange={handleInput}
                  className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
