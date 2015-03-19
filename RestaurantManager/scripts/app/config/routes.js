angular.module('RestaurantManager').config(['$routeSegmentProvider', '$routeProvider', function ($routeSegmentProvider, $routeProvider) {

$routeSegmentProvider

    .when('/restaurants', 's1')
    .when('/restaurants/search', 's1.search')

    .segment('s1', {
    	templateUrl: 'views/restaurants.html',
    	controller: 'RestaurantCtrl'
    })

    .within()
    	.segment('search', {
    		controller: 'SearchCtrl',
			templateUrl: 'views/restaurants/search.html'
    	})


    	.segment('home/:latitude?/:longitude?/:zoom?', {
    		controller: 'PositionCtrl',
			templateUrl: 'views/restaurants/positions.html',
			'default': true
    	})

   	$routeProvider.otherwise({redirectTo: '/restaurants'});
}]);





