

import { NavLink } from "react-router-dom";

export const Organizerheader = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Dashboard Title */}
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Organizer Dashboard
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md transition ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              🏠 Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/event"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md transition ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              📅Show Events
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/book-event"
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md transition ${
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
            >
              🔖 Book Events
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
