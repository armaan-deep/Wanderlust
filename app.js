if (process.env.NDE_EVE != "production") {
  require("dotenv").config();
}
const mongo_url = process.env.ALTAS_DB;
const Listing = require("./models/listing.js");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOveride = require("method-override");
const ejsMate = require("ejs-mate");
const listingRouter = require("./route/listing.js");
const reviewsRouter = require("./route/review.js");
const userRouter = require("./route/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const localStat = require("passport-local");
const user = require("./models/user.js");

const store = MongoStore.create({
  mongoUrl: mongo_url,
  crypto: {
    secret: process.env.SECERT_KEY,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in MongoStore Session ", err);
});

let sessionOptions = {
  store,
  secret: process.env.SECERT_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOveride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStat(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.sucMsg = req.flash("sucess");
  res.locals.errMsg = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Listening
const port = "8080";
app.listen(port, () => {
  console.log(`Server is Listening at port : ${port}`);
});

async function main() {
  await mongoose.connect(mongo_url);
}

main()
  .then(console.log("Sucessfully connected with Database wanderlust"))
  .catch((er) => console.log(er));

app.use("/", userRouter);

app.use("/listings/search", listingRouter);
app.use("/listings", listingRouter);

app.use("/listings/:id/review", reviewsRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get("/search", async (req, res) => {
  let query = req.query.query.toUpperCase();
  const filteredLists = await Listing.find({ title: new RegExp(query, "i") });
  res.render("./listings/filter.ejs", { lists: filteredLists, filter: query });
});

app.get("/terms", (req, res) => {
  res.render("./nav/term.ejs");
});

app.get("/privacy", (req, res) => {
  res.render("./nav/privacy.ejs");
});

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.render("./listings/error.ejs", { statusCode, message });
});
