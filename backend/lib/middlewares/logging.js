// ----------------------------------------------------------- //
// importing
// npm-modules
const morgan = require("morgan");
const fs = require("fs");

module.exports = (app) => {
  return {
    activate: () => {
      switch (app.get("env")) {
        case "development":
          app.use(morgan("dev"));
          break;
        case "production":
          const stream = fs.createWriteStream(process.cwd() + "/access.log", {
            flags: "a",
          });
          app.use(morgan("combined", { stream }));
      }
    },
  };
};
