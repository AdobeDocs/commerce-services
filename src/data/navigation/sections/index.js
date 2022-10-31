const live_search = require("./live_search");
const shared_services  = require("./shared_services");
const product_recommendations  = require("./product_recommendations");


module.exports = [...live_search, ...shared_services, ...product_recommendations];
