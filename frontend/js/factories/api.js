myApp.factory('apiService', function ($http, $q, $timeout) {
    return {

        // This is a demo Service for POST Method.
        getDemo: function (formData, callback) {
            $http({
                url: adminurl + 'demo/demoService',
                method: 'POST',
                data: formData
            }).success(callback);
        },
        getSecret: function (callback) {
            $http.post(adminurl + "User/getSecret").then(function (data) {
                callback(data.data.data);
            });
        },
        verifyToken: function (token, callback) {
            $http.post(adminurl + "User/verifyToken", {
                token: token
            }).then(function (data) {
                callback(data.data.data);
            });
        },
        // User Login
        userLogin: function (data,callback) {
            $http.post(adminurl + "User/login", {
                data: data

            }).then(function (data) {
                callback(data);
            });
        },
        //Buy order services
        getCompleteBuyList: function (callback) {
            $http.post(adminurl + "BuyOrder/getCompleteBuyList").then(function (data) {
                if (data) {
                    data = data.data;
                    callback(data);
                }
            });
        },
        getUserBuyList: function (data, callback) {
            $http.post(adminurl + "BuyOrder/getUserBuyList", {
                data: data

            }).then(function (data) {
                callback(data);
            });
        },

        getUpdatedUserBuyList: function (data, callback) {
            $http.post(adminurl + "BuyOrder/Save", data).then(function (data) {
                callback(data);
            });
        },
        //Sell order services
        getCompleteSellList: function (callback) {
            $http.post(adminurl + "SellOrder/getCompleteSellList").then(function (data) {
                if (data) {
                    data = data.data;
                    callback(data);
                }
            });
        },
        getUserSellList: function (data, callback) {
            $http.post(adminurl + "SellOrder/getUserSellList", {
                data: data

            }).then(function (data) {
                callback(data);
            });
        },

        getUpdatedUserSellList: function (data, callback) {
            $http.post(adminurl + "SellOrder/Save", data).then(function (data) {
                callback(data);
            });
        },
        //Trade services
        getCompleteTransactionList: function (callback) {
            $http.post(adminurl + "Transaction/getCompleteTransactionList").then(function (data) {
                if (data) {
                    data = data.data;
                    callback(data);
                }
            });
        },
        getUserTransactionList: function (data, callback) {
       
            $http.post(adminurl + "Transaction/getUserTransactionList", {
                data: data

            }).then(function (data) {
               
                callback(data);
            });
        },

        getUpdatedUserTransactionList: function (data, callback) {
    
            $http.post(adminurl + "Transaction/Save", data).then(function (data) {
                callback(data);
            });
        },
        // This is a demo Service for POST Method.
    };
});