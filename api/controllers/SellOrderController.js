module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    displayList: function (req, res) {
        console.log("ttttttttttt");
        if (req.body) {
            SellOrder.displayList(req.body, res.callback);
            console.log("ttttttttttt", res.body);

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