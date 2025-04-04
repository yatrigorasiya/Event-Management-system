import express from "express"
import { contactForm } from "../controller/contact-controller.js"
const router = express.Router()
router.route("/contact-details").post(contactForm)
export default router