const Userdata = require("./signup");
const mongoose = require("mongoose");
const query = require("./query.js");
const { v4: uuidv4 } = require("uuid");
const Like = require("./like");
const Comment = require("./comment");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/StudentPage");
}
main().catch((err) => console.log(err));
// const newUser = new Userdata({
//   email: "goutham",
//   name: "goutham",
//   password: "lasdjflsk",
//   dob: "12-12-12",
//   gender: "male",
// });
// newUser.save();
// const newquery = new query({
//   id: uuidv4(),
//   query: "every dog has a day",
//   uid: "hola",
// });
// newquery.save();
// console.log(newquery);
// async function y() {
//   const x = await query.find({});
//   console.log(x);
// }
// y();

// const newLike = new Like({
//   uid: "lsajflj",
//   qid: "alkfjsf",
// });
// console.log("hsaf");
// newLike.save();
// console.log(newLike);
