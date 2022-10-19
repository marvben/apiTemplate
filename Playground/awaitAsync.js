// const { promiseImpl } = require("ejs");

// const add = (a, b) => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(a + b);
//     }, 3000);
//   });
// };

// const resolveAdd = async () => {
//   const suma = await add(32, 50);
//   console.log(suma);

//   const sumb = await add(32, suma);
//   console.log(sumb);

//   const sumc = await add(sumb, suma);
//   console.log(sumc);

//   const sumd = await add(sumb, sumc);
//   console.log(sumd);

//   const finalResult = Promise.all([suma, sumb, sumc, sumd]);
//   return finalResult;
// };

// resolveAdd()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

require("../src/db/db");
const User = require("../src/models/user");
const Task = require("../src/models/task");

// User.find({}, (err, result) => {
//   console.log(result);
// });

// const updateAndCountUsers = async (id, age) => {
//   const user = await User.findByIdAndUpdate(id, { age: age });
//   const count = await User.countDocuments({ age: 32 });
//   return { user, count };
// };

// updateAndCountUsers("634626500da9ab4fb2472b65", 32)
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// Task.find({}, (err, result) => {
//   console.log(result);
// });

const deleteAndCountTasks = async (id, completed) => {
  const deletedTask = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({ completed: completed });
  return { deletedTask, count };
};

deleteAndCountTasks("63468bfc1fa0c9efb33fb221", true)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

const user = new User(req.body);

user
  .save()
  .then((result) => res.status(201).send(result))
  .catch((error) => {
    res.status(400).send(error.errors);
  });
