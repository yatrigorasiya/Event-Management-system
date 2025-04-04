import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        name: { type: String, required: true },
      },
    ],
    totalAttendees: { type: Number, required: true },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    qrScanned: {
      type: Boolean,
      default: false, // Tracks if QR code has been scanned
    },
    qrLink: {
      type: String,
      required: true,
     
    },
    ticketId: {
      type: String,
      unique: true,
      sparse: true, 
    },
  },
  { timestamps: true }
);

//  Middleware to set qrLink before saving
bookingSchema.pre("save", function (next) {
  if (!this.qrLink) {
    this.qrLink = `${process.env.FRONTEND_URL}/qr-scan/${this._id}`;
  }
  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);
