myApp.controller('HomeCtrl', function ($scope, TemplateService, NavigationService, $window, $timeout, toastr, $http) {
        $scope.template = TemplateService.getHTML("content/home.html");
        TemplateService.title = "Home"; //This is the Title of the Website
        TemplateService.header = "";
        TemplateService.footer = "";
        $scope.navigation = NavigationService.getNavigation();

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

        $scope.tableAmount = [{
                usdt: "57658.89",
                btc: "0.574765",
                tusdt: "45675483"
            },
            {
                usdt: "57658.89",
                btc: "0.67476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.09",
                btc: "0.6476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.87",
                btc: "0.6476587",
                tusdt: "456754832"
            },
            {
                usdt: "57658.65",
                btc: "0.476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.56",
                btc: "0.6476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.32",
                btc: "0.476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.43",
                btc: "0.6476587",
                tusdt: "456754832"
            },
            {
                usdt: "57658.76",
                btc: "0.6476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.43",
                btc: "0.476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.54",
                btc: "0.476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.12",
                btc: "0.476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.43",
                btc: "0.476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.76",
                btc: "0.476587",
                tusdt: "45675483"
            },
            {
                usdt: "57658.23",
                btc: "0.476587",
                tusdt: "45675483"
            },
        ];

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


        }
    })

    // Example API Controller
    .controller('DemoAPICtrl', function ($scope, TemplateService, apiService, NavigationService, $timeout) {
        apiService.getDemo($scope.formData, function (data) {
            console.log(data);
        });
    });