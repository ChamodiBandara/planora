import React, { useState } from "react";
import { CheckCircle, Clock, Trash2, PlusCircle, XCircle } from "lucide-react";
import API from "../../api";

export default function Tasks({ event, members, tasks, setTasks }) {
  // keep new task details (title, deadline, assigned member)
  const [newTask, setNewTask] = useState({ title: "", deadline: "", assignedTo: "" });
  // store error messages
  const [error, setError] = useState("");
  // to show and hide the add task form
  const [showForm, setShowForm] = useState(false);

  // function to add a new task
  const addTask = async () => {
    setError("");
    // check  all fields are filled
    if (!newTask.title || !newTask.deadline || !newTask.assignedTo) {
      setError("All task fields required");
      return;
    }

    // find the selected member and prepare task object
    const member = members.find((m) => m.email === newTask.assignedTo);
    const taskToSend = {
      ...newTask,
      assignedTo: { name: member.name, email: member.email },
    };

    try {
      // send task to backend
      const res = await API.post(`/events/${event._id}/tasks`, taskToSend);
      // update tasks list in UI
      setTasks(res.data.tasks);
      // clear the form
      setNewTask({ title: "", deadline: "", assignedTo: "" });
      // hide the form after saving
      setShowForm(false);
    } catch (err) {
      // show error if failed
      setError(err.response?.data.error || "Failed to add task");
    }
  };

  // function to change task status (Pending - Done)
  const toggleTaskStatus = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;
    const newStatus = task.status === "Pending" ? "Done" : "Pending";

    try {
      // update this task's status in the backend database using PATCH request
      const res = await API.patch(`/events/${event._id}/tasks/${taskId}`, { status: newStatus });
      // update only that task in the list
      setTasks(tasks.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  // function to delete a task
  const deleteTask = async (taskId) => {
    // ask before deleting
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      // remove from backend
      await API.delete(`/events/${event._id}/tasks/${taskId}`);
      // remove from frontend list
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Tasks</h2>
      {/* show error if exists */}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* list all tasks */}
      <ul className="space-y-3 mb-4">
        {tasks.map((t, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-white shadow px-4 py-3 rounded-lg"
          >
            <div>
              {/* show title and details */}
              <p className="font-medium">{t.title}</p>
              <p className="text-sm text-gray-500">
                Deadline: {new Date(t.deadline).toLocaleDateString()} | Assigned to:{" "}
                {t.assignedTo?.name} ({t.assignedTo?.email})
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* button to toggle status when member mark the complete */}
              <button
                onClick={() => toggleTaskStatus(t._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  t.status === "Done"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {t.status === "Done" ? <CheckCircle size={18} /> : <Clock size={18} />}
                {t.status}
              </button>
              {/* button to delete */}
              <button
                onClick={() => deleteTask(t._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* button to show form if it's hidden */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          <PlusCircle size={18} /> Add Task
        </button>
      ) : (
        // form for adding new task
        <div className="border p-4 rounded-lg bg-gray-50 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-lg">Add New Task</h3>
            {/* close button (X) */}
            <button onClick={() => setShowForm(false)} className="text-gray-600 hover:text-red-600">
              <XCircle size={22} />
            </button>
          </div>

          <div className="grid">
            {/* task title input */}
            <label className="block text-gray-700 font-medium mb-1">Task Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task Title"
              className="border px-3 py-2 rounded-lg mb-3"
            />

            {/* deadline input */}
            <label className="block text-gray-700 font-medium mb-1">Deadline</label>
            <input
              type="date"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              className="border px-3 py-2 rounded-lg mb-3"
            />

            {/* assign to dropdown */}
            <label className="block text-gray-700 font-medium mb-1">Assign To</label>
            <select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
              className="border px-3 py-2 mb-3 rounded-lg"
            >
              <option value="">Choose Members</option>
              {members.map((m) => (
                <option key={m.email} value={m.email}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>

          {/* save and cancel buttons */}
          <div className="flex gap-3 mt-3">
            <button
              onClick={addTask}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
            >
              Save Task
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
