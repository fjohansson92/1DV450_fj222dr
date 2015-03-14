angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', '$q', '$timeout', 'RestaurantFactory', 'PositionFactory', 'uiGmapGoogleMapApi',
																	  function ($scope, $q, $timeout, RestaurantFactory, PositionFactory, uiGmapGoogleMapApi) {


	var lastLatitude = 45;
	var lastLongitude = 15;
	$scope.map = { center: { latitude: lastLatitude, longitude: lastLongitude }, zoom: 3, bounds: {	northeast: { latitude: 68, longitude: 100 },	
																									southwest: { latitude: -29,	longitude: -91 }}};

	var restaurantsPromise = RestaurantFactory.get();
	$scope.restaurantmarkers = [];


	$q.all([restaurantsPromise.$promise, uiGmapGoogleMapApi]).then(function(data){
		updateRestaurants(data[0]);	
		centerWatcher();
	}, function(reason) {
		if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
			$scope.errorMessage = reason.data.userMessage;
		} else {
			$scope.errorMessage = "Fail to load google maps. Please try again";
		}
	});



	var restaurantsTimeout;
	var delay = 2000;

	// Watch for map change and update restaurants when latitude or longitude change enoufh relative to zoom.
	centerWatcher = function() {
		$scope.$watch('map', function(newVal, oldVal) {
			if (!$scope.loading && (
				(newVal.center.latitude > lastLatitude && newVal.center.latitude - (10 - newVal.zoom ) > lastLatitude) ||
				(newVal.center.latitude < lastLatitude && newVal.center.latitude + (10 - newVal.zoom ) < lastLatitude) ||
				(newVal.center.longitude > lastLongitude && newVal.center.longitude - (10 - newVal.zoom ) > lastLongitude) ||
				(newVal.center.longitude < lastLongitude && newVal.center.longitude + (10 - newVal.zoom ) < lastLongitude) )
			) {				
				lastLatitude = newVal.center.latitude;
				lastLongitude = newVal.center.longitude;				
				
				getRestaurantsOnMap();
			}
		}, true);
	}



	$scope.paginate = function(url) {
		if (!$scope.loading) {
			params = url.split('&');
			getRestaurantsOnMap(params);
		}
	}



	getRestaurantsOnMap = function(serverParamsString) {
		$scope.loading = true;

		params = {
					lat_top: $scope.map.bounds.northeast.latitude,
					lat_bottom: $scope.map.bounds.southwest.latitude,
					lng_right: $scope.map.bounds.northeast.longitude,
					lng_left: $scope.map.bounds.southwest.longitude
				}

		if (serverParamsString) {
			for (var i in serverParamsString ) {
				param = serverParamsString[i].split('=');
				params[param[0]] = param[1];
			}
		}

		promise = PositionFactory.get(params);
		promise.$promise.then(function (data) {

			$scope.restaurantmarkers = [];
			updateRestaurants(data);					

			restaurantsTimeout = $timeout(function() {
				$scope.loading = false;
			}, delay);
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;
			} else {
				$scope.errorMessage = "Fail to load restaurants. Please try again";
			}
		});

	}



	updateRestaurants = function(data) {

		$scope.firstUrl = data.links.first ? data.links.first.split('?')[1] : "";
		$scope.nextUrl = data.links.next ? data.links.next.split('?')[1] : "";
		$scope.prevUrl = data.links.prev ? data.links.prev.split('?')[1] : "";
		$scope.lastUrl = data.links.last ? data.links.last.split('?')[1] : "";

		$scope.restaurants = data.restaurants;
		for (var key in data.restaurants) {
			restaurant = data.restaurants[key]

			$scope.restaurantmarkers.push({
				title: restaurant.name,
				id: parseInt(restaurant.id),
				latitude: restaurant.latitude,
				longitude: restaurant.longitude
		    });
		}
	}
 }]);