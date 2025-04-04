import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const Organizerdashoard = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const getPendingBookings = async () => {
    try {
      const { data } = await axios.get(
         `${import.meta.env.VITE_BACKEND_URL}/book/pending`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Booking data", data);
      setPendingBookings(data);
    } catch (error) {
      console.error("Error fetching pending bookings", error);
    }
  };

  useEffect(() => {
    getPendingBookings();
  }, []);

  const handleBookingUpdate = async (bookingId, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/book/update-status`,
        { bookingId, status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success(`Booking ${status} successfully!`);
      getPendingBookings(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update booking status");
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Pending Bookings
        </h1>

        {pendingBookings.length === 0 ? (
          <p>No pending bookings</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Event</th>
                <th className="border p-2">Booking User</th>
                <th className="border p-2">Booking User Email</th>
                <th className="border p-2">attendees</th>
                <th className="border p-2">TotalAttendees</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map((booking) => (
                <tr key={booking._id} className="border">
                  <td className="border p-2">{booking.event.name}</td>
                  <td className="border p-2">{booking.name}</td>
                  <td className="border p-2">{booking.email}</td>
                  <td className="border p-2">
                    <strong>{booking.name} (Booked By)</strong>
                    <br />
                    {booking.attendees.map((attendee, index) => (
                      <span key={attendee._id}>
                        {attendee.name}
                        {index < booking.attendees.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </td>
                  <td className="border p-2">{booking.totalAttendees}</td>

                  <td className="border p-2">
                    <button
                      onClick={() =>
                        handleBookingUpdate(booking._id, "approved")
                      }
                      className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleBookingUpdate(booking._id, "rejected")
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};
