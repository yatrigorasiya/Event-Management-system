import { Outlet } from "react-router-dom";
import { Organizerheader } from "./Organizerheader";

export const Organizerlayout = () => {
  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Organizerheader />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};
