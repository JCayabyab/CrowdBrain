const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");

// models go here
require("./models/User");
require("./models/Project");
require("./models/Feature");
require("./models/Subtask");
require("./models/Comment");

// services go here
require("./services/passport");

mongoose.connect(keys.mongoURI);

const app = express();

// middlewares go here
app.use(bodyParser.json());
app.use(cookieSession({
  maxAge: 60*60*24*30 * 1000,
  keys: [keys.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

// routes go here
require("./routes/authRoutes")(app);
require("./routes/ownerRoutes")(app);
require("./routes/projectRoutes")(app);
require("./routes/featureRoutes")(app);
require("./routes/subtaskRoutes")(app);
require("./routes/commentRoutes")(app);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
