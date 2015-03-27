angular.module('RestaurantManager').config(['$routeSegmentProvider', '$routeProvider', function ($routeSegmentProvider, $routeProvider) {

$routeSegmentProvider

    .when('/restaurants', 's1')
    .when('/restaurants/search', 's1.search')
    .when('/restaurants/create', 's1.create')
    .when('/restaurants/edit/:id', 's1.edit')
    .when('/restaurants/created', 's1.created')

    .segment('s1', {
    	templateUrl: 'views/restaurants.html',
    	controller: 'RestaurantCtrl'
    })

    .within()
    	.segment('search', {
    		controller: 'SearchCtrl',
			templateUrl: 'views/restaurants/search.html'
    	})
        .segment('create', {
            controller: 'CreateCtrl',
            templateUrl: 'views/restaurants/create.html',
            resolve: {
                resolvedData: checkUser
            }
        })
        .segment('edit', {
            controller: 'CreateCtrl',
            templateUrl: 'views/restaurants/create.html',
            dependencies: ['id'],
            resolve: {
                resolvedData: checkUser
            }
        })
        .segment('created', {
            controller: 'CreatedCtrl',
            templateUrl: 'views/restaurants/created.html',
            resolve: {
                resolvedData: checkUser
            }
        })
    	.segment('home/:latitude?/:longitude?/:zoom?', {
    		controller: 'PositionCtrl',
			templateUrl: 'views/restaurants/positions.html',
			'default': true
    	})

   	$routeProvider.otherwise({redirectTo: '/restaurants'});
}]);

var checkUser = ['LoginFactory', '$location', function(LoginFactory, $location) {
    if (!LoginFactory.user.loggedin) {
        LoginFactory.setShowMessage();
        $location.path('/restaurants');
    }
}];

