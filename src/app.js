require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const connectDB = require("./server/config/db");
const path = require("path");
const session = require("express-session");
const { isActiveRoute } = require("./server/helpers/routeHelpers");
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUnitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.locals.isActiveRoute = isActiveRoute;
app.use(express.static(path.join("./src", "public")));

// Templating Engine
app.use(expressLayouts);
app.set("layout", "layouts/main.ejs"); // Assuming you have a layout file in the 'views/layouts' directory
app.set("view engine", "ejs"); // Replace 'your-view-engine' with the actual view engine you are using (e.g., 'ejs')
app.set("views", path.join(__dirname, "views"));

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
