const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ Path: "./.env" });
//設定mysql連接之資料庫
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});
const publicDirectory = path.join(__dirname, "./public");

//middleware
app.use(express.static(publicDirectory));
app.use(express.json());
app.set("view engine", "hbs");

//mysql連線
db.connect((e) => {
  if (e) {
    console.log(e);
  } else {
    console.log("MySQL connected");
  }
});

//rout
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, (req, res) => {
  console.log("listening3000");
});
