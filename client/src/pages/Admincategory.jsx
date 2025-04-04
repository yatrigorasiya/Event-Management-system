import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

export const Admincategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/get-category`
      );
      setCategories(response.data.category);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  //  category creation or update
  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      let response;
      if (editingCategory) {
        // Update existing category
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/update/${
            editingCategory._id
          }`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Create new category
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/create`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setMessage(response.data.message);
      setName("");
      setImage(null);
      setError(null);
      setEditingCategory(null);
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Error processing category");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/category/delete-category/${id}`
      );
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  // Open modal with existing category for editing
  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setImage(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-end">
          <button
            onClick={() => {
              setEditingCategory(null); // Reset for new category
              setName("");
              setImage(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
          >
            Create Category
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Category List</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr className="text-left bg-gray-700 text-white">
                  <th className="px-4 py-3 border-b">Image</th>
                  <th className="px-4 py-3 border-b">Category Name</th>
                  <th className="px-4 py-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        {category.imagePath && (
                          <img
                            src={category.imagePath}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-md text-gray-800">
                        {category.name}
                      </td>
                      <td>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition mr-3"
                          onClick={() => handleEdit(category)}
                        >
                          <FaEdit className="text-md" />
                        </button>

                        <button
                          className="bg-red-700 hover:bg-red-800 text-white p-2 rounded-lg shadow-md transition"
                          onClick={() => handleDelete(category._id)}
                        >
                          <FaTrash className="text-md" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingCategory ? "Edit Category" : "Create Category"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                  setName("");
                  setImage(null);
                }}
                className="text-gray-600 hover:text-gray-900 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCategorySubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="category-image"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="category-image"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {editingCategory?.imagePath && (
                  <img
                    src={editingCategory.imagePath}
                    alt={editingCategory.name}
                    className="w-16 h-16 object-cover rounded-md mt-2"
                  />
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {editingCategory ? "Update Category" : "Create Category"}
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            {message && (
              <p className="text-green-500 text-sm mt-4">{message}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
