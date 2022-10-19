const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../config/.env") });
const express = require("express");
const userRouter = require("./routes/userRoute");
const taskRouter = require("./routes/taskRoute");
const app = express();
const port = process.env.PORT;

//Without middleware: new request -> run router handler
//With middleware: new request ->run middleware -> run router handler
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disabled");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   res.status(501).send("Website is currently on maintenance mode");
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => {
  console.log("app listening on port", port);
});

const Task = require("./models/task");
const User = require("./models/user");
