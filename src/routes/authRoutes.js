const express = require("express");

const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

require("dotenv").config();

const { check, validationResult } = require("express-validator");

const User = require("../models/User");

//@route GET api/auth

//@desc Get logged in User

//@access Publi

//auth middleware

router.get("/", auth, async (req, res) => {
  try {
    //use the user model to get user info except password

    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("server error");
  }
});

//@route POST api/auth

//@desc Authenticate user and get token

//@access Public

router.post(
  "/",

  [
    check("email", "Please include valid email").isEmail(),

    check("password", "Password is required").exists(),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //see if user exists

      let user = await User.findOne({ email });

      if (!user) {
        return res

          .status(400)

          .json({ errors: [{ msg: "invalid credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res

          .status(400)

          .json({ errors: [{ msg: "invalid credentials" }] });
      }

      //get user info for payload from mongo

      const payload = {
        user: {
          id: user.id,

          name: user.name,
          role: user.role,
        },
      };

      jwt.sign(
        payload,

        process.env.JWT_SECRET,

        { expiresIn: 36000 },

        (err, token) => {
          if (err) throw err;

          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);

      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
