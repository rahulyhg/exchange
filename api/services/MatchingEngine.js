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
    sellingOrder: [], // will be ascending

    // addToBuyingOrder: function (data1, callback) {
    //     // currentRate > buyingOrder.$last.rate {
    //     //     findSortedIndexBy(currentRate) {
    //     //         check this element whether it has the same rate if yes
    //     //             add order within the same
    //     //         else 
    //     //             add the entire rate object
    //     //             slice the array by minimumArrayLength; 
    //     // call append

    //     //     }
    //     // } 
    //     // currentRate == buyingOrder.$last.rate {
    //     // }
    // },

    addToBuyingOrder: function (data1, callback) {
        var indexData = _.sortedIndexBy(MatchingEngine.buyingOrder,   { 
            'rate':  data1.rate 
        },  function (o)  { 
            return  -1 * o.rate; 
        });
        var obj = {};
        var alreadyRateAvailable;
        var last_element = MatchingEngine.buyingOrder[MatchingEngine.buyingOrder.length - 1];
        if (data1.rate >= last_element.rate) {
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
        } else {
            console.log("Rate is lower than index")
        }
        console.log("MatchingEngine.buyingOrder", MatchingEngine.buyingOrder);
        if (indexData == 0 && !alreadyRateAvailable) {
            MatchingEngine.matchingBuyingOrderWithSellingOrder(obj, data1.rate, callback);
        } else {
            callback();
        }
    },

    addToSellingOrder: function (data1, callback) {
        if (!_.isEmpty(MatchingEngine.sellingOrder)) {
            var indexData = _.sortedIndexBy(MatchingEngine.sellingOrder,   { 
                'rate':  data1.rate 
            },  function (o)  { 
                return  o.rate; 
            });
            console.log("indexData", indexData);
            var last_element = MatchingEngine.sellingOrder[MatchingEngine.sellingOrder.length - 1];
            if (last_element.rate >= data1.rate) {
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
            } else {
                console.log("Rate is greater than index")
            }
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
        var sellingOrdersCount = [];
        if (indexNo == 0) {

            if (rate == MatchingEngine.sellingOrder[0].rate) {
                sellingOrdersCount = 1;
                /**
                 * Two Trades will occur
                 */
            } else {
                callback(); // No Trade Should Occur
            }

        } else if (indexNo == MatchingEngine.sellingOrder.length) { // Entire Array is getting matched
            SellingOrders = indexNo;
            /**
             * Multiple Trades can occur
             */
        } else {
            if (rate == MatchingEngine.sellingOrder[0].rate) {
                sellingOrdersCount = indexNo + 1;
                /**
                 * Multiple Trades will occur
                 */
            } else {
                sellingOrdersCount = indexNo;
                /**
                 * Multiple Trades will occur
                 */
            }
        }

        function startTrading() {
            var endLoop = false;
            for (i = 0; i < sellingOrdersCount && !endLoop; i++) {
                var sellingOrder = MatchingEngine.sellingOrder[i];
                var currentOrderObjectArray = MatchingEngine.sellingOrder[i].orders;
                _.each(currentOrderObjectArray, function (sellingObject) {
                    if (buyObj.quantity==0) {
                        endLoop = true;
                        return false;
                    } else if (buyObj.quantity >= sellingObject.quantity) {
                        var buyingTrade = _.cloneDeep(buyObj);
                        buyingTrade.rate = sellingOrder.rate;
                        buyingTrade.quantity = sellingObject.quantity;
                        buyingTrades.push(buyingTrade);
                        buyObj.quantity -= sellingObject.quantity;

                        var sellingTrade = _.cloneDeep(sellingObject);
                        sellingTrade.rate = sellingOrder.rate;
                        sellingTrade.quantity = sellingObject.quantity;
                        sellingTrades.push(sellingTrade);
                        sellingObject.delete = true;   
                    } else if (buyObj.quantity < sellingObject.quantity){
                        var buyingTrade = _.cloneDeep(buyObj);
                        buyingTrade.rate = sellingOrder.rate;
                        buyingTrade.quantity = buyObj.quantity;
                        buyingTrades.push(buyingTrade);
                        buyObj.quantity = 0;

                        var sellingTrade = _.cloneDeep(sellingObject);
                        sellingTrade.rate = sellingOrder.rate;
                        sellingTrade.quantity = buyObj.quantity;
                        sellingTrades.push(sellingTrade);
                        sellingObject.quantity -= buyObj.quantity;

                        endLoop = true;
                        return false;
                    }
                    MatchingEngine.sellingOrder[i].orders = _.filter(currentOrderObjectArray,function(n) {
                        return !n.delete; 
                    });
                    if(MatchingEngine.sellingOrder[i].orders.length == 0) {
                        MatchingEngine.sellingOrder.shift();
                        i--;
                        sellingOrdersCount--;
                    }
                });
            }
            
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