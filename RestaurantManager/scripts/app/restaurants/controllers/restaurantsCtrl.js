angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', '$q', '$timeout', 'RestaurantFactory', 'PositionFactory', 'uiGmapGoogleMapApi',
																	  function ($scope, $q, $timeout, RestaurantFactory, PositionFactory, uiGmapGoogleMapApi) {


	var lastLatitude = 45;
	var lastLongitude = 15;


	$scope.map = { center: { latitude: lastLatitude, longitude: lastLongitude }, zoom: 3, bounds: { }  };

	var restaurantsPromise = RestaurantFactory.get();
	$scope.restaurantmarkers = [];



	var restaurantsTimeout;
	var delay = 2000;



	$scope.updateRestaurants = function(restaurants) {
		for (var key in restaurants) {
			restaurant = restaurants[key]

			$scope.restaurantmarkers.push({
				title: restaurant.name,
				id: parseInt(restaurant.id),
		         latitude: restaurant.latitude,
		         longitude: restaurant.longitude
		     });
		}
	}




	$scope.centerWatcher = function() {
		$scope.$watch('map', function(newVal, oldVal) {
			if (!$scope.loading && (
				(newVal.center.latitude > lastLatitude && newVal.center.latitude - (10 - newVal.zoom ) > lastLatitude) ||
				(newVal.center.latitude < lastLatitude && newVal.center.latitude + (10 - newVal.zoom ) < lastLatitude) ||
				(newVal.center.longitude > lastLongitude && newVal.center.longitude - (10 - newVal.zoom ) > lastLongitude) ||
				(newVal.center.longitude < lastLongitude && newVal.center.longitude + (10 - newVal.zoom ) < lastLongitude) )
			) {
				$scope.loading = true;
				lastLatitude = newVal.center.latitude;				

				promise = PositionFactory.get({
											   	lat_top: $scope.map.bounds.northeast.latitude,
											   	lat_bottom: $scope.map.bounds.southwest.latitude,
												lng_right: $scope.map.bounds.northeast.longitude,
											   	lng_left: $scope.map.bounds.southwest.longitude
											});

				promise.$promise.then(function (data) {
					
					$scope.restaurantmarkers = [];

					$scope.restaurants = data.restaurants;
					$scope.updateRestaurants($scope.restaurants);					

					restaurantsTimeout = $timeout(function() {
						$scope.loading = false;
					}, delay);
				});
			}

		}, true);
	}


	$q.all([restaurantsPromise.$promise, uiGmapGoogleMapApi]).then(function(data){

		$scope.restaurants = data[0].restaurants;
		$scope.updateRestaurants($scope.restaurants);	

		$scope.centerWatcher();

	}, function(reason) {
		if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
			$scope.errorMessage = reason.data.userMessage;
		} else {
			$scope.errorMessage = "Fail to load google maps. Please try again";
		}
	});




 }]);