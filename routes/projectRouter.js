//1. import router from express
//2. call router on our router variable
// 3.require controller functions to direct the server to execute 
// these during a routed request
const { Router } = require("express");
const membersController = require("../controllers/membersController");
const passport = require("passport");
const indexRouter = Router();
const { isAuth,isAdmin } = require("../middleware/auth"); 


indexRouter.get("/", membersController.messagesGet);
indexRouter.get("/sign-up",membersController.signUpGet);
indexRouter.get("/log-in",membersController.logInGet);
// add a simple you've been logged out get route w msg with nav
indexRouter.get("/new-message", isAuth,membersController.newMessageGet);
indexRouter.get("/join-club", isAuth, membersController.joinClubGet);
indexRouter.get("/set-admin", isAuth, membersController.setAdminGet);



indexRouter.post("/sign-up", membersController.signUpPost);
indexRouter.post("/log-in", passport.authenticate("local", { 
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
}));

indexRouter.post("/log-out", membersController.logOutPost);
indexRouter.post("/new-message",isAuth,membersController.newMessagePost);
indexRouter.post("/join-club", isAuth, membersController.joinClubPost);

indexRouter.post("/messages/:id/delete", isAdmin, membersController.deleteMessagePost);
indexRouter.post("/set-admin", isAuth, membersController.setAdminPost);



// projectRouter.post("/new", projectController.itemsCreatePost)

module.exports = indexRouter;