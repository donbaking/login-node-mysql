const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const exp = require("constants");
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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//使用router
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

app.listen(3000, (req, res) => {
  console.log("listening3000");
});
