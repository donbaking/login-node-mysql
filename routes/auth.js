const router = require("express").Router();
//導入router功能
const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../module/cndatabase");
//導向登入介面
router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) throw err;
    return res.redirect("/");
  });
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

//本地端註冊
router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});
//接收本地端的form資料
router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;
  if (password.length < 8) {
    req.flash("error_msg", "密碼長度過短,至少需要八個字元");
    return res.redirect("/auth/signup");
  }
  //確認信箱是否被註冊
  db.query(
    "SELECT * FROM users WHERE emailaddress = ?",
    [email],
    async (e, result) => {
      // console.log(result);
      if (result.length > 0) {
        console.log("電子郵件已經被註冊過!");
        req.flash(
          "error_msg",
          "信箱已經被註冊，請使用其他信箱註冊或使用此信箱登入"
        );
        return res.redirect("/auth/signup");
      } else {
        console.log("新用戶，將資料存入資料庫中");
        try {
          //異步hash不拖慢整體反映
          let hashedpasswrod = await bcrypt.hash(password, 8); //做8次hash
          db.query(
            "INSERT INTO users SET ?",
            { name: name, emailaddress: email, userpassword: hashedpasswrod },
            (e, result) => {
              if (e) throw e;
              console.log(result);
              req.flash("success_msg", "註冊成功!可以嘗試登入系統");
              console.log("註冊成功");
              return res.redirect("/auth/login");
            }
          );
        } catch (e) {
          console.log(e);
        }
      }
    }
  );
});
//本地端登入
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login", //登入導向的網站
    failureFlash: "登入失敗帳號或密碼有誤，請重新嘗試", //此訊息會套在app.js裡的req.flash("error")裡
  }),
  (req, res) => {
    return res.redirect("/profile");
  }
);

module.exports = router;
