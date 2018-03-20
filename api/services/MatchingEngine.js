// import { INSPECT_MAX_BYTES } from "buffer";

module.exports = {
    minimumArrayLength: 100,
    buyingOrder: [], // will be descending
    /**
     * obj = {
            rate:100.20,
            orders: [
                {
                    _id:12345,
                    user:12345,
                    script:12345,
                    quantity:100
                },
                {
                    _id:12345,
                    user:12345,
                    script:12345,
                    quantity:200
                }
            ]
        }
     */
    sellingOrder: [{
            rate: 100,
            orders: [{
                    _id: 12345,
                    user: "Chintan",
                    script: 12345,
                    quantity: 100
                },
                {
                    _id: 12345,
                    user: 12345,
                    script: 12345,
                    quantity: 100
                }
            ]
        },
        {
            rate: 110,
            orders: [{
                    _id: 12345,
                    user: 12345,
                    script: 12345,
                    quantity: 100
                },
                {
                    _id: 12345,
                    user: 12345,
                    script: 12345,
                    quantity: 100
                }
            ]
        },
        {
            rate: 120,
            orders: [{
                    _id: 12345,
                    user: 12345,
                    script: 12345,
                    quantity: 100
                },
                {
                    _id: 12345,
                    user: 12345,
                    script: 12345,
                    quantity: 100
                }
            ]
        }

    ], // will be ascending

    addToBuyingOrder: function (data1, callback) {
        var indexData = _.sortedIndexBy(MatchingEngine.buyingOrder,   { 
            'rate':  data1.rate 
        },  function (o)  { 
            return  -1 * o.rate; 
        });
        var obj = {};
        var alreadyRateAvailable;
        if (MatchingEngine.buyingOrder.length > indexData && MatchingEngine.buyingOrder[indexData].rate == data1.rate) {
            alreadyRateAvailable = true;
            obj.user = data1.user;
            obj.script = data1.script;
            obj.quantity = data1.quantity;
            obj.id = data1._id;
            MatchingEngine.buyingOrder[indexData].orders.push(obj);
        } else {
            objToSend = {};
            objToSend.rate = data1.rate;
            obj.user = data1.user;
            obj.script = data1.script;
            obj.quantity = data1.quantity;
            obj.id = data1._id;
            objToSend.orders = [obj];
            MatchingEngine.buyingOrder.splice(indexData, 0, objToSend);
        }

        MatchingEngine.buyingOrder = MatchingEngine.buyingOrder.slice(0, MatchingEngine.minimumArrayLength);

        console.log("MatchingEngine.buyingOrder", MatchingEngine.buyingOrder);
        if (indexData == 0 && !alreadyRateAvailable) {
            MatchingEngine.matchingBuyingOrderWithSellingOrder(obj, data1.rate, callback);
        } else {
            callback();
        }
    },

    addToSellingOrder: function (data1, callback) {
        var indexData = _.sortedIndexBy(MatchingEngine.sellingOrder,   { 
            'rate':  data1.rate 
        },  function (o)  { 
            return  o.rate; 
        });
        console.log("indexData", indexData);
        var last_element = MatchingEngine.sellingOrder[MatchingEngine.sellingOrder.length - 1];
        if (MatchingEngine.sellingOrder.length > indexData && MatchingEngine.sellingOrder[indexData].rate == data1.rate) {
            var obj = {};
            obj.user = data1.user;
            obj.script = data1.script;
            obj.quantity = data1.quantity;
            obj.id = data1._id;
            MatchingEngine.sellingOrder[indexData].orders.splice(MatchingEngine.sellingOrder[indexData].orders.length, 0, obj);
        } else {
            objToSend = {};
            objToSend.rate = data1.rate;
            var orders = [];
            var obj = {};
            obj.user = data1.user;
            obj.script = data1.script;
            obj.quantity = data1.quantity;
            obj.id = data1._id;
            orders.push(obj);
            objToSend.orders = orders;
            MatchingEngine.sellingOrder.splice(indexData, 0, objToSend);
        }
        console.log("MatchingEngine.sellingOrder", MatchingEngine.sellingOrder);
    },

    removeFromBuyingOrder: function () {

        /**
         * if(currenctRate > buyingOrder.$last.rate) {
         *      _.find(Rate) {
         *          find OrderId Remove the order Id
         *          if OrderObject Length is 0 removeRate and call append
         *      }
         * }
         *  
         */
    },

    removeFromBuyingOrder: function () {

    },

    appendBuying: function () {
        // find diff =  minimumArrayLength-currentLength 
        // find Mongo Order Buying Object less than    buyingOrder.$last.rate with limit `diff`  in descending order
        // append to the array in the end
    },

    appendSelling: function () {

    },

    matchingBuyingOrderWithSellingOrder: function (buyObj, rate, callback) {
        var indexNo = _.sortedIndexBy(MatchingEngine.sellingOrder, {
            rate: rate
        }, function (o) {
            return o.rate;
        });
        var buyingTrades = [];
        var sellingTrades = [];
        var sellingOrdersCount = 0;
        if (indexNo == 0) {

            if (MatchingEngine.sellingOrder.length > 0 && rate == MatchingEngine.sellingOrder[0].rate) {
                sellingOrdersCount = 1;
                /**
                 * Two Trades will occur
                 */
                startTrading(callback);
            } else {
                callback(); // No Trade Should Occur
            }

        } else if (indexNo == MatchingEngine.sellingOrder.length) { // Entire Array is getting matched
            sellingOrdersCount = indexNo;
            /**
             * Multiple Trades can occur
             */
            startTrading(callback);
        } else {
            if (rate == MatchingEngine.sellingOrder[0].rate) {
                sellingOrdersCount = indexNo + 1;
                /**
                 * Multiple Trades will occur
                 */
                startTrading(callback);
            } else {
                sellingOrdersCount = indexNo;
                /**
                 * Multiple Trades will occur
                 */
                startTrading(callback);
            }
        }

        function startTrading(callback) {
            var endLoop = false;
            console.log(sellingOrdersCount);
            for (i = 0; i < sellingOrdersCount && !endLoop; i++) {
                var sellingOrder = MatchingEngine.sellingOrder[i];
                var currentOrderObjectArray = MatchingEngine.sellingOrder[i].orders;
                _.each(currentOrderObjectArray, function (sellingObject) {
                    console.log(buyObj.quantity);
                    if (buyObj.quantity >= sellingObject.quantity) {
                        var buyingTrade = _.cloneDeep(buyObj);
                        buyingTrade.rate = sellingOrder.rate;
                        buyingTrade.quantity = sellingObject.quantity;
                        buyingTrades.push(buyingTrade);

                        var sellingTrade = _.cloneDeep(sellingObject);
                        sellingTrade.rate = sellingOrder.rate;
                        sellingTrade.quantity = sellingObject.quantity;
                        sellingTrades.push(sellingTrade);
                        sellingObject.delete = true;
                        buyObj.quantity -= sellingObject.quantity;
                        if (buyObj.quantity == 0) {
                            endLoop = true;
                            return false;
                        }
                    } else if (buyObj.quantity < sellingObject.quantity) {
                        var buyingTrade = _.cloneDeep(buyObj);
                        buyingTrade.rate = sellingOrder.rate;
                        buyingTrade.quantity = buyObj.quantity;
                        buyingTrades.push(buyingTrade);

                        var sellingTrade = _.cloneDeep(sellingObject);
                        sellingTrade.rate = sellingOrder.rate;
                        sellingTrade.quantity = buyObj.quantity;
                        sellingTrades.push(sellingTrade);
                        sellingObject.quantity -= buyObj.quantity;


                        buyObj.quantity = 0;

                        endLoop = true;
                        return false;
                    }


                });
                MatchingEngine.sellingOrder[i].orders = _.filter(currentOrderObjectArray, function (n) {
                    return !n.delete;
                });


            }
            if (endLoop) {
                MatchingEngine.buyingOrder.shift();
            }
            
            var endLoop2 = false;
            for (i = 0; i < sellingOrdersCount && !endLoop2; i++) {
                if (MatchingEngine.sellingOrder[0].orders.length == 0) {
                    MatchingEngine.sellingOrder.shift();
                } else {
                    endLoop2 = true;
                }
            }

           
            callback(null, {
                buyingTrades: buyingTrades,
                sellingTrades: sellingTrades,
                buyingOrder: MatchingEngine.buyingOrder,
                sellingOrder: MatchingEngine.sellingOrder,
            });
        }




    },

    matchingSellingOrderWithBuyingOrder: function (data1, callback) {
        _.forEach(MatchingEngine.buyingOrder, function (b) {
            if (b.rate == data1.rate) {
                _.forEach(b.orders, function (x) {
                    if (x.quantitydata1.quantity) {

                    }
                })
            }
        })
    },
    sendForTrade: function () {

    }
};