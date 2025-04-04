import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  updateCategory,
} from "../controller/category-controller.js";
import formidable from "express-formidable";

const router = express.Router();

//create category
router.route("/create").post(formidable(), createCategory);
//get category
router.route("/get-category").get(getCategory);
//delete category:-
router.route("/delete-category/:id").delete(deleteCategory);

//update category:-
router.route("/update/:id").put(formidable(), updateCategory);
export default router;
