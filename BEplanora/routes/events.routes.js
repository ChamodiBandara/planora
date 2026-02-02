
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Event routes
router.post("/", eventController.createEvent);
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.delete("/:id", eventController.deleteEvent);
router.put("/:id", eventController.updateEvent); 

// Members & Tasks within an event
router.post("/:id/members", eventController.addMember);
router.post("/:id/tasks", eventController.addTask);
router.delete("/:id/members/:memberId", eventController.deleteMember);
router.delete("/:id/tasks/:taskId", eventController.deleteTask);

router.patch("/:eventCode/tasks/:taskId", eventController.updateTaskStatus);

module.exports = router;
