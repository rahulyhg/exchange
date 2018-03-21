var schema = new Schema({
    user: {

        type: Schema.Types.ObjectId,
        ref: 'User',

        index: true

    },
    script: {

        type: Schema.Types.ObjectId,
        ref: 'Script',

        index: true

    },
    rate: {
        type: Number,
        required: true,

    },
    quantity: {
        type: Number,
        required: true,

    }
});

schema.plugin(deepPopulate, {
    'user': {
        select: ''
    },
    'script': {
        select: ''
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('SellOrder', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user script", "user script"));
var model = {

    displayList: function (data, callback) {
        SellOrder.find({}).sort({
            createdAt: -1
        }).limit(20).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                var list1 = _.orderBy(found, ['rate'], ['asc']);
                callback(null, list1);
            }
        });
    },
    displayList1: function (data, callback) {
        console.log('erere', data._id);
        SellOrder.find({
            user: data._id
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                var list = _.orderBy(found, ['rate'], ['desc']);
                callback(null, list);

            }

        });
    },
    findAllSellOrders: function (data, callback) {
        SellOrder.aggregate([{
                $group: {
                    _id: "$rate",
                    orders: {
                        $push: {
                            user: "$user",
                            quantity: "$quantity",
                            script: "$script",
                            id: "$_id"
                        }
                    }
                }
            }, // Stage 2
            {
                $sort: {
                    _id: -1
                }
            },
        ], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                // MatchingEngine.createByingOrderArry(found);
                callback(null, found)
            }
        });
    },

    // findAllSellOrders: function (data, callback) {
    //     SellOrder.find({}).exec(function (err, found) {
    //         if (err || _.isEmpty(found)) {
    //             callback(err, null);
    //         } else {
    //             MatchingEngine.createByingOrderArry(found);
    //             callback(null, found)
    //         }
    //     });
    // },
};
module.exports = _.assign(module.exports, exports, model);