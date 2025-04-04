import express from "express";
import {
  accessOrganizerDashboard,
  adminaccess,
  Adminuser,
  Deleteuser,
  loginUser,
  registerUser,
  resendOTP,
  sendOTPForRegistration,
  submitOrganizerForm,
  switchRole,
  Updateuser,
  Users,
} from "../controller/auth-controller.js";

import { authmiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();
//send otp
router.route("/send-otp").post(sendOTPForRegistration);
//resend otp
router.route("/resend-otp").post(resendOTP);
//register
router.route("/register").post(registerUser);
//login
router.route("/login").post(loginUser);
//get user data
router.route("/user").get(authmiddleware, Users);
//switch role
router.route("/switch-role").post(authmiddleware, switchRole);
//organizer-form
router.route("/organizer-form").post(authmiddleware, submitOrganizerForm);
//access organizer dashboard
router.route("/access-organizer-dashboard").get(authmiddleware,accessOrganizerDashboard)
//admin access
router.route("/request-admin").post(authmiddleware,adminaccess)
//admin user
router.route("/adminuser").get(Adminuser);
//delete user
router.route("/deleteuser/:id").delete(Deleteuser)
//update user
router.route("/updateuser/:id").put(Updateuser)
export default router;
