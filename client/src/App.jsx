import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register } from "./pages/Register";
import { VerifyOTP } from "./pages/Verifyotp";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Layout } from "./components/layout/Layout";
import { Organizer } from "./pages/Organizer";
import { Organizerform } from "./pages/Organizerform";
import { Eventdetails } from "./pages/Eventdetails";
import { Logout } from "./pages/Logout";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";

import { CategoryEvents } from "./pages/CategoryEvents";

import { Organizerdashoard } from "./pages/Organizerdashoard";
import { Organizerevent } from "./pages/Organizerevent";
import { Organizerlayout } from "./components/layout/Organizerlayout";

import { QRCodePage } from "./pages/QRCodePage";
import { TicketConfirmationPage } from "./pages/TicketConfirmationPage";
import { Organizerbookevent } from "./pages/Organizerbook-event";
import { AdminDashboard } from "./pages/Admindashboard";

import { Adminevent } from "./pages/Adminevent";
import { Adminuser } from "./pages/Adminuser";
import { Adminlayout } from "./components/layout/Adminlayout";
import { Admincategory } from "./pages/Admincategory";
import { Searchresult } from "./pages/Searchresult";

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/login" element={<Login />} />
          <Route path="/organizer-form" element={<Organizerform />} />
          <Route path="/qr-scan/:bookingId" element={<QRCodePage />} />
          <Route
            path="/confirm-ticket/:bookingId"
            element={<TicketConfirmationPage />}
          />

          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category/:slug" element={<CategoryEvents />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/event-details/:id" element={<Eventdetails />} />
            <Route path="/search-results" element={<Searchresult />} />
          </Route>

          <Route element={<Organizerlayout />}>
            <Route
              path="/organizer-dashboard"
              element={<Organizerdashoard />}
            />
            <Route path="/event" element={<Organizerevent />} />
            <Route path="/book-event" element={<Organizerbookevent />} />
          </Route>

          <Route element={<Adminlayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-user" element={<Adminuser />} />
            <Route path="/admin-event" element={<Adminevent />} />
            <Route path="/admin-category" element={<Admincategory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};
