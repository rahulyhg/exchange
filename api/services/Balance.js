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
var model = {};
module.exports = _.assign(module.exports, exports, model);