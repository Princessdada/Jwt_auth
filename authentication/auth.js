const { request } = require("express");
const passport = require("passport");
const UserModel = require("../models/users");
require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const localStrategy = require("passport-local").Strategy;
// middleware to authenticate and validate secret token
passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter("secret_token"),
    },

    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (err) {
        done(err);
      }
    }
  )
);
// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY4Y2FhNTlhYjE4YjdjYWIzMjViYzUxNyIsImVtYWlsIjoicHJpbmNlc3NkYWRhMzIxQGdtYWlsLmNvbSJ9LCJpYXQiOjE3NTgxMTExNDR9.5a_fyI1E1MCOFtLr3dLNWmgHi2VPUJUQOcrZMWVbToY"
// }
// middleware to save user details to the database during sign in process, sends user details to the next middleware if sucessful, sends error if any

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.create({ email, password });
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// middleware that confirms that the user details exist in the database, if it exists, it sends details to the next middleware
// Otherwise, it reports an error.
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // find if there is a matching email in the database
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        // validate password
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }
        // if validated, login user
        return done(null, user, { message: "Logged in Successfully" });
      } catch (err) {}
    }
  )
);
