import mongoose from "mongoose";
export const contactSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

export const Contact = new mongoose.model("Contact", contactSchema);
