const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const Task = require("./task");

main().catch((err) => console.log(err));

async function main() {
  const url = "mongodb://localhost:27017/task-manager-api-DB";
  await mongoose.connect(url);
}

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      unique: true,
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Your password is shouldn't contain 'password'");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
    avatar: {
      type: Buffer,
    },
    tokens: [
      {
        token: { type: String, required: true, trim: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

//creating relationship between users and task they created
userSchema.virtual("userTasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "author",
});

// to remove items we don't want to return back to user e.g password and tokens. Used toJSON object to achieve that
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

//getting users token with jwt
userSchema.methods.getAuthToken = async function () {
  const user = this;
  const newToken = jwt.sign({ _id: user._id.toString() }, "sekret12345");
  user.tokens = user.tokens.concat({ token: newToken });
  await user.save();

  return newToken;
};

//verifying user login
userSchema.statics.findByUserDetails = async (userEmail, userPassword) => {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(userPassword, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

//hashing user password
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, saltRounds);
  }

  next();
});

//Delete user's tasks when deleting users account

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ author: user._id });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
