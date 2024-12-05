
const live_search = require("./live_search");
const product_recommendations  = require("./product_recommendations");
const reporting = require("./reporting");
const shared_services  = require("./shared_services");
const graphql = require("./graphql");
const composable_catalog = require("./composable-catalog");

module.exports = [...composable_catalog, ...graphql,...product_recommendations, ...shared_services, ...reporting];
