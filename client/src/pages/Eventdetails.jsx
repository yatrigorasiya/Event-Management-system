import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const Eventdetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    attendees: [],
  });

  const navigate = useNavigate();

  const getSingleEvent = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/event/getsingleevent/${id}`
      );
      console.log(data.event);
      setEvent(data.event);
    } catch (error) {
      console.log("Get Single Event error", error);
    }
  };

  useEffect(() => {
    getSingleEvent();
  }, [id]);

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookClick = () => {
    if (!userId) {
      alert("Please log in to book the event.");
      return;
    }
    setShowModal(true);
  };

  //handle the all attendee :-
  const handleAddAttendee = () => {
    setFormData({
      ...formData,
      attendees: [...formData.attendees, { name: "" }],
    });
  };

  const handleAttendeeChange = (index, value) => {
    const updatedAttendees = [...formData.attendees];
    updatedAttendees[index].name = value;
    setFormData({ ...formData, attendees: updatedAttendees });
  };
  const handleRemoveAttendee = (index) => {
    const updatedAttendees = formData.attendees.filter((_, i) => i !== index);
    setFormData({ ...formData, attendees: updatedAttendees });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (event.visibility === "public") {
      await bookEvent();
    } else {
      await requestOrganizerApproval();
    }
  };
  // Function to book the event for public events
  const bookEvent = async () => {
    try {
      const requestData = {
        eventId: id,
        userId,
        name: formData.name,
        email: formData.email,
        attendees: formData.attendees.filter((attendee) =>
          attendee.name.trim()
        ),
      };
      console.log("request data", requestData);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/book/booking`,
        requestData
      );

      toast.success(data.message);

      setShowModal(false);
    } catch (error) {
      console.error("Booking error", error);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  // Function to send approval request to the organizer
  const requestOrganizerApproval = async () => {
    try {
      const requestData = { eventId: id, userId, ...formData };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/book/request-approval`,
        requestData
      );
      console.log(data);
      toast.success("Approval request sent to organizer!");
      setShowModal(false);
    } catch (error) {
      console.error("Approval request error", error);
      toast.error(error.response?.data?.message || "Approval request error");
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
          {/* Event Name */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Event Details
          </h1>

          {event.imagePath && (
            <div className="mt-6">
              <img
                src={`${import.meta.env.VITE_IMG_URL}${event.imagePath}`}
                alt="Event"
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Event Information */}
          <div className="mt-4 space-y-2 text-gray-600 text-lg">
            <p className="font-semibold">
              Name: <span className="font-normal">{event.name}</span>
            </p>

            <p className="font-semibold">
              Title: <span className="font-normal">{event.title}</span>
            </p>
            <p className="font-semibold">
              Description:{" "}
              <span className="font-normal">{event.description}</span>
            </p>
            <p className="font-semibold">
              Date:{" "}
              <span className="font-normal">
                {new Date(event.date).toDateString()}
              </span>
            </p>
            <p className="font-semibold">
              Start Time: <span className="font-normal">{event.startTime}</span>
            </p>
            <p className="font-semibold">
              End Time: <span className="font-normal">{event.endTime}</span>
            </p>
            <p className="font-semibold">
              Venue: <span className="font-normal">{event.venue}</span>
            </p>
          </div>
          <button
            onClick={handleBookClick}
            className="mt-4 w-full bg-gray-700 text-white py-3 text-lg rounded-lg hover:bg-gray-800 transition duration-300"
          >
            Book
          </button>
        </div>
      </div>

      {/* Modal for Booking Form */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Enter Booking Details
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
              />

              <div>
                <h3 className="text-lg font-semibold mb-2">Attendees</h3>
                {formData.attendees.map((attendee, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={attendee.name}
                      onChange={(e) =>
                        handleAttendeeChange(index, e.target.value)
                      }
                      placeholder="Attendee Name"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttendee(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddAttendee}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  + Add Attendee
                </button>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)} // Close modal
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Submit Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
