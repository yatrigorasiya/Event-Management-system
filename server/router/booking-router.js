import express from "express";
import {
  bookEvent,
  getBookingDetails,
  
  getPendingBookings,
  
  getScannedBookings,
  
  requestApproval,
  scanQRCode,
  updateBookingStatus,
} from "../controller/booking-controller.js";
import { authmiddleware } from "../middleware/auth-middleware.js";
const router = express.Router();
router.route("/booking").post(bookEvent);

router.route("/request-approval").post(requestApproval);

router.route("/pending").get(authmiddleware, getPendingBookings);
router.route("/update-status").put(authmiddleware, updateBookingStatus);
router.route("/scan/:bookingId").get(scanQRCode)
router.route("/:bookingId").get(getBookingDetails)
router.route("/bookings/scanned").get(authmiddleware,getScannedBookings)




export default router;
