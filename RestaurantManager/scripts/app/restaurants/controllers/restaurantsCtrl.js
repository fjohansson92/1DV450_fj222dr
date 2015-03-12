angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', 'RestaurantFactory', function ($scope, RestaurantFactory) {

	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

	RestaurantFactory.get().$promise.then(function(data) {

		$scope.restaurants = data.restaurants;
	});

 }]);