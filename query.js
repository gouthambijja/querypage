const mongoose = require("mongoose");
const querySchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  uid: { type: String, required: true },
  createAt: {
    type: Date,
    default: Date.now,
  },
  query: { type: String, required: true },
  likeCount: {
    type: Number,
    required: true,
  },
});

const query = mongoose.model("query", querySchema);
module.exports = query;
