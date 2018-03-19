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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"user script", "user script", "order", "asc"));
var model = {

    findAllSellOrders: function (data, callback) {
        SellOrder.aggregate([{
                $group: {
                    _id: "$rate",
                    orders: {
                        $push: {
                            user: "$user",
                            quantity: "$quantity",
                            script: "$script"
                        }
                    }
                }
            }, // Stage 2
            {
                $sort: {
                    _id: 1
                }
            },
        ], function (err, found) {
            if (err || _.isEmpty(found)) {
                callback(err, null);
            } else {
                callback(null, found)
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);