angular.module('RestaurantManager.Restaurants').controller('tempctrl', ['$scope', 'RestaurantFactory', function ($scope, RestaurantFactory) {

	$scope.temp = function() {
		$scope.result = RestaurantFactory.get();
	}
 }]);