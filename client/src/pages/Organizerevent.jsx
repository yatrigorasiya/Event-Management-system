import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Organizer } from "./Organizer";
import { motion } from "framer-motion";

export const Organizerevent = () => {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/api/event/oranizerevents",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/event/delete-event/${id}`);
      fetchEvents();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-6 relative max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Your Events</h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-md flex items-center gap-2 transition"
          onClick={() => {
            setEditingEventId(null);
            setIsPopupOpen(true);
          }}
        >
          <span className="hidden sm:inline">Create Event</span>
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-3 px-5 text-left">Title</th>
              <th className="py-3 px-5 text-left">Date</th>
              <th className="py-3 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr
                  key={event._id}
                  className={`border-b transition duration-300 ease-in-out hover:bg-blue-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-3 px-5 truncate max-w-xs">{event.title}</td>
                  <td className="py-3 px-5">
                    {new Date(event.date).toDateString()}
                  </td>
                  <td className="py-3 px-5 flex justify-center gap-2">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition"
                      onClick={() => {
                        setEditingEventId(event._id);
                        setIsPopupOpen(true);
                      }}
                    >
                      <FaEdit className="text-lg" />
                    </button>

                    <button
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-md transition"
                      onClick={() => handleDelete(event._id)}
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              className="absolute top-3 right-3 bg-gray-300 hover:bg-gray-400 p-2 rounded-full transition"
              onClick={() => setIsPopupOpen(false)}
            >
              ✕
            </button>
            <Organizer
              eventId={editingEventId} // Pass the editing event ID
              closePopup={() => setIsPopupOpen(false)}
              refreshEvents={fetchEvents}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
