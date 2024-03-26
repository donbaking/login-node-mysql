const express = require("express");
const authController = require("../controllers/auth");
//導入router功能
const router = express.Router();

//導向登入介面
router.post("/register", authController.register);

module.exports = router;
