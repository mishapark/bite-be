const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config();

let User = require("../models/user");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty().isEmail(),
    check("password", "Password is invalid").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const salt = await bcryptjs.genSalt();
      const password = await bcryptjs.hash(req.body.password, salt);

      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: password,
      });

      const payload = {
        user: {
          id: newUser.id,
          name: newUser.name,
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
