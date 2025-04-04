import { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";

export const AdminDashboard = () => {
  const [eventCount, setEventCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [organizerCount, setOrganizerCount] = useState(0);

  const fetchAllData = async () => {
    try {
      const eventResponse = await axios.get(
       `${import.meta.env.VITE_BACKEND_URL}/event/getevent`
      );
      const userResponse = await axios.get(
       `${import.meta.env.VITE_BACKEND_URL}/auth/adminuser`
      );

      // Set event and user count
      setEventCount(eventResponse.data.totalEvents);
      setUserCount(userResponse.data.totalUsers);
      setOrganizerCount(userResponse.data.totalOrganizers);
    } catch (error) {
      console.log("Fetch error", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);
  return (
    <>
      {/* Dashboard Cards */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
          <FaCalendarAlt className="text-blue-500 text-3xl mr-4" />
          <div>
            <p className="text-gray-700">Total Events</p>
            <h3 className="text-2xl font-semibold">{eventCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
          <FaUsers className="text-green-500 text-3xl mr-4" />
          <div>
            <p className="text-gray-700">Total Users</p>
            <h3 className="text-2xl font-semibold">{userCount}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
          <FaUsers className="text-yellow-500 text-3xl mr-4" />
          <div>
            <p className="text-gray-700">Organizers</p>
            <h3 className="text-2xl font-semibold">{organizerCount}</h3>
          </div>
        </div>
      </div>
    </>
  );
};
