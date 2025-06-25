
const optimizer = require("./optimizer");
const live_search = require("./live_search");
const product_recommendations  = require("./product_recommendations");
const shared_services = require("./shared_services");
const reporting = require("./reporting");

module.exports = [...optimizer,...live_search,...product_recommendations,...shared_services,...reporting];

