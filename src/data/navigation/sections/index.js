const live_search = require("./live_search");
const product_recommendations  = require("./product_recommendations");
const reporting = require("./reporting");
const shared_services  = require("./shared_services");
const graphql = require("./graphql");
const data_ingestion = require("./data_ingestion");

module.exports = [...live_search, ...product_recommendations, ...reporting, ...shared_services, ...graphql, ...data_ingestion];
