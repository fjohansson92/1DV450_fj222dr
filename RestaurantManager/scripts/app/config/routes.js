angular.module('RestaurantManager').config(['$routeSegmentProvider', '$routeProvider', function ($routeSegmentProvider, $routeProvider) {

$routeSegmentProvider

    .when('/restaurants', 's1')
    .when('/restaurants/search', 's1.search')
    .when('/restaurants/create', 's1.create')
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
            templateUrl: 'views/restaurants/create.html'
        })
        .segment('created', {
            controller: 'CreatedCtrl',
            templateUrl: 'views/restaurants/created.html'
        })
    	.segment('home/:latitude?/:longitude?/:zoom?', {
    		controller: 'PositionCtrl',
			templateUrl: 'views/restaurants/positions.html',
			'default': true
    	})

   	$routeProvider.otherwise({redirectTo: '/restaurants'});
}]);

