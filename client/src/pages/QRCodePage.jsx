import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import axios from "axios";

export const QRCodePage = () => {
  const { bookingId } = useParams();
  const [qrLink, setQrLink] = useState("");
  const [error, setError] = useState("");
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!bookingId) return;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/book/${bookingId}`
        );

        setQrLink(`${import.meta.env.VITE_BACKEND_URL}/api/book/scan/${bookingId}`);

        // Always show the QR code, but warn if scanned
        setIsScanned(response.data.qrScanned);
      } catch (error) {
        setError("Failed to load QR Code.");
      }
    };

    fetchBookingData();
  }, [bookingId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Scan the QR Code to Confirm</h2>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col items-center">
          <QRCode
            value={qrLink}
            size={200}
            className="bg-white p-2 rounded-md shadow-lg"
          />
          {isScanned && (
            <p className="mt-3 text-red-600 font-bold">
              ⚠️ This QR Code has already been used!
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-gray-700">
        Scan the QR code with your phone to confirm your ticket.
      </p>
    </div>
  );
};
