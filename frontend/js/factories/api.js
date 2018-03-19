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
        }
        // This is a demo Service for POST Method.
    };
});