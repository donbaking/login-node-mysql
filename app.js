const express = require("express");
const app = express();
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ Path: "./.env" });
require("./config/passport");
//設定mysql連接之資料庫
//middleware
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.render("index");
});
//使用router
app.use("/auth", require("./routes/auth"));

app.listen(8080, (req, res) => {
  console.log("listening8080");
});
