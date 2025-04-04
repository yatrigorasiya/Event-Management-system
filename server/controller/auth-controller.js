import { User } from "../model/user-model.js";
import { sendEmail } from "../utils/emailService.js";

// Generate OTP Function
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
console.log("generateotp", generateOTP());

//Send OTP to Email for Registration
export const sendOTPForRegistration = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    const user = new User({ email, username, password, role, otp, otpExpires });
    await user.save();

    await sendEmail(
      email,
      "Your OTP Code",
      `Your OTP code is ${otp}. It will expire in 5 minutes.`
    );

    res.json({
      message: "OTP sent to your email",
      user,
      token: await user.generateToken(),
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//resend otp:-

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate new OTP and expiry time
    const newOTP = generateOTP();
    user.otp = newOTP;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    await user.save();

    await sendEmail(
      email,
      "Your New OTP Code",
      `Your new OTP code is ${newOTP}. It will expire in 5 minutes.`
    );

    res.json({ success: true, message: "New OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//registration with verify otp:-
export const registerUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is correct, allow user to set password
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(201).json({
      success: true,
      message: "OTP verified. Proceed to set password.",
    });

    // res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login with Email & Password
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "email not exist" });
    }

    const user = await userExist.comparepassword(password);
    if (user) {
      res.status(200).json({
        success: true,
        message: "Login succesfully",
        userExist,
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//user get:-
export const Users = async (req, res) => {
  try {
    const userdata = req.user;
    console.log("userdata", userdata);
    return res.status(200).json({ userdata });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
//switch role:-

export const switchRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.userId;

    if (!["user", "organizer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (role === "organizer") {
      if (user.role !== "organizer") {
        user.role = "organizer";

        // First time switch, require form submission
        if (!user.isOrganizerApproved) {
          user.isOrganizerApproved = false; // Form needs to be submitted
        }
      }
    } else {
      user.role = "user"; // Switching back to "user" does not reset approval
    }

    await user.save();

    res.json({
      success: true,
      message: `Role updated to ${role}`,
      isOrganizerApproved: user.isOrganizerApproved,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
//organizer form:-

export const submitOrganizerForm = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "organizer") {
      return res.status(400).json({ message: "User is not an organizer" });
    }

    if (user.isOrganizerApproved) {
      return res.status(400).json({ message: "Form already submitted!" });
    }

    user.isOrganizerApproved = true; // Approve the user permanently
    await user.save();

    console.log("Updated User:", user); // Debugging log

    res.json({
      success: true,
      message: "Organizer form submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//access the organizer dashboard:-

export const accessOrganizerDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    console.log("usertd", userId);

    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("user data", user);
    console.log("isOrganizerApproved:", user.isOrganizerApproved); // Check if true

    if (user.role !== "organizer") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!user.isOrganizerApproved) {
      return res.status(403).json({
        message: "Access denied. Please complete the organizer form first.",
      });
    }

    res.json({
      success: true,
      message: "Access granted to organizer dashboard",
    });
  } catch (error) {
    console.error("Error accessing organizer dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//admin access:-
export const adminaccess = async (req, res) => {
  try {
    const { userId } = req;
    console.log("userId", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "User is already an Admin" });
    }

    user.isAdmin = true;
    await user.save();

    res.status(200).json({ message: "Admin access granted!", isAdmin: true });
  } catch (error) {
    res.status(500).json({ message: "Error updating admin role", error });
  }
};
//get all user:-

export const Adminuser = async (req, res) => {
  try {
    const users = await User.find({});
    const totalUsers = users.filter((user) => user.role === "user").length;
    const totalOrganizers = await User.countDocuments({ role: "organizer" });

    if (!users || users.length === 0) {
      return res.status(400).json({ message: "not found the user" });
    }
    return res
      .status(200)
      .json({ success: true, totalUsers, totalOrganizers, users });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete user:-
export const Deleteuser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Delete successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//update user:-

export const Updateuser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedata = req.body;
    const updateuser = await User.findByIdAndUpdate(
      id,
      { $set: updatedata },
      { new: true }
    );
    if (!updateuser) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ success: true, updateuser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
