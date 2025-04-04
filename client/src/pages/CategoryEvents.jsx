import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CategoryEvents = () => {
  const { slug } = useParams(); // Get category ID from URL
  const [events, setEvents] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/event/category/${slug}`
        );
        setEvents(data.events);
        setCategoryName(data.categoryName); // Store category name
      } catch (error) {
        console.log("Error fetching events", error);
        setError("Failed to load events. Please try again later.");
      }
      setLoading(false);
    };

    fetchEvents();
  }, [slug]);

  return (
    <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center my-8">
        Events in {categoryName}
      </h1>

      {/* Show loading only if there is no error and events are not fetched yet */}
      {loading && (
        <p className="text-center text-lg text-gray-700">Loading events...</p>
      )}

      {/* Show error message if API fails */}
      {error && (
        <p className="text-center text-red-500 font-semibold">{error}</p>
      )}

      {/* Show "No events found" only if loading is false and event list is empty */}
      {!loading && events.length === 0 && !error && (
        <p className="text-center text-lg text-gray-700 font-semibold">
          No events found for this category.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white shadow-lg rounded-xl overflow-hidden transition-transform transform hover:scale-105"
          >
            {event.imagePath && (
              <img
                src={`${import.meta.env.VITE_IMG_URL}${event.imagePath}`}
                alt="Event"
                className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
              />
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition duration-300">
                {event.title}
              </h2>
              <h3 className="text-md text-gray-600 mb-2">By {event.name}</h3>

              <div className="mt-3 text-sm text-gray-600">
                <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                <p>📍 {event.venue}</p>
              </div>

              <button
                className="mt-4 w-full bg-gray-600 text-white py-3 text-lg rounded-lg hover:bg-gray-700 transition duration-300 shadow-md hover:shadow-lg"
                onClick={() => navigate(`/event-details/${event._id}`)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
