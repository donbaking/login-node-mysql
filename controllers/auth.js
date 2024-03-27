const db = require("../module/cndatabase");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

db.connect((e) => {
  if (e) throw e;
  console.log("MYSql connected");
});
exports.register = (req, res) => {
  console.log(req.body);
  //從表單提取資料
  const { name, email, password, passwordconfirm } = req.body;
  //Query進database
  db.query(
    "SELECT emailaddress FROM users WHERE emailaddress = ?",
    [email],
    async (e, result) => {
      if (e) throw e;
      if (result.length > 0) {
        return res.render("register", {
          message: "電子郵件已經被使用",
        });
      } else if (password !== passwordconfirm) {
        return res.render("register", {
          message: "密碼不符",
        });
      }
      //異步hash密碼不拖慢網頁反應
      try {
        let hashedpasswrod = await bcrypt.hash(password, 8); //做8次hash
        console.log(hashedpasswrod);
        db.query(
          "INSERT INTO users SET ?",
          { name: name, emailaddress: email, userpassword: hashedpasswrod },
          (e, result) => {
            if (e) throw e;
            console.log(result);
            return res.render("register", {
              message: "註冊成功",
            });
          }
        );
      } catch (e) {
        console.log(e);
      }
      //將註冊資料新增至mysql
    }
  );
  //hash密碼 使用bcryptjs套件
};
