import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Category } from "../model/category-model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendUploadDir = path.join(__dirname, "../../client/public/uploads");

// Create category function
export const createCategory = async (req, res) => {
  try {
    const { name } = req.fields;
    const { image } = req.files;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

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

      fs.copyFileSync(image.path, frontendImagePath);

      fs.unlinkSync(image.path);
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create new category
    const newCategory = new Category({
      name,
      imagePath: imagePath,
      slug: name.toLowerCase().replace(/ /g, "-"), // Convert name to lowercase & replace spaces
    });

    await newCategory.save();
    return res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get category:-
export const getCategory = async (req, res) => {
  try {
    const category = await Category.find({});
    return res
      .status(200)
      .json({ success: true, message: "Get category succesfully", category });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
//delete-category:-
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    return res
      .status(200)
      .json({ success: true, message: "Delete succesfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//update-category:-
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.fields;
    const { image } = req.files;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    let updateData = { name, slug: name.toLowerCase().replace(/ /g, "-") };

    if (image) {
      // Ensure the frontend upload directory exists
      if (!fs.existsSync(frontendUploadDir)) {
        fs.mkdirSync(frontendUploadDir, { recursive: true });
      }

      // Generate unique filename
      const imageFileName = `${Date.now()}_${image.name}`;
      const imagePath = `/uploads/${imageFileName}`;
      const frontendImagePath = path.join(frontendUploadDir, imageFileName);

      fs.copyFileSync(image.path, frontendImagePath);

      const category = await Category.findById(id);
      if (category?.imagePath) {
        const oldImagePath = path.join(
          frontendUploadDir,
          path.basename(category.imagePath)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.imagePath = imagePath;

      fs.unlinkSync(image.path);
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res
      .status(200)
      .json({
        message: "Category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
