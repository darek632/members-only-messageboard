
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db/queries");


passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
        console.log("Login attempt:", username);
      const user = await db.getUserByUsername(username);
      

      if (!user) {
        console.log("No user found");
        return done(null, false, { message: "Incorrect username" });
      }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("Password did not match");
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      console.log("Login successful:", user.username);
      return done(null, user);
    } catch(err) {
         console.error("Login error:", err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});