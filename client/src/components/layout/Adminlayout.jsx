import { Outlet } from "react-router-dom"
import { Adminheader } from "./Adminheader"

export const Adminlayout = ()=>{
    return(
        <>
         <div className="flex h-screen">
        {/* Sidebar */}
        <Adminheader />

        {/* Main Content */}
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>
        </>
    )
}