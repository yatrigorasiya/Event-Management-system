import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Select } from "antd";

import { useNavigate } from "react-router-dom";
const { Option } = Select;

export const Organizer = ({ eventId, closePopup, refreshEvents }) => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: "",
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    venue: "",
    reminderTimes: [],
    invitees: "",
    image: null,
    visibility: "public",
  });
  const [preview, setPreview] = useState(null);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    getAllcategory();
    if (eventId) {
      fetchEventDetails(eventId); // Fetch event details if editing
    }
  }, [eventId]);

  //fetch category details:-

  const getAllcategory = async () => {
    try {
      const { data } = await axios.get(
         `${import.meta.env.VITE_BACKEND_URL}/category/get-category`
      );
      console.log(data.category);
      setCategories(data.category);
    } catch (error) {
      console.log("get category error", error);
    }
  };
  //fetch event details:-

  const fetchEventDetails = async (eventId) => {
    try {
      const { data } = await axios.get(
        ` ${import.meta.env.VITE_BACKEND_URL}/event/getsingleevent/${eventId}`
      );
      if (data.event) {
        setEventData({
          ...data.event,
          date: data.event.date
            ? new Date(data.event.date).toISOString().split("T")[0]
            : "",
          invitees: data.event.invitees ? data.event.invitees.join(", ") : "",
          reminderTimes: data.event.reminderTimes || [],
        });
        setCategory(data.event.category || "");
        setReminders(data.event.reminderTimes || []); 
        setPreview(
          data.event.image
            ? `${import.meta.env.VITE_IMG_URL}/uploads/${data.event.image}`
            : null
        );
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };
  //handle input field:-

  const handleInput = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files.length > 0) {
      const file = files[0];
      setEventData({ ...eventData, image: file });

      // Update preview with selected file
      setPreview(URL.createObjectURL(file));
    } else if (name !== "image") {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const addReminder = () => {
    const newReminders = [...reminders, { type: "daily", time: "", date: "" }];
    setReminders(newReminders);
    console.log("Updated Reminders:", newReminders);
  };

  const updateReminder = (index, field, value) => {
    const newReminders = [...reminders];
    newReminders[index][field] = value;
    setReminders(newReminders);
    console.log("Updated Reminders:", newReminders);
  };

  const removeReminder = (index) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  //handle submit:-

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting event data:", eventData);
    // Ensure reminders are correctly assigned
    const updatedEventData = {
      ...eventData,
      reminderTimes: reminders, // Assign the updated reminders array
    };
    console.log("Submitting event data:", updatedEventData); 

    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("visibility", updatedEventData.visibility);
      formData.append(
        "reminderTimes",
        JSON.stringify(updatedEventData.reminderTimes)
      );

      Object.keys(updatedEventData).forEach((key) => {
        if (updatedEventData[key] && key !== "reminderTimes") {
          formData.append(key, updatedEventData[key]);
        }
      });

    

      const token = localStorage.getItem("token");

      const url = eventId
        ?  `${import.meta.env.VITE_BACKEND_URL}/event/update/${eventId}`
        :  `${import.meta.env.VITE_BACKEND_URL}/event/create`;

      const method = eventId ? axios.put : axios.post;

      await method(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      closePopup();
      refreshEvents();

      toast.success(
        eventId ? "Event updated successfully!" : "Event created successfully!"
      );

      navigate("/event");
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response?.data || error.message
      );
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
          {eventId ? "Edit Event" : "Create Event"}
        </h1>
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "name",
              "title",
              "description",
              "startTime",
              "endTime",
              "venue",
            ].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                value={eventData[field]}
                onChange={handleInput}
                required
                placeholder={field}
                className="w-full px-3 py-2 border rounded-lg"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleInput}
              required
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* Reminder Section */}
          <div className="space-y-2">
            <label className="font-bold text-gray-700">Reminders</label>
            {reminders.map((reminder, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  value={reminder.type}
                  onChange={(value) => updateReminder(index, "type", value)}
                  className="w-32"
                >
                  <Option value="daily">Daily</Option>
                  <Option value="specific_date">Specific Date</Option>
                </Select>

                {reminder.type === "specific_date" && (
                  <input
                    type="date"
                    value={reminder.date}
                    onChange={(e) =>
                      updateReminder(index, "date", e.target.value)
                    }
                    className="px-2 py-1 border rounded-lg"
                  />
                )}

                <input
                  type="time"
                  value={reminder.time}
                  onChange={(e) =>
                    updateReminder(index, "time", e.target.value)
                  }
                  className="px-2 py-1 border rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => removeReminder(index)}
                  className="text-red-500"
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addReminder}
              className="text-green-600"
            >
              + Add Reminder
            </button>
          </div>

          {/* Invitees */}
          <input
            type="text"
            name="invitees"
            value={eventData.invitees}
            onChange={handleInput}
            placeholder="Invitees (comma-separated emails)"
            className="w-full px-3 py-2 border rounded-lg"
          />

          {/* Category & Visibility Select Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              bordered={false}
              placeholder="Select a category"
              size="large"
              showSearch
              className="w-full border rounded-lg px-3 py-2"
              value={category}
              onChange={(value) => setCategory(value)}
            >
              {categories?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>

            <Select
              value={eventData.visibility}
              onChange={(value) =>
                setEventData({ ...eventData, visibility: value })
              }
              className="w-full border rounded-lg px-3 py-2"
              bordered={false}
            >
              <Option value="public">Public</Option>
              <Option value="private">Private</Option>
            </Select>
          </div>

          {/* Image Upload */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleInput}
            className="w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 mx-auto object-cover border rounded-lg"
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            {eventId ? "Edit Event" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};
