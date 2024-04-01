const router = require("express").Router();

router.get("/", (req, res) => {
  return res.render("profile", { user: req.user }); //deserializeuser()裡的user資料
});

module.exports = router;
