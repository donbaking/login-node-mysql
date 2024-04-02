const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const db = require("../module/cndatabase");
const localstrategy = require("passport-local");
const bcrypt = require("bcryptjs");

passport.serializeUser((user, done) => {
  console.log("序列化使用者");
  // console.log(user); //可以看到儲存在mysql內的使用者資料
  // console.log(user);可以看user資料
  // console.log(user);
  //這裡的user變數內容為usertable裡的userid
  done(null, user); //將mysql內的userid存在session裡
  //並且將id簽名後以cookie的形式傳給使用者
});

passport.deserializeUser((user, done) => {
  //console.log("解序列化使用者去找到資料庫內的資料");
  //console.log(user);
  db.query(
    "SELECT * FROM users WHERE userid = ?", //查詢table中的userid
    [user],
    (error, result) => {
      if (error) throw error;
      console.log(result);
      done(null, result); //將userid丟給done函數使用
    }
  );
});
//google登入
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入Google Strategy的區域");
      console.log(profile);
      // 透過電子郵件比對
      const email = profile._json.email;
      const name = profile.displayName;
      const password = profile._json.sub;
      const thumbnail = profile.photos[0].value;
      // console.log(email); //使用profile裡的json email檢查使用者是否註冊過
      // // 檢查是否有被註冊過
      try {
        db.query(
          "SELECT * FROM users WHERE emailaddress = ?",
          [email],
          (e, result) => {
            // console.log(result);
            if (result.length > 0) {
              console.log("電子郵件已經被註冊過!");
              const id = result[0].userid;
              done(null, id); //將userid丟給done函數使用
            } else {
              console.log("新用戶，將資料存入資料庫中");
              db.query(
                "INSERT INTO users SET ?",
                {
                  name: name,
                  emailaddress: email,
                  userpassword: password,
                  nail: thumbnail,
                },
                (e, result) => {
                  if (e) throw e;
                  console.log(result);
                  console.log("成功建立新用戶");
                  db.query(
                    "SELECT * FROM users WHERE userid = ?", //查詢table中的userid
                    [result.insertId],
                    (error, result) => {
                      if (error) throw error;
                      done(null, result[0].userid); //將userid丟給done函數使用
                    }
                  );
                }
              );
            }
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  )
);

//locallogin
//自動套入login.ejs內的form值要注意變數名
passport.use(
  new localstrategy(async (username, password, done) => {
    try {
      console.log(username);
      //找到sql裡對應的使用者資訊
      db.query(
        "SELECT * FROM users WHERE emailaddress = ?",
        [username],
        async (e, result) => {
          // console.log(result);
          //沒找到使用者導回註冊頁面
          if (result.length === 0) {
            done(null, false);
          } else {
            console.log("已確認使用者，比對密碼中");
            let passwordcheck = await bcrypt.compare(
              password,
              result[0].userpassword
            );
            if (passwordcheck) {
              console.log("確認成功");
              console.log(result);
              done(null, result[0].userid); //將id傳給序列化及解序列化過程
            } else {
              console.log("密碼錯誤");
              done(null, false);
            }
          }
        }
      );
    } catch (e) {
      console.log(e);
    }
  })
);
