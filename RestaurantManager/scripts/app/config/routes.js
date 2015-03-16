angular.module('RestaurantManager').config(['$routeProvider', function ($routeProvider) {

	$routeProvider.
		when('/:latitude?/:longitude?/:zoom?', {
			controller: 'RestaurantsCtrl',
			templateUrl: 'views/restaurants/restaurants.html',
			reloadOnSearch: false
		}).
		otherwise({ redirectTo: '/' });
}]);