const { name } = require("ejs");
const mongoose = require("mongoose");
const signupSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
});
const Userdata = mongoose.model("Userdata", signupSchema);
module.exports = Userdata;
