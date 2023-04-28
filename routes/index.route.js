const express = require("express");
const router = express.Router();
const usersRouter = require("./users.route.js");
const postsRouter = require("./posts.route.js");
const commentsRouter = require("./comments.route.js");
const likesRouter = require("./likes.route.js");
router.use("/", [likesRouter, usersRouter, postsRouter, commentsRouter]);


module.exports = router;
