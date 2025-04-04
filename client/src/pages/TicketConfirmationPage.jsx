import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export const TicketConfirmationPage = () => {
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/book/${bookingId}`
        );
        const data = await response.json();

        if (response.ok) {
          setTicket(data);
        } else {
          setError(data.message || "Ticket not found.");
        }
      } catch (error) {
        setError("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchTicketDetails();
    }
  }, [bookingId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
          Ticket Confirmed!
        </h2>
        <p className="text-gray-700 text-lg mt-2">
          Your ticket has been successfully confirmed.
        </p>

        {/* QR Code Section */}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Scan Your QR Code
          </h3>
          <div className="flex justify-center mt-3">
            <QRCodeCanvas
              value={ticket.qrCode}
              size={180}
              className="border border-gray-300 rounded-lg p-2 shadow-md"
            />
          </div>
        </div>

        {/* Booking Details in List Format */}
        <ul className="mt-6 border-t border-gray-300 pt-4 space-y-3 ">
          <li className="flex  border-b pb-2">
            <span className="text-lg font-semibold text-gray-800 pr-3">
              Booking ID:
            </span>
            <span className="text-lg font-mono text-green-600">
              {ticket.bookingId}
            </span>
          </li>
          <li className="flex border-b pb-2">
            <span className="text-lg font-semibold text-gray-800 pr-3">
              Ticket ID:
            </span>
            <span className="text-lg font-mono text-green-600">
              {ticket.ticketId}
            </span>
          </li>
          <li className="flex  border-b pb-2 ">
            <span className="text-lg font-semibold text-gray-800 pr-3">
              Name:
            </span>
            <span className="text-lg text-gray-900">{ticket.name}</span>
          </li>
          <li className="flex  border-b pb-2">
            <span className="text-lg font-semibold text-gray-800 pr-3">
              Email:
            </span>
            <span className="text-gray-900">{ticket.email}</span>
          </li>
          <li className="flex  border-b pb-2">
            <span className="text-lg font-semibold text-gray-800 pr-3">
              totalAttendees:
            </span>
            <span className="text-gray-900">{ticket.totalAttendees}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
