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
        required: true

    },
    quantity: {
        type: Number,
        required: true

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
module.exports = mongoose.model('BuyOrder', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user script", "user script", "order", "asc"));
var model = {
    findAllBuyOrders: function (data, callback) {
        BuyOrder.aggregate([{
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
                // MatchingEngine.matchingBuyingOrderWithSellingOrder();
                callback(null, found);
            }
        });
    },

    // findAllBuyOrders: function (data, callback) {
    //     BuyOrder.find({}).exec(function (err, found) {
    //         if (err || _.isEmpty(found)) {
    //             callback(err, null);
    //         } else {
    //             MatchingEngine.createByingOrderArry(found);
    //             callback(null, found)
    //         }
    //     });
    // },

    getCompleteBuyList: function (data, callback) {
        console.log('#######');
        BuyOrder.find({}).sort({
                createdAt: -1
            })
            .limit(20).exec(function (err, found) {
                if (err) {
                    callback(err, null);
                } else if (_.isEmpty(found)) {
                    callback("noDataound", null);
                } else {
                    var list = _.orderBy(found, ['rate'], ['desc']);
                    console.log('4444444444');
                    callback(null, list);
                }
            });

    },

    getUserBuyList: function (data, callback) {
        console.log('@@@@@@', data);
        console.log('erere', data._id);
        console.log('rtrtr', data.data._id);
        BuyOrder.find({
            user: data.data._id
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                var list = _.orderBy(found, ['rate'], ['desc']);
                console.log('&&&&&', found)
                callback(null, list);

            }

        });
    },
    // xyz:function(data,callback){
    //     var x="Hello";
    //     sails.socket.blast(x);
    //     callback(null,x);
    // },
};
module.exports = _.assign(module.exports, exports, model);