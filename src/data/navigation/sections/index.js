
const composable_catalog = require("./composable-catalog");
const live_search = require("./live_search");
const product_recommendations  = require("./product_recommendations");
const shared_services = require("./shared_services");
const reference = require("./reference");
const reporting = require("./reporting");

module.exports = [...composable_catalog,...live_search,...product_recommendations,...shared_services,...reference,...reporting];

