angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', '$q', 'RestaurantFactory', 'uiGmapGoogleMapApi', function ($scope, $q, RestaurantFactory, uiGmapGoogleMapApi) {

	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

	var restaurantsPromise = RestaurantFactory.get();
	$scope.restaurantmarkers = [];

	$q.all([restaurantsPromise.$promise, uiGmapGoogleMapApi]).then(function(data){

		$scope.restaurants = data[0].restaurants;

		for (var key in $scope.restaurants) {
			restaurant = $scope.restaurants[key]

			$scope.restaurantmarkers.push({
				title: restaurant.name,
				id: parseInt(restaurant.id),
	            latitude: restaurant.latitude,
	            longitude: restaurant.longitude
	        });
		}
	}, function(reason) {
		if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
			$scope.errorMessage = reason.data.userMessage;
		} else {
			$scope.errorMessage = "Fail to load google maps. Please try again";
		}
	});




 }]);