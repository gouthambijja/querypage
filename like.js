const mongoose = require("mongoose");
const likeSchema = mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  qid: {
    type: String,
    required: true,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
});
const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
