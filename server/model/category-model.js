import mongoose from "mongoose";
const categorySchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    imagePath: {
        type:String,
        required: false,
      },
    slug:{
        type:String,
        lowercase:true,
    },

})

export const Category = new mongoose.model("Category",categorySchema)