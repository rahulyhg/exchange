// import { INSPECT_MAX_BYTES } from "buffer";

module.exports = {
    minimumArrayLength:100,
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
    addToBuyingOrder: function (order,callback) {
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
    appendBuying: function() {
        // find diff =  minimumArrayLength-currentLength 
        // find Mongo Order Buying Object less than    buyingOrder.$last.rate with limit `diff`  in descending order
        // append to the array in the end
    },
    appendSelling: function() {
        
    },
    matchingBuyingOrderWithSellingOrder: function () {

    },
    matchingSellingOrderWithBuyingOrder: function () {
        
    },
    sendForTrade: function () {

    }




};