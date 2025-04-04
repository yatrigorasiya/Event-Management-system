import { useLocation, useNavigate } from "react-router-dom";

export const Searchresult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const events = location.state?.events || [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden"
            >
              {event.imagePath && (
                <img
                  src={`http://localhost:3000${event.imagePath}`}
                  alt="Event"
                  className="w-full h-56 object-cover"
                />
              )}

              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {event.title}
                </h2>
                <h3 className="text-md text-gray-600 mb-2">By {event.name}</h3>

                <div className="mt-3 text-sm text-gray-600">
                  <p>📅 {event.date.split("T")[0]}</p>

                  <p>📍 {event.venue}</p>
                </div>

                <button
                  className="mt-4 w-full bg-gray-700 text-white py-3 text-lg rounded-lg hover:bg-gray-800 transition duration-300"
                  onClick={() => navigate(`/event-details/${event._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
