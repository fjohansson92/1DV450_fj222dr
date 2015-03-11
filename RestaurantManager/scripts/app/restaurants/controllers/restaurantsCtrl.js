angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', 'RestaurantFactory', function ($scope, RestaurantFactory) {

	RestaurantFactory.get().$promise.then(function(data) {

		$scope.restaurants = data.restaurants;
	});

 }]);