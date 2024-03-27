const express = require("express");
//導入router功能
const router = express.Router();

//導向登入介面
router.get("/", (req, res) => {
  res.render("index");
});
//註冊
router.get("/register", (req, res) => {
  res.render("register");
});
//登入
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
