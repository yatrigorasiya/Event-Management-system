import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDb } from "./utils/db.js";
import router from "./router/auth-router.js";
import eventrouter from "./router/event-router.js";
import categoryrouter from "./router/category-router.js";
import bookrouter from "./router/booking-router.js";
import contactrouter from "./router/contact-router.js";

import { errormiddleware } from "./middleware/error-middleware.js";

import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "./utils/reminder.js";

const corsoption = {
  origin: "https://event-management-system-7f43.vercel.app",
  methods: "GET,POST,PATCH,PUT,DELETE,HEAD",
  credentials: true,
};
const app = express();
connectDb();

app.use(cors(corsoption));

app.use(express.json());
app.use("/api/auth", router);
app.use("/api/event", eventrouter);
app.use("/api/category", categoryrouter);
app.use("/api/book", bookrouter);
app.use("/api/contact", contactrouter);

app.use(errormiddleware);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static images from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../client/public/uploads"))
);

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Event management system" });
});
app.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}`);
});
