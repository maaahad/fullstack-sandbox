const credentials = require(`./.credentials.${process.env.NODE_ENV}`);
module.exports = { credentials };
