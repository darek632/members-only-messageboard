const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/projectRouter");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");
const pool = require("./db/pool");




console.log("DATABASE_URL:", process.env.DATABASE_URL);

pool.query("SELECT current_database()").then((r) => console.log("App DB:", r.rows));
pool.query("SELECT id, username FROM users").then((r) => console.log("App users:", r.rows));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(session({ 
  secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false }));
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});
app.use("/", indexRouter);


// app.post("/sign-up", (req, res) => res.send("POST route reached"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Express app listening on port ${PORT}!`);
});
