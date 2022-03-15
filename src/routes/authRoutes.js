require("dotenv").config();
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jsonwebtoken = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

let User = require("../models/user");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.statut(400).send("server error");
  }
});

router.post(
  "/",
  [
    check("email", "Email is required").not().isEmpty().isEmail(),
    check("password", "Password is invalid").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ errors: "invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: "invalid credentials 2" });
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };
      jsonwebtoken.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.send({ token });
        }
      );
    } catch (err) {
      return res.status(500).send(`Server error ${err}`);
    }
  }
);

module.exports = router;
