const live_search = require("./live_search");
const product_recommendations  = require("./product_recommendations");
const reporting = require("./reporting");
const shared_services  = require("./shared_services");
const graphql = require("./graphql");
const commerce_data_export = require("./commerce-data-export");

module.exports = [...live_search, ...product_recommendations, ...commerce_data_export, ...reporting, ...shared_services, ...graphql];
