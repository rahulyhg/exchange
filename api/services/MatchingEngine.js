// import { INSPECT_MAX_BYTES } from "buffer";

module.exports = {
    minimumArrayLength: 100,
    buyingOrder: [], // will be descending

    // createByingOrderArry: function (data, callback) {
    //     var objToSend;
    //     _.forEach(data, function (x) {
    //         objToSend = {};
    //         objToSend.rate = x.rate;
    //         var orders = [];
    //         var obj = {};
    //         obj.user = x.user;
    //         obj.script = x.script;
    //         obj.quantity = x.quantity;
    //         obj.id = x._id;
    //         orders.push(obj);
    //         objToSend.orders = orders;
    //         MatchingEngine.buyingOrder.push(objToSend);
    //     })

    //     console.log("MatchingEngine.buyingOrder", MatchingEngine.buyingOrder)
    // },

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

    addToBuyingOrder: function (data1, callback) {

        // if (!_.isEmpty(MatchingEngine.buyingOrder))   {
        //     _.forEach(MatchingEngine.buyingOrder, function (x) {
        //         if (x.rate == data1.rate) {
        //             var obj = {};
        //             obj.user = data1.user;
        //             obj.script = data1.script;
        //             obj.quantity = data1.quantity;
        //             obj.id = data1._id;
        //             x.orders.push(obj)
        //         }else{
        //             objToSend = {};
        //             objToSend.rate = data1.rate;
        //             var orders = [];
        //             var obj = {};
        //             obj.user = data1.user;
        //             obj.script = data1.script;
        //             obj.quantity = data1.quantity;
        //             obj.id = data1._id;
        //             orders.push(obj);
        //             objToSend.orders = orders;
        //             MatchingEngine.buyingOrder.push(objToSend);
        //         }
        //     })
        // } else {
        //     objToSend = {};
        //     objToSend.rate = data1.rate;
        //     var orders = [];
        //     var obj = {};
        //     obj.user = data1.user;
        //     obj.script = data1.script;
        //     obj.quantity = data1.quantity;
        //     obj.id = data1._id;
        //     orders.push(obj);
        //     objToSend.orders = orders;
        //     MatchingEngine.buyingOrder.push(objToSend);
        // }

        // console.log("MatchingEngine.buyingOrder",MatchingEngine.buyingOrder );

        var arryData;
        BuyOrder.findAllBuyOrders(data1, function (err, data) {
            MatchingEngine.buyingOrder = data.slice(0, 100);
            var last_element = MatchingEngine.buyingOrder[MatchingEngine.buyingOrder.length - 1];

            if (data1.rate > last_element._id) {
                // MatchingEngine.buyingOrder.splice(0,0,"abc");
                console.log("MatchingEngine.buyingOrder", MatchingEngine.buyingOrder)
                //    var indexPosition= _.sortedIndexBy(MatchingEngine.buyingOrder, {'_id':data1.rate}, function (o) {
                //         return o.x;
                //     });
                //     console.log("indexPosition",indexPosition);
                //    var findData= _.find(MatchingEngine.buyingOrder, function(o) { return o._id == data1.rate; });
                //         console.log("findData",findData);
            }
            // var objToPush={};
            // objToPush.user=data1.user;
            // objToPush.quantity=data1.quantity;
            // objToPush.id=data1._id;    
            // findData.orders.push(objToPush) 
            // console.log("findData",findData)       
        })


        // currentRate > buyingOrder.$last.rate {
        //     findSortedIndexBy(currentRate) {
        //         check this element whether it has the same rate if yes
        //             add order within the same
        //         else 
        //             add the entire rate object
        //             slice the array by minimumArrayLength; 
        // call append

        //     }
        // } 
        // currentRate == buyingOrder.$last.rate {
        // }
    },
    addToSellingOrder: function () {

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
    matchingBuyingOrderWithSellingOrder: function () {

    },
    matchingSellingOrderWithBuyingOrder: function () {

    },
    sendForTrade: function () {

    }
};