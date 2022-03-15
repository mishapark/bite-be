const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const restaurantSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
  },
  cuisine: {
    type: String,
    require: [true, "Please add cuisine"],
  },
  price: {
    type: String,
    require: [true, "Please add price"],
  },
  location: {
    type: String,
    require: [true, "Please add location"],
  },
  hours: {
    type: String,
    require: [true, "Please add hours"],
  },
  reviews: {
    type: Array,
  },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
