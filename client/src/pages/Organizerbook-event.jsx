import { useEffect, useState } from "react";
import axios from "axios";

export const Organizerbookevent = () => {
  const [scannedBookings, setScannedBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  useEffect(() => {
    const fetchScannedBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
           `${import.meta.env.VITE_BACKEND_URL}/api/book/bookings/scanned`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("booking data", response.data);
        setScannedBookings(response.data);
      } catch (error) {
        console.error("Error fetching scanned bookings:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/event/oranizerevents`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();

    fetchScannedBookings();
  }, []);

  // Filter scanned bookings based on selected event
  const filteredBookings = selectedEvent
    ? scannedBookings.filter((booking) => booking.event._id === selectedEvent)
    : scannedBookings;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 ">
        Confirmed & Scanned Tickets
      </h1>

      {/* Event Filter Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Select Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.venue}
            </option>
          ))}
        </select>
      </div>

      {/* Responsive Scrollable Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-700 text-white">
              <th className="py-3 px-5 text-left">Event</th>
              <th className="py-3 px-5 text-left">Name</th>
              <th className="py-3 px-5 text-left">Email</th>
              <th className="py-3 px-5 text-left">Attendees</th>
              <th className="py-3 px-5 text-center">Total Attendees</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, index) => (
                <tr
                  key={booking._id}
                  className={`border-b transition duration-300 ease-in-out hover:bg-blue-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-3 px-5 truncate max-w-xs">
                    {booking.event.title}
                  </td>
                  <td className="py-3 px-5">{booking.name}</td>
                  <td className="py-3 px-5">{booking.email}</td>
                  <td className="py-3 px-5">
                    <strong>{booking.name} (Booked By)</strong>
                    <br />
                    {booking.attendees.map((attendee, index) => (
                      <span key={attendee._id}>
                        {attendee.name}
                        {index < booking.attendees.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-5 text-center">
                    {booking.totalAttendees}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No scanned tickets found for this event.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
