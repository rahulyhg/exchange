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
module.exports = mongoose.model('BuyOrder', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "user script", "user script"));
var model = {
    displayList: function (data, callback) {

        BuyOrder.find({

            }).sort({
                createdAt: -1
            })

            .limit(20).exec(function (err, found) {
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
    displayList1:function (data,callback){
        console.log('erere',data._id);
            BuyOrder.find({user:data._id}).exec(function (err, found) {
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
};
module.exports = _.assign(module.exports, exports, model);