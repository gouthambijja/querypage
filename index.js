const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const port = process.env.PORT;
const Userdata = require("./signup");
const { ok } = require("assert");
const { v4: uuidv4 } = require("uuid");
const Query = require("./query");
const Like = require("./like");
const Comment = require("./comment");
require("dotenv").config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//mongo connection
mongoose
  .connect(process.env.dbURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("mongo connected");
  })
  .catch((err) => {
    console.log("oops error!");
    console.log(err);
  });
//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "sharingan key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.get("/", (req, res) => {
  if (req.session.uid) {
    res.render("student", { data: req.session.uid });
  } else {
    res.render("home");
  }
});
app.post("/studentpage", async (req, res) => {
  const data = req.body;
  const isAvailable = await Userdata.find({ userId: data.user });
  if (isAvailable.length) {
    const isCorrectPassword = await bcrypt.compare(
      data.password,
      isAvailable[0].password
    );
    if (isCorrectPassword) {
      req.session.uid = isAvailable[0].id;
      res.redirect(`/studentpage`);
    } else {
      res.send("incorrect password!");
    }
  } else {
    res.send("invalid User Name!");
  }
});
app.get("/studentpage", async (req, res) => {
  if (!req.session.uid) res.redirect("/");
  else res.render("student", { data: req.session.uid });
});
app.get("/studentpage/signup", (req, res) => {
  res.render("signup");
});
app.post("/studentpage/signin", async (req, res) => {
  const data = req.body;
  const salt = await bcrypt.genSalt();
  const idSalt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const newUser = new Userdata({
    id: uuidv4(),
    name: data.name,
    dob: data.dob,
    gender: data.gender,
    userId: data.user,
    password: hashedPassword,
  });
  await newUser.save();
  res.redirect("/");
});
//to check whether the username is available or not
app.get("/studentpage/signin/", async (req, res) => {
  const username = req.query.username;
  const isAvailable = await Userdata.find({ userId: username });
  if (isAvailable.length) {
    res.send("0");
  } else res.send("1");
});
app.get("/studentpage/query/insert", async (req, res) => {
  const uname = await Userdata.find({ id: req.session.uid });
  const newQuery = new Query({
    id: uuidv4(),
    query: req.query.query,
    uid: uname[0].userId,
    likeCount: 0,
  });
  console.log(newQuery);
  await newQuery.save();
  res.sendStatus(200);
});
app.get("/studentpage/querydata", async (req, res) => {
  const querydata = await Query.find({});
  res.send(querydata);
});
app.get("/studentpage/profilequerydata", async (req, res) => {
  const querydata = await Query.find({ uid: req.query.uid });
  res.send(querydata);
});
app.get("/studentpage/userinfo", async (req, res) => {
  const userinfo = await Userdata.find({ id: req.query.id });
  res.send(userinfo);
});
app.get("/studentpage/like/add", async (req, res) => {
  const newLike = new Like({
    uid: req.query.uid,
    qid: req.query.qid,
  });
  const likeCountOfPresentQuery = await Query.find({ id: req.query.qid });
  await Query.updateOne(
    { id: req.query.qid },
    { $set: { likeCount: likeCountOfPresentQuery[0].likeCount + 1 } }
  );
  await newLike.save();
  res.send("200");
});
app.get("/studentpage/like/remove", async (req, res) => {
  const likeCountOfPresentQuery = await Query.find({ id: req.query.qid });
  await Query.updateOne(
    { id: req.query.qid },
    { $set: { likeCount: likeCountOfPresentQuery[0].likeCount - 1 } }
  );
  await Like.deleteOne({ qid: req.query.qid, uid: req.query.uid });
  res.send("200");
});
app.get("/studentpage/likecount", async (req, res) => {
  const cnt = await Like.find({ qid: req.query.qid });
  res.send(`${cnt.length}`);
});
app.get("/studentpage/checklike", async (req, res) => {
  const check = await Like.find({ uid: req.session.uid });
  res.send(check);
});
app.get("/studentpage/add/comment", async (req, res) => {
  const uname = await Userdata.find({ id: req.session.uid });
  const newComment = new Comment({
    uid: uname[0].userId,
    qid: req.query.qid,
    comment: req.query.comment,
  });
  await newComment.save();
  res.sendStatus(200);
});
app.get("/studentpage/getallcomments", async (req, res) => {
  const allCommentsData = await Comment.find({ qid: req.query.qid });
  res.send(allCommentsData);
});
app.post("/studentpage/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
app.listen(port || 3000, () => {
  console.log("server listening at 3000");
});
