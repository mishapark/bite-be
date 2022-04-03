require("dotenv").config();
const express = require("express");
const restaurantRoute = require("./routes/restaurantRoutes.js");
const contactRoute = require('./routes/contactRoutesDB');
const eventRoute = require('./routes/eventRoutesDB');
const featurdEventRoute = require('./routes/featuredEventRoutesDB');
const userRoute = require("./routes/userRoutes.js");
const authRoute = require("./routes/authRoutes.js");
const connectDB = require("./config/connectDB");
const cors = require('cors');


const app = express();
app.use(cors());

//connect to db
connectDB();

app.use(express.json());
app.use("/api/restaurants", restaurantRoute);
app.use('/api/contacts', contactRoute);
app.use('/api/events', eventRoute);
app.use('/api/featuredEvents', featurdEventRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT | 5000;

app.listen(PORT, () => {
  console.log("server started");
});
