import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//create schema:-
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "organizer", "admin"],
      default: "user",
    },
    isOrganizerApproved: {
       type: Boolean,
        default: false
    },
    isAdmin:{
      type:Boolean,
      default:false
  }
  },
  {
    timestamps: true,
  }
);

//generate hash password:-

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    next();
  }
  try {
    const saltround = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(user.password, saltround);
    user.password = hashpassword;
  } catch (error) {
    next(error);
    console.log("password hash error");
  }
});

//compare password:-
userSchema.methods.comparepassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

//generate token:-
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        role: this.role,
        isAdmin: this.isAdmin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.log("jwt create error", error);
  }
};

// const  userrole ={
//   user:"user",
//   organizer:"organizer"

// }
//create model:-

export const User = new mongoose.model("User", userSchema);
