// ----------------------------------------------------------- //
// import
// node modules
const express = require("express");
const cors = require("cors");

// ----------------------------------------------------------- //
// variables that may need in another import

// default PORT if not provided through env variable
const PORT = process.env.PORT || 3001;
// express app
const app = express();

// middlewares
const loggingService = require("./lib/middlewares/logging")(app);

// api router
const apiRouter = require("./lib/api");

// ----------------------------------------------------------- //
// middlewares

// cors
app.use(cors());
// bodyparser
app.use(express.json());
// logging
loggingService.activate();

// adding apiRouter to the express app
app.use("/api", apiRouter);

// custom 404 - Not Found page
app.use((req, res) => {
  res.status(404).send("<h2>404 - Not Found</h2>");
});

// custom 500 - Server Error page
/* eslint-disable no-unused-vars */
app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(500).send("<h2>500 - Server Error</h2>");
});
/* eslint-enable no-unused-vars */

// function to start the server
app.listen(PORT, () => {
  console.log(
    `Server started in ${app.get("env")} mode on http://localhost:${PORT};\n` +
      `press ctrt + c to terminate.`
  );
});
