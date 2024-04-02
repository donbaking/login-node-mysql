const router = require("express").Router();
const db = require("../module/cndatabase");

const authcheck = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};
function getPosts(userid) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM posts WHERE userid = ?",
      [userid],
      (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      }
    );
  });
}

router.get("/", authcheck, async (req, res) => {
  //尋找用戶貼文
  console.log("開始尋找");
  const posts = await getPosts(req.user[0].userid);
  //console.log(posts);
  res.render("profile", {
    user: req.user,
    posts: posts,
    //deserializeuser()裡的user資料
  });
});
//post的router
router.get("/post", authcheck, (req, res) => {
  return res.render("post", { user: req.user });
});
//post功能
router.post("/post", authcheck, async (req, res) => {
  console.log("使用者開始新增貼文");
  let { title, content } = req.body;
  let postid = req.user[0].userid;
  try {
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO posts SET ?",
        {
          userid: postid,
          post_content: content,
          post_title: title,
        },
        (e, result) => {
          console.log("新增成功");
          if (e) {
            console.log("貼文失敗");
            reject(e);
          } else {
            console.log("貼文成功");
            resolve(result);
          }
        }
      );
    });
    return res.redirect("/profile");
  } catch (e) {
    console.log(e);
    console.log("貼文失敗");
    req.flash("error_msg", "標題或內容沒有填寫");
    return res.redirect("/profile/post");
  }
});

module.exports = router;
