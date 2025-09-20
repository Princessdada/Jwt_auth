const mongoose = require("mongoose");
// require library for the hashing of password
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Add a pre-hook, before the user information is saved in the database, the prehook is called.
// the password is hashed in this pre-hook function

UserSchema.pre("save", async function (next) {
  const user = this;
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

// confirm that the user's credatials are accurate with the ones stored in database
// The function compares a plain password (e.g., what a user types during login) with the hashed password saved in the database.
// this refers to the user object (like { username: "john", password: "<hashed_password>" })
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
