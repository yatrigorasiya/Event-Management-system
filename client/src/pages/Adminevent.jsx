import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export const Adminevent = () => {
  const [events, setEvents] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    venue: "",
    startTime: "",
    endTime: "",
    date: "",
    description: "",
  });

  const fetchAllEvents = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/event/getevent`
      );
      setEvents(data.event);
    } catch (error) {
      console.error("Event fetch error", error);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const formatDateToDDMMYYYY = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const formatDateToYYYYMMDD = (date) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/event/delete-event/${id}`);
      fetchAllEvents();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setFormData({
      ...event,
      date: formatDateToDDMMYYYY(event.date),
    });
    setIsEditModalOpen(true);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");

      const updatedEvent = {
        ...formData,
        date: formatDateToYYYYMMDD(formData.date),
      };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/event/update/${selectedEvent._id}`,
        updatedEvent,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setIsEditModalOpen(false);
      fetchAllEvents();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-700 text-white">
            <tr>
              {[
                "#",
                "Event Name",
                "Title",
                "Description",
                "Venue",
                "Start Time",
                "End Time",
                "Date",
                "Actions",
              ].map((h, i) => (
                <th key={i} className="px-6 py-3 border-b">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {events.length ? (
              events.map((e, i) => (
                <tr key={e._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3">{e.name}</td>
                  <td className="px-6 py-3">{e.title}</td>
                  <td className="px-6 py-3">{e.description}</td>
                  <td className="px-6 py-3">{e.venue}</td>
                  <td className="px-6 py-3">{e.startTime}</td>
                  <td className="px-6 py-3">{e.endTime}</td>
                  <td className="px-6 py-3">{formatDateToDDMMYYYY(e.date)}</td>
                  <td>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition mr-3"
                      onClick={() => handleEditClick(e)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="bg-red-700 hover:bg-red-800 text-white p-2 rounded-lg shadow-md transition"
                      onClick={() => handleDelete(e._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Event</h2>
            {[
              "name",
              "title",
              "description",
              "venue",
              "startTime",
              "endTime",
              "date",
            ].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full p-2 mb-3 border rounded"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              />
            ))}
            <div className="flex justify-end">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded mr-2"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
