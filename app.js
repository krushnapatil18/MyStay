if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const bookingRouter = require("./routes/booking.js");
const wishlistRoutes = require('./routes/wishlist');

// Connect to MongoDB


const dbUrl = process.env.ATLASDB_URL;

main().then(() => console.log("Connected to MongoDB")).catch(error => console.error(error));
async function main(){
    await mongoose.connect(dbUrl);
}


const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const reviewRouter = require("./routes/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET,
    },

});
store.on("error", function(e){
    console.log("Session Store Error", e);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 30,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
    }
};


// session
app.use(session(sessionOptions));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Make currentUser available in all templates (must be before routes)
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use((req, res, next) => {
    res.locals.mapToken = process.env.MAPBOX_TOKEN;
    next();
});

// Redirect root to /listings
app.get('/', (req, res) => {
    res.redirect('/listings');
});

// listing routes, review routes, user routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/reviews", reviewRouter);
app.use("/", userRouter);
app.use('/wishlist', wishlistRoutes);

app.use("/", bookingRouter);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let{statusCode = 500, message = "Something went wrong"} = err;
    res.render("error.ejs", {statusCode, message});
});

// app.get("/", (req, res)=>{
//     res.send("Welcome to MyStay");
// });


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
    