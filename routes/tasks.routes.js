const express = require("express")
const router = express.Router()
const { showTasks, addTask, editTask, deleteTask } = require("../controllers/tasks.controller")

// show all tasks based on user
router.get("/show", showTasks)

// add a new task
router.post("/add", addTask)

// edit tasks
router.post("/edit", editTask)

// delete tasks
router.delete("/delete", deleteTask)

module.exports = router;