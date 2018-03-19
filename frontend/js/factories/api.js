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
            $http.get("./json/User/getSecret.json").then(function (data) {
                callback(data.data.data);
            });
        },
        verifyToken: function (data, callback) {
            $http.get("./json/User/verifyToken.json", data).then(function (data) {
                callback(data.data.data);
            });
        }

        // This is a demo Service for POST Method.


    };
});