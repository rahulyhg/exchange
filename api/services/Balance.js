var schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    balance: {
        type: Number,
        required: true,

    },
    currency: {
        type: String,
        enum: ['BTC', 'USDT']
    }

});

schema.plugin(deepPopulate, {
    'user': {
        select: ''
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Balance', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user", "user"));
var model = {
    getBalance: function (data, callback) {

        Balance.find({
            user: data.user

        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                callback(null, found);
            }
        });
    },
    updateBalance: function (data, callback) {

        Balance.findOneAndUpdate({
            user: data.user,
            currency: data.currency

        }, {
            $set: {
                balance: data.balance
            }
        }, {
            new: true
        }).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                sails.sockets.blast("UpdatedBalance", found);

                callback(null, found);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);