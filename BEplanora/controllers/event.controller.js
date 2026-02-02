const Event = require("../models/Event");
const Member = require("../models/Member");

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { name, code, location, date, description } = req.body;

    if (!name || !code || !location || !date) {
      return res.status(400).json({
        error: "Missing required fields: name, code, location, date"
      });
    }

    const existingEvent = await Event.findOne({ code });
    if (existingEvent) return res.status(400).json({ error: "Event code already exists" });

    const event = new Event({ name, code, location, date, description });
    await event.save();

    res.status(201).json(event);
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(500).json({ error: "Server error while creating event" });
  }
};


// Get all events (optionally filter by code)
exports.getEvents = async (req, res) => {
  const { code } = req.query;
  try {
    const events = code ? await Event.find({ code }) : await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update the event details
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    // Check if the new code exists in another event
    if (code) {
      const existingEvent = await Event.findOne({ code, _id: { $ne: id } });
      if (existingEvent) {
        return res.status(400).json({ error: "Event code already exists, use a different one" });
      }
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (err) {
    console.error("Update Event Error:", err);

    // Handle duplicate key error (in case Mongoose throws one)
    if (err.code === 11000) {
      return res.status(400).json({ error: "Event code already exists, use a different one" });
    }

    res.status(500).json({ error: "Server error while updating event" });
  }
};

// Add member to event
exports.addMember = async (req, res) => {
  const { email, name } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if this member already exists in the event
    if (event.members.find((m) => m.email === email)) {
      return res.status(400).json({ error: "Email already exists in this event" });
    }

    // Check if member exists globally
    let member = await Member.findOne({ email });

    if (member) {
      // Add this event to their list if not already there
      if (!member.events.includes(event.code)) {
        member.events.push(event.code);
        await member.save();
      }
    } else {
      // Create new global member
      member = new Member({ email, name, events: [event.code] });
      await member.save();
    }

    // Add member to event.members with unique _id (handled by schema)
    event.members.push({ email, name });
    await event.save();

    res.json({ message: "Member added successfully", eventMembers: event.members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete member from event
exports.deleteMember = async (req, res) => {
  const { memberId } = req.params;

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Find member by _id
    const memberIndex = event.members.findIndex(
      (m) => m._id && m._id.toString() === memberId
    );

    if (memberIndex === -1) {
      return res.status(404).json({ error: "Member not found in this event" });
    }

    // Remove the member
    event.members.splice(memberIndex, 1);
    await event.save();

    res.json({ message: "Member removed successfully", eventMembers: event.members });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Create a task
exports.addTask = async (req, res) => {
  const { title, deadline, assignedTo } = req.body;

  if (!title || !deadline || !assignedTo?.name || !assignedTo?.email) {
    return res.status(400).json({ error: "All task fields are required" });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const newTask = { title, deadline, assignedTo };
    event.tasks.push(newTask);
    await event.save();

    res.status(201).json({ tasks: event.tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// Function to update the status of a specific task inside an event
exports.updateTaskStatus = async (req, res) => {
  try {
     // Find the event in the database by its _id from the URL
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
 // Find the specific task inside the event's tasks array using taskId from URL
    const task = event.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });
 // Update the task's status with the value from request body, or keep it as is if not provided
    task.status = req.body.status || task.status;
    await event.save();
 // Save the updated event back to the database
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
//Delete task
exports.deleteTask = async (req, res) => {
  try {
    const { id, taskId } = req.params;

    console.log("Event ID:", id);
    console.log("Task ID:", taskId);

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Find the task index
    const taskIndex = event.tasks.findIndex(t => t._id.toString() === taskId);
    if (taskIndex === -1) return res.status(404).json({ error: "Task not found in event" });

    // Remove task
    event.tasks.splice(taskIndex, 1);
    await event.save();

    res.json({ message: "Task deleted successfully", tasks: event.tasks });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.updateTaskStatus = async (req, res) => {
  const { eventCode, taskId } = req.params;
  const { status } = req.body;

  try {
    // Find the event and update the specific task status
    const event = await Event.findOneAndUpdate(
      { code: eventCode, "tasks._id": taskId },
      { $set: { "tasks.$.status": status } },
      { new: true }
    );

    if (!event) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task updated successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


