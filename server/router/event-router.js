import express from "express";
import { authmiddleware } from "./../middleware/auth-middleware.js";
import {
  createEvent,
  deleteEvent,
  getAllEvent,
  getEventsByCategory,
  getOrganizerEvents,
  getSingleEvent,
  searchEvents,
  updateEvent,
} from "../controller/event-controller.js";
import formidable from "express-formidable";

const router = express.Router();
//create event
router.route("/create").post(authmiddleware, formidable(), createEvent);
//get all event
router.route("/getevent").get(getAllEvent);
//get single event
router.route("/getsingleevent/:id").get(getSingleEvent);
//filter
router.route("/category/:slug").get(getEventsByCategory);
// GET Events - Only for logged-in organizer
router.route("/oranizerevents").get(authmiddleware, getOrganizerEvents);
//delete event:-
router.route("/delete-event/:id").delete(deleteEvent)
//update event:-
router.route("/update/:id").put(authmiddleware,formidable(),updateEvent)
//search event:-
router.route("/search").get(searchEvents)
export default router;
