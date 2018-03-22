module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    findAllBuyOrders: function (req, res) {
        if (req.body) {
            BuyOrder.findAllBuyOrders(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
    getCompleteBuyList: function (req, res) {
        if (req.body) {
            BuyOrder.getCompleteBuyList(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },

    getUserBuyList: function (req, res) {
        if (req.body) {
            BuyOrder.getUserBuyList(req.body, res.callback);
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
                BuyOrder.getCompleteBuyList({}, function (err, data) {
                    if (data) {
                        sails.sockets.blast("BuyOrderAdded", data);
                    }
                });
                res.callback(err, data);
            }
        });
    },
};
module.exports = _.assign(module.exports, controller);