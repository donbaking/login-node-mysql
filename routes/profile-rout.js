const router = require("express").Router();

const authcheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

router.get("/", authcheck, (req, res) => {
  return res.render("profile", { user: req.user }); //deserializeuser()裡的user資料
});

module.exports = router;
