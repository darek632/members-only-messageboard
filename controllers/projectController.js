const { body, validationResult, matchedData } = require("express-validator");
const db = require("../db/queries");

// here will be a list of all of my controller functions. 

exports.itemsGet = async (req,res) => { 

    const allItems = await db.getAllItems();

    
    res.render("index", {title: "{title of your main page}", allItems})
};

exports.itemsCreatePost = async (req,res) => { 
    const {partName,brand } = req.body;
    await db.insertItem(partName,brand);

    res.redirect("/");

}

