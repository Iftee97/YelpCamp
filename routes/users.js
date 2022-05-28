const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const {
    renderRegister,
    register,
    renderLogin,
    login,
    logout,
} = require("../controllers/users");

router.route("/register").get(renderRegister).post(register);

router
    .route("/login")
    .get(renderLogin)
    .post(
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureMessage: true,
            failureFlash: true,
        }),
        login
    );

router.get("/logout", logout);

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------

// // render register form
// router.get("/register", renderRegister);

// // registering and loggin in a user
// router.post("/register", register);

// // render login form
// router.get("/login", renderLogin);

// loggin in a user
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureMessage: true,
//     failureFlash: true,
//   }),
//   login
// );

// // logout a user
// router.get("/logout", logout);

module.exports = router;
