myApp.controller('HomeCtrl', function ($scope, $state, TemplateService, NavigationService, apiService, $window, $timeout, $uibModal, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        TemplateService.header = "";
        TemplateService.footer = "";
        $scope.navigation = NavigationService.getNavigation();
        var registerPopup = null;

        function convertData(data) {
            return _.map(_.slice(data, 0, 20), function (n) {
                var quantity = _.sumBy(n.orders, function (o) {
                    return o.quantity;
                });
                return {
                    rate: n.rate,
                    quantity: quantity
                };
            });
        }


        $scope.openModal = function () {
            registerPopup = $uibModal.open({
                templateUrl: "views/content/modal/register.html",
                scope: $scope,
                // windowClass: "login-modal"
            });
        };

        $scope.open2Factor = function () {
            registerPopup = $uibModal.open({
                templateUrl: "views/content/modal/two-factor.html",
                scope: $scope,
                size: "lg",
                // windowClass: "login-modal"
            });
        };

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

        $scope.closeModal = function (data1) {

            apiService.userRegister(data1, function (data) {
                if (_.isEmpty(data)) {
                    toastr.warning("Please Enter unique Username");
                }
            });
            registerPopup.close();
        };

        //sockets

        io.socket.on("BuyOrderAdded", function (data) {
            $scope.lists = convertData(data);
            $scope.$apply();
        });



        io.socket.on("SellOrderAdded", function (data) {
            $scope.lists1 = convertData(data);
            $scope.$apply();
        });

        io.socket.on("AllTransactionDataAdded", function (data) {
            $scope.allTransactionData = data;
            $scope.$apply();
        });


        io.socket.on("TransactionOrderAdded", function (data) {
            if ($scope.userData != null && $scope.userData.value == true) {
                var getUserTransactionData = {};
                getUserTransactionData.user = $scope.userData.data._id;
                apiService.getUserTransactionList(getUserTransactionData, function (data) {
                    $scope.userTransaction = data.data;
                });
            }
        });

        io.socket.on("UserOrderDataAdded", function (data) {
            $scope.userOrder = data;
            $scope.$apply();
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
            $scope.lists = convertData(data.data);
        });
        apiService.getCompleteSellList(function (data) {
            $scope.lists1 = convertData(data.data);
        });

        apiService.getCompleteTransactionList(function (data) {
            $scope.allTransactionData = data.data;
        });


        $scope.value = "";
        $scope.data1 = {};


        $scope.closeCodeModal = function(vrcode){
        console.log(vrcode);
        $state.reload();
        }
        // User Login 
        $scope.submitForm = function (data) {
            registerPopup = $uibModal.open({
                templateUrl: "views/content/modal/code.html",
                scope: $scope,
                // windowClass: "login-modal"
            });
            apiService.userLogin(data, function (data) {
                $.jStorage.set("user", data);
                
            });
        };
        $scope.userData = $.jStorage.get("user");

        // Display orders and trades of user

        if ($scope.userData != null && $scope.userData.value == true) {

            var getUserTransactionData = {};
            getUserTransactionData.user = $scope.userData.data._id;
            apiService.getUserTransactionList(getUserTransactionData, function (data) {
                $scope.userTransaction = data.data;
            });

            var dataToSend = {};
            dataToSend.user = $scope.userData.data._id;
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
            data.type = "Buy";
            apiService.getUpdatedUserBuyList(data, function (data) {
                toastr.success("Buy Order List Updated");
            });
        };
        $scope.addSellOrder = function (data) {
            data.user = $scope.userData.data._id;
            data.type = "Sell";
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
        apiService.getDemo($scope.formData, function (data) {});
    });