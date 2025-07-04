const User = require("../models/user.js");

//render signup form
module.exports.renderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
}

//signup route
module.exports.signup = async (req, res)=>{
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err) return next(err);
            req.flash("success", "Welcome to MyStay!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

//render login form
module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
}

//login route
module.exports.login = async (req, res)=>{

    req.flash("success", "Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout route
module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
}