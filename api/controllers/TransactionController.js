module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    displayList: function (req, res) {
        if (req.body) {
            Transaction.displayList(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid request"
                }
            });
        }
    },
    displayList1: function (req, res) {

        if (req.body) {
            Transaction.displayList1(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: {
                    message: "Invalid Request"
                }
            });
        }
    },
};
module.exports = _.assign(module.exports, controller);
