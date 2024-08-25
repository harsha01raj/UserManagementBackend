const express = require("express");
const auth = require("../middleware/authMiddleware");
const TaskModel = require("../model/taskModel");
const authorizeRole = require("../middleware/authorizeRole");

const TaskRouter = express.Router();

TaskRouter.post("/add-task", authorizeRole("member"), async (req, res) => {
  const { title, description, status } = req.body;
  if ((!title, !description, !status)) {
    return res
      .status(404)
      .json({ Message: "All required field is not present in the body" });
  }
  try {
    const task = new TaskModel({
      title,
      description,
      status,
      createdBy: req.user.user._id,
    });
    await task.save();
    res.status(200).json({ Message: "Task is added successfully", Task: task });
  } catch (error) {
    res.status(400).json({ Message: error });
  }
});

TaskRouter.get("/get-task", authorizeRole("member"), async (req, res) => {
  try {
    const task = await TaskModel.find({ createdBy: req.user.user._id });
    if (!task) {
      return res
        .status(404)
        .json({ Message: "Not task is created by this user" });
    }
    res.status(200).json({ Task: task });
  } catch (error) {
    res.status(400).json({ Message: error.message });
  }
});

TaskRouter.put("/update/:id", authorizeRole("member"), async (req, res) => {
  try {
    const updatedtask = await TaskModel.findByIdAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.user._id,
      },
      req.body
    );
    console.log(updatedtask);
    await updatedtask.save();
    res
      .status(200)
      .json({ Message: "You Status is updated", updatedtask: updatedtask });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
});

TaskRouter.delete("/delete/:id", authorizeRole("member"), async (req, res) => {
  try {
    const deletedtask = await TaskModel.findByIdAndDelete({
      _id: req.params.id,
      createdBy: req.user.user._id,
    });
    if (!deletedtask) {
      return res
        .status(404)
        .json({ message: "Book not found or not authorized to delete" });
    }
    res.status(200).json({
      Message: "Task is deleted successfully",
      DeleteTask: deletedtask,
    });
  } catch (error) {
    res.status(400).json({ Message: error.message });
  }
});

TaskRouter.get("/all-document" , async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.status(200).json({ Task: tasks });
  } catch (error) {
    res.status(400).json({ Message: error.message });
  }
});
module.exports = TaskRouter;
