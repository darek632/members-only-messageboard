const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

// here will be a list of all of my controller functions. 

// exports.itemsGet = async (req,res) => { 

//     const allItems = await db.getAllItems();

    
//     res.render("index", {title: "{title of your main page}", allItems})
// };

// exports.itemsCreatePost = async (req,res) => { 
//     const {partName,brand } = req.body;
//     await db.insertItem(partName,brand);

//     res.redirect("/");

// }


//validator array


const validateSignUp = [
  body("first_name")
    .trim()
    .notEmpty().withMessage("First name is required.")
    .matches(/^[\p{L}\s'-]+$/u).withMessage("Names can only contain letters, spaces, hyphens and apostrophes.")
    .isLength({ max: 50 }).withMessage("First name must be under 50 characters."),

  body("last_name")
    .trim()
    .notEmpty().withMessage("Last name is required.")
    .matches(/^[\p{L}\s'-]+$/u).withMessage("Names can only contain letters, spaces, hyphens and apostrophes.")
    .isLength({ max: 50 }).withMessage("Last name must be under 50 characters."),

  body("username")
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage("Username must be 3–30 characters.")
    .custom(async (value) => {
      const existingUser = await db.getUserByUsername(value);
      if (existingUser) {
        throw new Error("That username is already taken.");
      }
    }),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),

  body("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match."),
];

const validateMessage = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required.")
    .isLength({ max: 100 }).withMessage("Title must be under 100 characters."),
  body("text")
    .trim()
    .notEmpty().withMessage("Message can't be empty.")
    .isLength({ max: 1000 }).withMessage("Message must be under 1000 characters."),
];

const validateMembershipPasscode = [
  body("passcode")
    .trim()
    .custom((value) => value === process.env.CLUB_PASSCODE)
    .withMessage("Incorrect passcode."),
];

const validateAdminPasscode = [
  body("passcode")
    .trim()
    .custom((value) => value === process.env.ADMIN_PASSCODE)
    .withMessage("Incorrect admin passcode."),
];




exports.messagesGet = async (req,res) => { 
    
    const messages = await db.getAllMessagesWithAuthors();

    res.render("index", {title: "Welcome to members house", messages })
}

exports.signUpGet = (req,res) => {

    res.render("sign-up-form");
}

exports.signUpPost =[
    validateSignUp,
 async (req,res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) { 
            return res.status(400).render("sign-up-form", {
            errors: errors.array(),
            user: req.body,
            });
        }

        const { first_name, last_name, username, password } = req.body; 
        //get form inputs from the request.
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.createUser(first_name,last_name,username,hashedPassword);
        res.redirect("/log-in");
        
    } 
]
    


exports.logOutPost = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
};

exports.logInGet = async (req,res,) => { 
    const messages = req.session.messages || [];
  req.session.messages = [];
  //grab the error messages from the session for login issues

  //from auth when an unlogged client tries to do something. query is anything after ? in url
let notice = null;
  if (req.query.reason === "auth") {
    notice = "Please log in to post a message.";
  }

res.render("log-in", {messages,notice});
};

exports.newMessageGet =  (req,res) => {
    res.render("new-message");

};

exports.newMessagePost = [
    validateMessage, 
    async (req,res) => { 
        const errors = validationResult(req);
        if(!errors.isEmpty()) { 

            return res.status(400).render("new-message",{
                errors:errors.array(),
                message: req.body,
            })
        }
        const {title, text} = req.body;
        await db.createMessage(title,text,req.user.id);
        res.redirect("/");

}
];

exports.joinClubGet = (req, res) => {
  if (req.user.membership_status) {
    return res.redirect("/");
  }
  res.render("join-club");
};

exports.joinClubPost = [
  validateMembershipPasscode,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("join-club", { errors: errors.array() });
    }

    await db.makeMember(req.user.id);
    res.redirect("/");
  },
];

exports.deleteMessagePost = async (req, res) => {
  await db.deleteMessage(req.params.id);
  res.redirect("/");
};

exports.setAdminGet = (req, res) => {
  if (req.user.is_admin) {
    return res.redirect("/");
  }
  res.render("set-admin");
};

exports.setAdminPost = [
  validateAdminPasscode,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("set-admin", { errors: errors.array() });
    }

    await db.makeAdmin(req.user.id);
    res.redirect("/");
  },
];







