import { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

export const Adminuser = () => {
  const [user, setUser] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
  });
  const featchUserdata = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/auth/adminuser"
      );
      console.log(data.users);
      setUser(data.users);
    } catch (error) {
      console.log("user error", error);
    }
  };

  useEffect(() => {
    featchUserdata();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/auth/deleteuser/${id}`);
      featchUserdata();
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Edit Click (Opens Modal)
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Update User
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/auth/updateuser/${selectedUser._id}`,
        formData
      );
      setIsEditModalOpen(false);
      featchUserdata();
    } catch (error) {
      console.log("Update failed:", error);
    }
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4"> Users</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr className="text-left bg-gray-700 text-white">
                <th className="px-4 py-3 border-b"></th>
                <th className="px-4 py-3 border-b">Username</th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Role</th>
                <th className="px-4 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {user.length > 0 ? (
                user.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md transition mr-3"
                        onClick={() => handleEditClick(user)}
                      >
                        <FaEdit className="text-md" />
                      </button>

                      <button
                        className="bg-red-700 hover:bg-red-800 text-white p-2 rounded-lg shadow-md transition"
                        onClick={() => handleDelete(user._id)}
                      >
                        <FaTrash className="text-md" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
              placeholder="Username"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
              placeholder="Email"
            />
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 mb-3 border rounded"
              placeholder="Role"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white p-2 rounded mr-2"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
