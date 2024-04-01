const express = require("express");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ Path: "./.env" });
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const profileroute = require("./routes/profile-rout");
//設定mysql連接之資料庫
//middleware
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize()); //passport運行認證功能
app.use(passport.session()); //讓passport使用sessione功能

//使用router
app.get("/", (req, res) => {
  return res.render("index");
});

app.use("/auth", require("./routes/auth"));
app.use("/profile", profileroute);
app.listen(8080, (req, res) => {
  console.log("listening8080");
});
