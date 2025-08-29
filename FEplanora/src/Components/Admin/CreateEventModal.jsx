import React, { useState, useEffect } from "react";

export default function CreateEventModal({ onClose, onCreate, onUpdate, eventEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    description: "",
    code: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (eventEdit) {
      setFormData({
        name: eventEdit.name || "",
        location: eventEdit.location || "",
        date: eventEdit.date ? eventEdit.date.split("T")[0] : "",
        description: eventEdit.description || "",
        code: eventEdit.code || ""
      });
    } else {
      setFormData({ name: "", location: "", date: "", description: "", code: "" });
    }
  }, [eventEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, location, date, code } = formData;
    if (!name || !location || !date || !code) {
      setError("Please fill in all required fields");
      return;
    }

   try {
      if (eventEdit && eventEdit._id) {
        // ✅ Edit existing event
        await onUpdate(eventEdit._id, formData);
      } else {
        // ➕ Create new event
        await onCreate(formData);
      }
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to save event");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl text-center font-semibold mb-4 text-indigo-700">
          {eventEdit ?"Edit Event" : "Create New Event"}
        </h2>
      {/* Error message */}
        {error && <p className="text-red-500 mb-2">{error}</p>}
{/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Event Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Event Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Event Code(Unique code to Identify Your Event)</label>
            <input name="code" value={formData.code} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {eventEdit ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
