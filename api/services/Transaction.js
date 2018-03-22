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
    orderType: {
        type: String,
        default: "Buy",
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
    getCompleteTransactionList: function (data, callback) {
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
    getUserTransactionList: function (data, callback) {
        console.log('erere', data.data._id);
        Transaction.find({
            user: data.data._id
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
};
module.exports = _.assign(module.exports, exports, model);