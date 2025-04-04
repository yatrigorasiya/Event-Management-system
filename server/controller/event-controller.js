import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Event } from "../model/event-model.js";
import { Category } from "../model/category-model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define frontend upload path
const frontendUploadDir = path.join(__dirname, "../../client/public/uploads");

// Create Event Controller
export const createEvent = async (req, res) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "organizer" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Access Denied" });
    }

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      name,
      venue,
      category,
      reminderTimes,
      invitees,
      visibility,
    } = req.fields;
    const { image } = req.files;

    let imagePath = "";
    if (image) {
      // Ensure the frontend upload directory exists
      if (!fs.existsSync(frontendUploadDir)) {
        fs.mkdirSync(frontendUploadDir, { recursive: true });
      }

      // Generate unique filename
      const imageFileName = `${Date.now()}_${image.name}`;
      imagePath = `/uploads/${imageFileName}`;
      const frontendImagePath = path.join(frontendUploadDir, imageFileName);

      // Copy file instead of renaming (fixes cross-device issue)
      fs.copyFileSync(image.path, frontendImagePath);

      // Delete the temp file after copying
      fs.unlinkSync(image.path);
    }

    let reminders = [];

    if (reminderTimes) {
      try {
        let parsedReminders =
          typeof reminderTimes === "string"
            ? JSON.parse(reminderTimes)
            : reminderTimes;

        if (!Array.isArray(parsedReminders)) {
          return res
            .status(400)
            .json({ message: "Invalid reminderTimes format" });
        }

        reminders = parsedReminders
          .filter(
            (reminder) =>
              reminder.type === "daily" ||
              (reminder.type === "specific_date" && reminder.date)
          )
          .map((reminder) => ({
            type: reminder.type,
            date:
              reminder.type === "specific_date"
                ? new Date(reminder.date).toISOString().split("T")[0]
                : undefined,
            time: reminder.time,
            active: true,
          }));
      } catch (error) {
        return res
          .status(400)
          .json({ message: "Invalid reminderTimes format" });
      }
    }
    const event = new Event({
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      category,
      name,
      createdBy: req.user._id,
      imagePath,
      reminders,
      invitees: invitees ? invitees.split(",") : [],
      visibility,
    });

    await event.save();

    return res
      .status(200)
      .json({ success: true, message: "Event created successfully", event });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get all event:-
export const getAllEvent = async (req, res) => {
  try {
    const event = await Event.find({});
    const totalEvents = event.length;
    return res.status(200).json({
      success: true,
      message: "get all event succesfully",
      event,
      totalEvents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get single event:-
export const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    return res
      .status(200)
      .json({ success: true, message: "get single event succesfully", event });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get category wise event:-
export const getEventsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    // Check if category exists
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch events for the category
    const events = await Event.find({ category }).populate("category");

    return res.status(200).json({
      success: true,
      categoryName: category.name,
      events,
    });
  } catch (error) {
    console.log("Error fetching events by category:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Fetch Events - Only for logged-in Organizer
export const getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;
    const events = await Event.find({ createdBy: organizerId }).populate(
      "category"
    );

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//delete event:-
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Delete succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//update event:-
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      category,
      name,
    } = req.fields;
    const { image } = req.files;

    let event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    let imagePath = event.imagePath;

    if (image) {
      const uploadDir = path.join(__dirname, "../uploads");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      const imageFileName = `${Date.now()}_${image.name}`;
      imagePath = `/uploads/${imageFileName}`;
      fs.copyFileSync(image.path, path.join(uploadDir, imageFileName));
      fs.unlinkSync(image.path);
    }

    event.set({
      title,
      description,
      date,
      startTime,
      endTime,
      venue,
      category,
      name,
      imagePath,
    });

    await event.save();
    return res
      .status(200)
      .json({ success: true, message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//search event:-
export const searchEvents = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    
    const events = await Event.find({
      title: { $regex: query, $options: "i" },
    });

    res.json(events);
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({ message: "Server error" });
  }
};
