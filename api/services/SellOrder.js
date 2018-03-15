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
var model = {};
module.exports = _.assign(module.exports, exports, model);