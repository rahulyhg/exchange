const createBook = require('@mcb/matching-simulator').createBook;
const Side = require('@mcb/matching-simulator').Side;

var schema = new Schema({

});

schema.plugin(deepPopulate, {});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Exchange', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema));
var model = {

    exchangeBTK: function (data,callback) {
        console.log("data",data);
        // import {
        //     createBook,
        //     Side
        // } from '@mcb/matching-simulator';

        const book = createBook();
        const matchingEngine = book.createMatchingEngine();
        const pricingEngine = book.createPricingEngine();

        matchingEngine.onTrade = (trade) =>
            console.log(`${trade.user.userId} ${trade.side} ${trade.volume} ${trade.instrumentId} @ ${trade.price}`);

        // pricingEngine.onPrice = (price) =>
        //     console.log(`${price.instrumentId} ${price.price}`);

        const user = {
            userId: 'Chintan',
            firmId: 'wohlig'
        };
        const user2 = {
            userId: 'Chirag',
            firmId: 'wohlig technology'
        };
        const user3 = {
            userId: 'Sanket',
            firmId: 'Wohlig Tech'
        };

        var sideData=data.side

        book.addOrder(user, data.instrumentId, Side.sideData, data.volume, data.price);
        book.addOrder(user2, 'BTK/INR', Side.Buy, 100, 100);
        // book.addOrder(user3, 'BTK/INR', Side.Sell, 110, 300);
        // book.addOrder(user, 'BTK/INR', Side.Buy, 120, 250);

        console.log();
        console.log("Orders Remaining");
        console.log(book.orders);
        /*
         Output
         ------
         > user1 buy 5 tx1 @ 50
         > user2 sell 5 tx1 @ 50
        */
        callback(null,"yo")
    }
};
module.exports = _.assign(module.exports, exports, model);