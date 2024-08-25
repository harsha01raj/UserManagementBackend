const express = require("express");
const auth = require("../middleware/authMiddleware");
const TaskModel = require("../model/taskModel");
const UserModel = require("../model/userModel");
const authorizeRole = require("../middleware/authorizeRole");

const userRouter = express.Router();

userRouter.get("/all-user",authorizeRole('admin'),auth,async(req,res)=>{
  try {
    const user=await UserModel.find();
    if(!user){
      res.status(404).json({"Message":"User not found."})
    }
    res.status(200).json({"User":user})
  } catch (error) {
    res.status(400).json({"Message":error.message})
  }
})
userRouter.get("/stats", authorizeRole('admin'), auth, async (req, res) => {
  try {
    const totalTasks = await TaskModel.countDocuments();
    const completedTasks = await TaskModel.countDocuments({
      status: "completed",
    });
    const averageCompleted = totalTasks ? completedTasks / totalTasks : 0;
    res.json({ totalTasks, completedTasks, averageCompleted });
  } catch (error) {
    res.status(500).json({ Message: error.message });
  }
});

userRouter.patch(
  "/status/:id",
  authorizeRole("admin"),
  auth,
  async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id.trim());
      if (!user) return res.status(404).json({ Message: "User not found..." });
      console.log(user.isActive);
      user.isActive = !user.isActive;
      await user.save();
      res.json({ Message: `User ${user.isActive ? "enabled" : "disabled"}` });
    } catch (error) {
      res.status(500).json({ Message: error.message });
    }
  }
);

module.exports = userRouter;
