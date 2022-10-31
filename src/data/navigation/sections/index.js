const live_search = require("./live_search");
const shared_services  = require("./shared_services");
const reporting = require("./reporting");

module.exports = [...live_search, ...reporting, ...shared_services];
