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

    },
    buyOrderId: {
        type: Schema.Types.ObjectId,
        ref: 'SellOrder',
        index: true
    },
    sellOrderId: {
        type: Schema.Types.ObjectId,
        ref: 'BuyOrder',
        index: true
    },
    orderType: {
        type: String,
        enum: ['Buy', 'Sell']
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
module.exports = mongoose.model('Transaction', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user script", "user script"));
var model = {
    displayList: function (data, callback) {
        Transaction.find({}).sort({
            createdAt: -1
        }).limit(20).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                //var list2 = _.orderBy(found, ['rate'], ['desc']);
                callback(null, found);
            }
        });
    },
    displayList1: function (data, callback) {
        console.log('erere', data._id);
        Transaction.find({
            user: data._id
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                //var list = _.orderBy(found, ['rate'], ['desc']);
                callback(null, found);

            }

        });
    },

    addTransaction: function (data, transactionType, callback) {
        var orderType, OrderTable;
        if (transactionType == "Buy") {
            orderType = "Buy";
            OrderTable = BuyOrder;
        } else {
            orderType = "Sell";
            OrderTable = SellOrder;
        }
        var dataToSave = Transaction();
        dataToSave.user = data.user;
        dataToSave.script = data.script;
        dataToSave.rate = data.rate;
        dataToSave.quantity = data.quantity;
        dataToSave.buyOrderId = data.id;
        dataToSave.orderType = orderType;
        var transactionDetail;
        var orderDetail;
        async.waterfall([function (callback) {
            dataToSave.save(function (err, data) {
                callback(err, data);
            });
        }, function (transaction, callback) {
            transactionDetail = transaction;
            OrderTable.findOne({
                _id: data.id
            }).exec(callback);
        }, function (order, callback) {
            orderDetail = order;
            order.trades.push(transactionDetail._id);
            order.filled += data.quantity;
            if (order.filled == order.quantity) {
                order.status = "Complete";
            } else {
                order.status = "Partial";
            }
            order.save(callback);
        }], callback);

    },
};
module.exports = _.assign(module.exports, exports, model);