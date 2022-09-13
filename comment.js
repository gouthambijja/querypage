const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
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
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
