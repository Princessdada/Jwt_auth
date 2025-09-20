const moogoose = require("mongoose");

//Define a schema
const Schema = moogoose.Schema;

//Define book schema
const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: true,
    max: [2022, "Year must be less than or equal to 2020"],
  },
  isbn: {
    type: String,
    required: true,
    unique: [true, "ISBN must be unique"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be greater than or equal to 0"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdateAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the model
module.exports = moogoose.model("Books", BookSchema);
