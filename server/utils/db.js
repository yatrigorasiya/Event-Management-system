import mongoose from "mongoose";

//connect db:-
export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connection succesfully");
  } catch (error) {
    console.log("connection fail");
    process.exit(1);
  }
};
