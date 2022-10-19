require("../db/db");
const taskRouter = require("express").Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

taskRouter
  .post("/tasks", auth, async (req, res) => {
    const task = new Task({ ...req.body, author: req.user._id });

    try {
      await task.save();
      res.status(201).send(task);
    } catch (error) {
      res.status(400).send(error.errors);
    }
  })
  .get("/tasks", auth, async (req, res) => {
    //GET /tasks?complete=true
    //GET /tasks?limit=2&skip=1
    //GET /tasks ? sortBy=createdAt:desc

    const sorted = {};

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sorted[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    try {
      await req.user.populate({
        //added path and match to filter our result from browser query. Options for pagination
        //limit gets number of post at a time/page. skip gets the next page starting from 0 as page 1
        path: "userTasks",
        match: req.query.completed ? req.query : "",
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: sorted,
        },
      });

      res.status(201).send(req.user.userTasks);
    } catch (error) {
      res.status(500).send(error);
    }
  })
  .get("/task/:taskId", auth, async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.taskId, author: req.user._id });
      res.send(task);
    } catch (error) {
      res.status(500).send(error);
    }
  })
  .patch("/task/:taskId", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpatesKeys = ["description", "completed"];
    const isValidCheck = updates.every((update) => allowedUpatesKeys.includes(update));

    if (!isValidCheck) {
      return res.status(400).send({ error: "Invalid update" });
    }

    try {
      // not using Task.findByIdAndUpdate because is a native mongo command but we need to update before using mongoose middleware
      const task = await Task.findOne({ _id: req.params.taskId, author: req.user._id });

      if (!task) {
        return res.status(404).send();
      }
      updates.forEach((update) => (task[update] = req.body[update]));
      await task.save();

      res.send(task);
    } catch (error) {
      res.status(500).send(error);
    }
  })
  .delete("/task/:taskId", auth, async (req, res) => {
    try {
      const task = await Task.findOne({ _id: req.params.taskId, author: req.user._id });

      if (!task) {
        return res.status(404).send();
      }
      task.remove();
      res.send({ "Deleted Task": task });
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = taskRouter;
