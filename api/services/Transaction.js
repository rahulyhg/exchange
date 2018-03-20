var schema = new Schema({
    user: {
        
        type: Schema.Types.ObjectId,
        ref:'User',
     
        index: true
        
    },
    script: {
        
        type: Schema.Types.ObjectId,
        ref:'Script',
       
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

var exports = _.cloneDeep(require("sails-wohlig-service")(schema,"user script", "user script"));
var model = {
    displayList: function(data,callback){
        Transaction.find({
        }).sort({rate: 'descending'}).sort({createdAt:-1}).limit(20).exec(function (err, found) {
            if (err) {
                callback(err, null);
            } else if (_.isEmpty(found)) {
                callback("noDataound", null);
            } else {
                var list2 = _.orderBy(found, ['rate'], ['desc']);
                callback(null, list2);
                console.log("Services backend",list2);
            }
        });
    }
};
module.exports = _.assign(module.exports, exports, model);