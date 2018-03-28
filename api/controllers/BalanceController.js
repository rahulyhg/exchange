module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getBalance: function (req, res) {
        if (req.body) {
            Balance.getBalance(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },
    updateBalance: function (req, res) {
        if (req.body) {
            Balance.updateBalance(req.body, res.callback);

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