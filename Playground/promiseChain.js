require("../src/db/db");
const User = require("../src/models/user");
const Task = require("../src/models/task");

// User.find({})
//   .then((results) => {
//     console.log(results);
//     console.log(">>>>>>>>>>>>>NEXT OPERATION>>>>>>>>>>>>>>>>>>>>>>>>>");

//     return User.findByIdAndUpdate("63468aa391fdae1a83c8918b", { name: "Chi" });
//   })
//   .then((result1) => {
//     console.log(result1.name);
//     console.log(">>>>>>>>>>>>>NEXT OPERATION>>>>>>>>>>>>>>>>>>>>>>>>>");

//     return User.countDocuments({ name: "Chi" });
//   })
//   .then((result2) => {
//     console.log(result2);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Task.find({}).then((results) => {
//   console.log(results);
//   console.log(">>>>>>>>>>>>>NEXT OPERATION>>>>>>>>>>>>>>>>>>>>>>>>>");
// });

Task.findByIdAndDelete("6346179a34420d3789af5dce")
  .then((res) => {
    console.log(res.description);
    return Task.countDocuments({ completed: true });
  })
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
