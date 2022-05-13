const live_search = require("./live_search");
const shared_services  = require("./shared_services");


module.exports = [...live_search, ...shared_services];
