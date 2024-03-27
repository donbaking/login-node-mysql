const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const db = require("../module/cndatabase");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入Google Strategy的區域");
      // 透過電子郵件比對
      const email = profile._json.email;
      const name = profile.displayName;
      const password = profile._json.sub;
      console.log(email); //使用profile裡的json email檢查使用者是否註冊過
      // 檢查是否有被註冊過
      try {
        db.query(
          "SELECT * FROM users WHERE emailaddress = ?",
          [email],
          (e, result) => {
            // console.log(result);
            if (result.length > 0) {
              console.log("電子郵件已經被註冊過!");
            } else {
              console.log("新用戶，將資料存入資料庫中");
              db.query(
                "INSERT INTO users SET ?",
                {
                  name: name,
                  emailaddress: email,
                  userpassword: password,
                },
                (e, result) => {
                  if (e) throw e;
                  console.log(result);
                  console.log("註冊成功");
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
