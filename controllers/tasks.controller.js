
const showTasks = async (req, res) => {
  const task = req.task;

  if (Array(task.tasks).length === 0) {
    return res.status(404).json({
      success: true,
      message: "No tasks available",
      tasks: []
    })
  }

  res.status(200).json({
    success: true,
    message: "Found tasks",
    tasks: task.tasks
  })
}

const addTask = async (req, res) => {
  const task = req.task;
  const { newTask } = req.body;

  try {

    task.tasks.push(`${task.numberOfTasks}-${newTask}`);

    task.numberOfTasks++;

    await task.save();

    return res.status(201).json({
      success: true,
      message: "new task added",
      newTask: task.tasks[task.tasks.length - 1]
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

const editTask = async (req, res) => {
  const task = req.task;
  const { replacementNumber, newTask } = req.body;

  let replacementIndex = task.tasks.findIndex(v => v.split("-")[0] === String(replacementNumber));

  if (replacementIndex === -1 ) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    })
  }

  task.tasks[replacementIndex] = `${replacementNumber}-${newTask}`

  try {
    await task.save();

    res.status(200).json({
      success: true,
      message: "modified task successfully",
      newTask: task.tasks[replacementIndex]
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

const deleteTask = async (req, res) => {
  const task = req.task;
  const {deleteTaskNum} = req.body;

  let deletedTask = task.tasks.find(v => v.split("-")[0] === String(deleteTaskNum));

  task.tasks = task.tasks.filter(v => v.split("-")[0] !== String(deleteTaskNum))

  try {

    await task.save();

    res.status(200).json({
      success: true,
      message: "task deleted successfully",
      deletedTask: deletedTask
    })

  } catch(error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message
    })
  }

}

module.exports = { showTasks, addTask, editTask, deleteTask };