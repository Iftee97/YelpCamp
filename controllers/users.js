const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

const renderRegister = (req, res) => {
  res.render("users/register");
};

const register = catchAsync(async (req, res) => {
  try {
    // res.send(req.body);
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome to YelpCamp, ${req.user.username}!`);
      res.redirect("/campgrounds");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

const renderLogin = (req, res) => {
  res.render("users/login");
};

const login = (req, res) => {
  req.flash("success", `Welcome Back, ${req.user.username}!`);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

const logout = (req, res) => {
  req.logout();
  req.flash("success", "Logged out!");
  res.redirect("/");
};

module.exports = {
  renderRegister,
  register,
  renderLogin,
  login,
  logout,
};
