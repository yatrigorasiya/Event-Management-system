import mongoose from "mongoose";
// Reminder Schema

const ReminderSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["daily", "specific_date"],
    required: true,
  },
  time: {
    type: String, 
    required: true,
  },
  date: {
    type: Date, // Required only for specific_date reminders
    required: function () {
      return this.type === "specific_date";
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
});

//create schema:-
export const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    startTime: {
      type: String, // Example: "5:00 PM"
      required: true,
    },
    endTime: {
      type: String, // Example: "10:00 PM"
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },

    imagePath: {
      type: String,
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
   
    reminders: [ReminderSchema],
    invitees: [String], // Array of emails
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);
//create model:-

export const Event = new mongoose.model("Event", eventSchema);
