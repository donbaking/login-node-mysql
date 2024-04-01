const router = require("express").Router();
//導入router功能
const passport = require("passport");

//導向登入介面
router.get("/login", (req, res) => {
  return res.render("login");
});
//google登入
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  return res.redirect("/profile"); //google登入後會去的頁面
}); //已經經過google驗證才能使用的route

module.exports = router;
