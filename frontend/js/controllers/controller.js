myApp.controller('HomeCtrl', function ($scope, $state, TemplateService, NavigationService, apiService, $window, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        TemplateService.header = "";
        TemplateService.footer = "";
        $scope.navigation = NavigationService.getNavigation();


        //sockets

        io.socket.on("BuyOrderAdded", function (data) {
            $scope.lists = data;
            console.log('$scope.lists ', $scope.lists);
        });

        io.socket.on("SellOrderAdded", function (data) {
            $scope.lists1 = data;
            console.log('$scope.lists ', $scope.lists1);
        });

        io.socket.on("TransactionOrderAdded", function (data) {
            $scope.userTransaction = data;
            console.log('$scope.userTransaction ', $scope.userTransaction);
        });

        io.socket.on("UserOrderDataAdded", function (data) {
            $scope.userOrder = data;
            console.log('$scope.userOrder ', $scope.userOrder);
        });

        //sockets end

        $scope.tabs = [{
                title: 'Dynamic Title 1',
                content: 'Dynamic content 1'
            },
            {
                title: 'Dynamic Title 2',
                content: 'Dynamic content 2',
                disabled: true
            }
        ];

        $scope.alertMe = function () {
            setTimeout(function () {
                $window.alert('You\'ve selected the alert tab!');
            });
        };

        $scope.model = {
            name: 'Tabs'
        };
        // Display Buy Sell Transaction All users
        apiService.getCompleteBuyList(function (data) {
            $scope.lists = data.data;
        });
        apiService.getCompleteSellList(function (data) {
            $scope.lists1 = data.data;
        });
        apiService.getCompleteTransactionList(function (data) {
            $scope.lists2 = data.data;
        });
        $scope.value = "";
        $scope.data1 = {};

        // User Login 
        $scope.submitForm = function (data) {
            apiService.userLogin(data, function (saveddata) {
                $.jStorage.set("user", saveddata.data);
                $state.reload();
            });
        };
        $scope.userData = $.jStorage.get("user");


        // Display orders and trades of user
        console.log("$scope.userData ", $scope.userData)

        if ($scope.userData != null && $scope.userData.value == true) {
            data0 = $scope.userData.data;
            apiService.getUserTransactionList(data0, function (data) {
                $scope.userTransaction = data.data;
            });
            console.log("data0", data0)
            var dataToSend = {};
            dataToSend.user = data0._id
            apiService.getUserList(dataToSend, function (data) {
                $scope.userOrder = data.data;
            });
        }
        // log outt
        $scope.logOut = function () {
            $.jStorage.flush();
            $state.reload();
        };

        // Adding orders
        $scope.userData = $.jStorage.get("user");
        $scope.addBuyOrder = function (data) {
            data.user = $scope.userData.data._id;
            data.type = "Buy"
            apiService.getUpdatedUserBuyList(data, function (data) {
                toastr.success("Buy Order List Updated");
            });
        };
        $scope.addSellOrder = function (data) {
            data.user = $scope.userData.data._id;
            data.type = "Sell"
            apiService.getUpdatedUserSellList(data, function (saveddata) {
                toastr.success("Sell Order List Updated");
            });
        };
    })

    .controller('LinksCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/links.html");
        TemplateService.title = "Links"; // This is the Title of the Website
        $scope.navigation = NavigationService.getNavigation();
    })

    .controller('TwoFactorCtrl', function ($scope, TemplateService, NavigationService, $timeout, toastr, $http, apiService, $state) {
        $scope.template = TemplateService.getHTML("content/twofactor.html");
        TemplateService.title = "twofactor"; // This is the Title of the Website
        TemplateService.header = "";
        TemplateService.footer = "";
        $scope.navigation = NavigationService.getNavigation();
        apiService.getSecret(function (data) {
            $scope.qrCodeData = data;
        });
        $scope.enterToken = function () {
            if (_.isEmpty($scope.qrCodeData.token)) {
                toastr.warning('Please enter the token');
            } else {
                apiService.verifyToken($scope.qrCodeData.token, function (data) {
                    $scope.tokenResponse = data;
                    if ($scope.tokenResponse.tokenVerification == false) {
                        toastr.error('Please enter correct token');
                    } else {
                        toastr.success('You are successfully logged in');
                    }
                });
            }


        };
    })

    // EuserDataample API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });