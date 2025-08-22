require("dotenv").config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})
const express = require("express");
const app = express();
const connectToDB = require("./database/connectToDB")
connectToDB();
const authRouter = require("./routes/auth.routes");
const tasksRouter = require("./routes/tasks.routes")
const { authenticateToken, verfiyTask } = require("./middlewares/auth.middleware");

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post("/token", authenticateToken, (req,res) => {
  res.send(req.user)
})

app.use('/auth', authRouter);
app.use('/tasks', authenticateToken, verfiyTask, tasksRouter)

app.listen(process.env.PORT, () => console.log(`server running at: ${process.env.PORT}`))