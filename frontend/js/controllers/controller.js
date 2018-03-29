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
            $scope.allBuyOrderData = convertData(data);
            $scope.$apply();
        });



        io.socket.on("SellOrderAdded", function (data) {
            $scope.allSellOrderData = convertData(data);
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
        io.socket.on("UpdatedBalance", function (data) {
            if (data.currency == "USDT") {
                $scope.userUSDTBalance = (data.balance).toFixed(2);
            } else {
                $scope.userBTCBalance = (data.balance).toFixed(8);
            }
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
            $scope.allBuyOrderData = convertData(data.data);
        });
        apiService.getCompleteSellList(function (data) {
            $scope.allSellOrderData = convertData(data.data);
        });

        apiService.getCompleteTransactionList(function (data) {
            $scope.allTransactionData = data.data;
        });


        $scope.value = "";
        $scope.data1 = {};


        $scope.closeCodeModal = function (vrcode) {
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
                if (data.value == false) {
                    toastr.error("Incorrect Credentials!", "Try Again");
                }
                $.jStorage.set("user", data);

            });
        };
        $scope.userData = $.jStorage.get("user");
        $scope.goToSellOrder = function (data) {
            $scope.sellData = {};
            document.getElementById('sellOrderRate').value = $scope.sellData.rate = data.rate;
            document.getElementById('sellOrderQuantity').value = $scope.sellData.quantity = data.quantity;
            document.getElementById('sellOrderTotal').value = data.rate * data.quantity;
        };
        $scope.goToBuyOrder = function (data) {
            $scope.buyData = {};
            document.getElementById('buyOrderRate').value = $scope.buyData.rate = data.rate;
            document.getElementById('buyOrderQuantity').value = $scope.buyData.quantity = data.quantity;
            document.getElementById('buyOrderTotal').value = (data.rate * data.quantity);
        };

        //Balance Display
        if ($scope.userData != null && $scope.userData.value == true) {
            var getUserBalance = {};
            getUserBalance.user = $scope.userData.data._id;
            apiService.getBalance(getUserBalance, function (data) {
                if (data.value == true) {
                    _.forEach(data.data, function (balArray) {
                        if (balArray.currency == "BTC") {

                            $scope.userBTCBalance = (balArray.balance).toFixed(8);
                        } else {
                            $scope.userUSDTBalance = (balArray.balance).toFixed(2);
                        }
                    });
                } else {
                    $scope.userBTCBalance = 0;
                    $scope.userBTCBalance = ($scope.userBTCBalance).toFixed(8);
                    $scope.userUSDTBalance = 0;
                    $scope.userUSDTBalance = ($scope.userUSDTBalance).toFixed(2);

                }
            });
        }
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
            var newBal = 0;
            data.user = $scope.userData.data._id;
            data.type = "Buy";
            total = data.rate * data.quantity;
            currentUserBuyOrder = data;
            apiService.getBalance(getUserBalance, function (data) {

                _.forEach(data.data, function (balArray) {
                    if (balArray.currency == "USDT") {
                        userUSDTBalance1 = balArray.balance;
                        if (total <= userUSDTBalance1) {
                            newBal = userUSDTBalance1 - total;
                            getUserBalance.balance = newBal;
                            getUserBalance.currency = "USDT";
                            apiService.updateBalance(getUserBalance, function (data) {});
                            apiService.getUpdatedUserBuyList(currentUserBuyOrder, function (data) {
                                toastr.success("Buy Order List Updated");
                            });
                        } else {
                            toastr.error("Insufficient Balance");
                        }
                    }
                });

            });




        };
        $scope.addSellOrder = function (data) {
            var newBal = 0;
            data.user = $scope.userData.data._id;
            data.type = "Sell";
            BTCQuantity = data.quantity;
            currentUserSellOrder = data;
            apiService.getBalance(getUserBalance, function (data) {
                _.forEach(data.data, function (balArray) {
                    if (balArray.currency == "BTC") {
                        userBTCBalance1 = balArray.balance;
                        if (BTCQuantity <= userBTCBalance1) {
                            newBal = userBTCBalance1 - BTCQuantity;
                            getUserBalance.balance = newBal;
                            getUserBalance.currency = "BTC";
                            apiService.updateBalance(getUserBalance, function (data) {});
                            apiService.getUpdatedUserSellList(currentUserSellOrder, function (saveddata) {
                                toastr.success("Sell Order List Updated");
                            });
                        } else {
                            toastr.error("Insufficient Balance");
                        }
                    }
                });
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