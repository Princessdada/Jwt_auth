const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
require("dotenv").config();
// import routes
const bookApiRoute = require("./routes/book");
const authRoute = require("./routes/auth");

// connect to mongodb
const db = require("./db");
db.connectToMongodb();

// require signup and login middleware
require("./authentication/auth");

const PORT = process.env.PORT;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Mounts the authentication routes (e.g., /signup, /login) at the root path ('/')
app.use("/", authRoute);

// Mounts the bookapi routes and protects them with JWT authentication,
// ensuring only users with a valid JWT token can access these routes
app.use(
  "/bookapi",
  passport.authenticate("jwt", { session: false }),
  bookApiRoute
);

// renders the home page
app.get('/', (req, res) => {
    res.send('Welcome to the book API');
});

// Handle errors.
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.json({ error: err.message });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})