import { NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-[#1a083d] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Plan Events */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Plan Events</h3>
          <ul className="space-y-2">
            <li>
              <NavLink to="#" className="hover:underline">
                book ticket
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="hover:underline">
                Event Planning
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="hover:underline">
                Sell Concert Tickets Online
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="hover:underline">
                Event Payment System
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Find Events */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Find Events</h3>
          <ul className="space-y-2">
            <li>
              <NavLink to="#" className="hover:underline">
                Best Event
              </NavLink>
            </li>

            <li>
              <NavLink to="#" className="hover:underline">
                Tulum Music Events
              </NavLink>
            </li>

            <li>
              <NavLink to="#" className="hover:underline">
                Atlanta Pop Music Events
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect With Us</h3>
          <ul className="space-y-2">
            <li>
              <NavLink to="/contact" className="hover:underline">
                Contact Support
              </NavLink>
            </li>

            <li>
              <NavLink to="#" className="hover:underline">
                Facebook
              </NavLink>
            </li>
            <li>
              <NavLink to="#" className="hover:underline">
                LinkedIn
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      {/* Logo with Horizontal Line */}
      {/* <div className="flex items-center justify-center my-6">
        <div className="border-t border-gray-500 flex-1"></div>
        EVENT
        <div className="border-t border-gray-500 flex-1"></div>
      </div> */}
    </footer>
  );
};
