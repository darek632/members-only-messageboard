//1. import router from express
//2. call router on our router variable
// 3.require controller functions to direct the server to execute 
// these during a routed request
const { Router } = require("express");
const projectController = require("../controllers/projectController");
const projectRouter = Router();


projectRouter.get("/", projectController.itemsGet);

projectRouter.post("/new", projectController.itemsCreatePost)

module.exports = projectRouter;