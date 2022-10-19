require("../db/db");
const userRouter = require("express").Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendGoodbyeEmail } = require("../emails/account");

const upload = multer({
  limits: {
    fileSize: 1000000, //file size in bytes 1million bytes is 1mg
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Only jpg,jpeg,png images are allowed. Please upload an image!"));
    }
    return cb(undefined, true);
    //cd(undefined, false)
  },
});

userRouter
  .post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
      const token = await user.getAuthToken(); //created our function for schema 'getAuthToken'
      await user.save();
      await sendWelcomeEmail(user.email, user.name);
      res.status(201).send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post("/users/login", async (req, res) => {
    try {
      const user = await User.findByUserDetails(req.body.email, req.body.password); //we created our function for schema 'findByUserDetails'
      const token = await user.getAuthToken(); //created our function for schema 'getAuthToken'
      res.send({ user, token });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.errors);
    }
  })
  .post("/users/logout", auth, async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token); //this will return other tokens except the one stored in our req(browsers/device)
      await req.user.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(400).send();
    }
  })
  .post("/users/logoutAll", auth, async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).send();
    }
  })
  .post(
    "/users/profile/avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
      const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.status(200).send();
      //res.send(req.user);
    },
    (error, req, res, next) => {
      //this functions is to handle middleware (here->multer) errors
      res.status(400).send({ error: error.message });

      next();
    }
  )
  .get("/users/profile", auth, async (req, res) => {
    res.send(req.user);
  })
  .get("/users/:id/avatar", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }

    try {
      res.set("Content-Type", "image/png");
      res.send(user.avatar);
    } catch (error) {
      res.status(404).send(error);
    }
  })
  .patch("/user/profile", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpatesKeys = ["name", "email", "password", "age"];
    const isValidCheck = updates.every((update) => allowedUpatesKeys.includes(update));

    if (!isValidCheck) {
      return res.status(400).send({ error: "Invalid update" });
    }

    try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send(req.user);
    } catch (error) {
      res.status(500).send(error);
    }
  })
  .delete("/users/profile/avatar", auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  })
  .delete("/user/profile", auth, async (req, res) => {
    try {
      await sendGoodbyeEmail(req.user.email, req.user.name);
      await req.user.remove();
      res.send({ "Deleted User": req.user });
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = userRouter;
