angular.module('RestaurantManager').config(['$routeProvider', function ($routeProvider) {

	$routeProvider.
		when('/', {
			controller: 'tempctrl',
			templateUrl: 'views/restaurants/temp.html'
		}).
		otherwise({ redirectTo: '/' });
}]);