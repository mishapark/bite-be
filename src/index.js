require("dotenv").config();
const express = require("express");
const restaurantRoute = require("./routes/restaurantRoutes.js");
const userRoute = require("./routes/userRoutes.js");
const authRoute = require("./routes/authRoutes.js");
const connectDB = require("./config/connectDB");
const app = express();

//connect to db
connectDB();

app.use(express.json());
app.use("/api/restaurants", restaurantRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT | 5000;

app.listen(PORT, () => {
  console.log("server started");
});
