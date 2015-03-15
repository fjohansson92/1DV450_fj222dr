angular.module('RestaurantManager').config(['$routeProvider', function ($routeProvider) {

	$routeProvider.
		when('/:southwestlatitude?/:northeastlongitude?/:northeastlatitude?/:southwestlongitude?', {
			controller: 'RestaurantsCtrl',
			templateUrl: 'views/restaurants/restaurants.html'
		}).
		otherwise({ redirectTo: '/' });
}]);