const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const session = require("express-session");

const app = express();

// Suppresses deprecation warning
// Remove after upgrading to Mongoose 7
// https://github.com/Automattic/mongoose/issues/11861
mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ client: mongoose.connection.getClient() }),
  })
);
app.use(passport.session());

app.use("/", require("./routes/"));

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () =>
  console.log(`Server is listening on port ${port}`)
);
