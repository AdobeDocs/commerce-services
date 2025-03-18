
const live_search = require("./live_search");
const product_recommendations  = require("./product_recommendations");
const reporting = require("./reporting");
const shared_services  = require("./shared_services");
const graphql = require("./graphql");
const cloud_service_guides = require("./cloud_service_guides");


module.exports = [...live_search, ...product_recommendations, ...reporting, ...shared_services, ...graphql, ...cloud_service_guides];
