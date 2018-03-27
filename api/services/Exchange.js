const createBook = require('@mcb/matching-simulator').createBook;
const Side = require('@mcb/matching-simulator').Side;

var schema = new Schema({

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Exchange', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    saveOrdersData: function (data, callback) {
        if (data.type == "Buy") {
            BuyOrder.saveData(data, function (err, data2) {
                if (err || _.isEmpty(data2)) {
                    callback(err, [])
                } else {
                    MatchingEngine.addToBuyingOrder(data2, callback);
                }
            })
        } else {
            SellOrder.saveData(data, function (err, data2) {
                if (err || _.isEmpty(data2)) {
                    callback(err, [])
                } else {
                    MatchingEngine.addToSellingOrder(data2, callback);
                }
            });
        }
    },

    getArrData: function (data, callback) {
        MatchingEngine.getBuyersSellers(function (err, data) {
            if (data) {
                sails.sockets.blast("SellOrderAdded", data.sellers);
                sails.sockets.blast("BuyOrderAdded", data.buyers);
                callback(null, data);
            } else {
                callback(null, "noData");
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);