

exports.isAuth = (req, res, next) => {
     console.log("req.user:", req.user);
  if (req.isAuthenticated()) return next();
  res.redirect("/log-in?reason=auth");
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.is_admin) return next();
  res.status(403).send("Only admins can do that.You are not an admin.");
};