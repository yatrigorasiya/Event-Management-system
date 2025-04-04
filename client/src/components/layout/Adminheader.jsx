import { NavLink } from "react-router-dom";

export const Adminheader = () => {
  return (
    <>
      <div className="h-screen w-64 bg-white text-black flex flex-col border-r border-gray-300 shadow-lg">
        {/* Dashboard Title */}
        <div className="p-4 text-xl font-bold border-b border-gray-300">
          Admin Dashboard
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md transition ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-event"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md transition ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Events
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-user"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md transition ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin-category"
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md transition ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                Event Category
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
