import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Event } from "../model/event-model.js";
import dayjs from "dayjs";

import { Booking } from "../model/booking-model.js";
import { User } from "../model/user-model.js";
import crypto from "crypto";

dotenv.config();

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Public Event Booking (Direct Booking)
export const bookEvent = async (req, res) => {
  try {
    const { eventId, userId, name, email, attendees } = req.body;
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user)
      return res.status(404).json({ message: "Event and user not found" });

    // Parse event date and start time correctly
    const eventDate = dayjs(event.date).format("YYYY-MM-DD");
    const eventStartDateTime = dayjs(
      `${eventDate} ${event.startTime}`,
      "YYYY-MM-DD HH:mm"
    );

    const currentDateTime = dayjs();

    // Prevent booking after event start time
    if (currentDateTime.isAfter(eventStartDateTime)) {
      return res
        .status(400)
        .json({ message: "Booking is closed as the event date has passed." });
    }

    if (event.visibility === "private")
      return res
        .status(400)
        .json({ message: "Private event requires approval" });

    // Generate a unique booking ID
    const bookingId = crypto.randomBytes(16).toString("hex");

    const qrLink = `${process.env.FRONTEND_URL}/qr-scan/${bookingId}`;
    console.log("url", process.env.FRONTEND_URL);

    const newBooking = new Booking({
      _id: bookingId,
      event: eventId,
      user: userId,
      name,
      email,
      attendees,
      totalAttendees: attendees.length + 1,
      status: "approved",
      qrLink,
    });
    await newBooking.save();

    // Send Confirmation Email
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Event Booking Confirmation",
      text: `Your booking for "${event.title}" has been confirmed.\nClick the link below to scan your QR code and complete payment:\n\n${qrLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Event booked successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error });
  }
};

// Request Approval for Private Event
export const requestApproval = async (req, res) => {
  try {
    const { eventId, userId, name, email, attendees = [] } = req.body;
    const event = await Event.findById(eventId).populate("createdBy", "email");
    const user = await User.findById(userId);

    if (!event || !user)
      return res.status(404).json({ message: "Event  and user not found" });

    // Ensure organizer exists
    const organizer = event.createdBy;
    if (!organizer || !organizer.email) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Prevent duplicate booking requests
    const existingBooking = await Booking.findOne({
      event: eventId,
      user: userId,
    });

    // Generate a unique booking ID
    const bookingId = crypto.randomBytes(16).toString("hex");

    // Generate a QR link (this can be updated upon approval)
    const qrLink = `${process.env.FRONTEND_URL}/qr-scan/${bookingId}`;

    const newBooking = new Booking({
      _id: bookingId,
      event: eventId,
      user: userId,
      name,
      email,
      attendees,
      totalAttendees: attendees.length + 1,
      qrLink,
      status: "pending",
    });
    await newBooking.save();

    // Send email to organizer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: organizer.email,
      subject: "New Booking Request",
      text: `User ${name} (${email}) has requested to book the event "${event.name}".\n\nApprove or reject this request.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Approval request sent to organizer!" });
  } catch (error) {
    console.error("Error in requestApproval:", error);
    res
      .status(500)
      .json({ message: "Approval request failed", error: error.message });
  }
};

export const getPendingBookings = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const organizerEvents = await Event.find({ createdBy: organizerId });

    const eventIds = organizerEvents.map((event) => event._id);

    const pendingBookings = await Booking.find({
      event: { $in: eventIds },
      status: "pending",
    }).populate("user event");

    res.json(pendingBookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to get pending bookings", error });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId).populate("user event");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    // Send email to the user
    const mailOptions = {
      from: process.env.EMAIL,
      to: booking.email,
      subject: `Your Booking for ${booking.event.name} is ${status}`,
      text: `Your booking request for the event "${booking.event.name}" has been ${status}.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: `Booking ${status} successfully and user notified!` });
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking status", error });
  }
};

export const scanQRCode = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if QR code has already been scanned
    if (booking.qrScanned) {
      return res
        .status(400)
        .json({ message: "QR Code has already been used!" });
    }

    // Generate a unique ticket ID (separate from booking ID)
    const ticketId = crypto.randomBytes(10).toString("hex");

    // Mark QR code as scanned
    booking.qrScanned = true;
    booking.ticketId = ticketId;
    await booking.save();

    console.log("Updated booking:", booking);

    return res.redirect(
      `${process.env.FRONTEND_URL}/confirm-ticket/${bookingId}`
    );
  } catch (error) {
    res.status(500).json({ message: "QR scan failed", error });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.error("Booking Not Found:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      bookingId: booking._id,
      ticketId: booking.ticketId,
      name: booking.name,
      email: booking.email,
      qrScanned: booking.qrScanned,
      qrCode: booking.qrLink,
      totalAttendees: booking.totalAttendees,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking details", error });
  }
};

export const getScannedBookings = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const organizerEvents = await Event.find({ createdBy: organizerId });

    const eventIds = organizerEvents.map((event) => event._id);

    const scannedBookings = await Booking.find({
      event: { $in: eventIds },
      qrScanned: true,
    }).populate("user event");

    res.json(scannedBookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to get scanned bookings", error });
  }
};
