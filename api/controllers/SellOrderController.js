module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getCompleteSellList: function (req, res) {
        if (req.body) {
            SellOrder.getCompleteSellList(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },
    getUserSellList: function (req, res) {
        if (req.body) {
            SellOrder.getUserSellList(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    save: function (req, res) {
        req.model.saveData(req.body, function (err, data) {
            if (err) {
                res.callback(err);
            } else {
                SellOrder.getCompleteSellList({}, function (err, data) {
                    if (data) {
                        sails.sockets.blast("BuyOrderAdded", data);
                    }
                });
                res.callback(err, data);
            }
        });
    },

    findAllSellOrders: function (req, res) {
        if (req.body) {
            SellOrder.findAllSellOrders(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    }
};
module.exports = _.assign(module.exports, controller);