angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', '$q', '$timeout', '$location', '$routeParams', 'RestaurantFactory', 'PositionFactory', 'uiGmapIsReady', 'uiGmapGoogleMapApi',
																	  function ($scope, $q, $timeout, $location, $routeParams, RestaurantFactory, PositionFactory, uiGmapIsReady, uiGmapGoogleMapApi) {

	var lastLatitude = 45.0;
	var lastLongitude = 15.0;
	var restaurantsTimeout;
	var delay = 2000;
	$scope.restaurantmarkers = [];
	$scope.map = {  control: {}, 
					center: { latitude: lastLatitude, longitude: lastLongitude }, 
					zoom: $routeParams.zoom && !isNaN(parseInt($routeParams.zoom)) ? parseInt($routeParams.zoom) : 3, 
					bounds: {	northeast: { latitude: 68, longitude: 100 },	
								southwest: { latitude: -29,	longitude: -91 }}
			};

	init = function() {

		if($routeParams.latitude && $routeParams.longitude && !isNaN(parseFloat($routeParams.latitude)) && !isNaN(parseFloat($routeParams.longitude))) {
			lastLatitude = parseFloat($routeParams.latitude) - 20;
			uiGmapIsReady.promise().then(function(data){
				centerWatcher(true);
				$scope.map.control.refresh({latitude: parseFloat($routeParams.latitude), longitude: parseFloat($routeParams.longitude)});
			}, function(reason) {
				$scope.errorMessage = "Fail to load google maps. Please try again";
			});
		} else {
			getRestaurantsOnMap(null, true);
		}
	}


	// Watch for map change and update restaurants when latitude or longitude change enoufh relative to zoom.
	centerWatcher = function(update) {
		$scope.$watch('map', function(newVal, oldVal) {
			if (!update) {
				$location.search('latitude', newVal.center.latitude);
				$location.search('longitude', newVal.center.longitude);
				$location.search('zoom', newVal.zoom);

				updateRadio = getUpdateRadio(newVal.zoom);				

				if (!$scope.loading && ((
					(newVal.center.latitude > lastLatitude && newVal.center.latitude - (10 - updateRadio ) > lastLatitude) ||
					(newVal.center.latitude < lastLatitude && newVal.center.latitude + (10 - updateRadio ) < lastLatitude) ||
					(newVal.center.longitude > lastLongitude && newVal.center.longitude - (10 - updateRadio ) > lastLongitude) ||
					(newVal.center.longitude < lastLongitude && newVal.center.longitude + (10 - updateRadio ) < lastLongitude) ) || newVal.zoom != oldVal.zoom)
				) {				
					update = false;
					lastLatitude = newVal.center.latitude;
					lastLongitude = newVal.center.longitude;				
					
					getRestaurantsOnMap();
				}
			} else {
				update = false;
			}
		}, true);
	}



	$scope.paginate = function(url) {
		if (!$scope.loading) {
			params = url.split('&');
			getRestaurantsOnMap(params);
		}
	}



	getRestaurantsOnMap = function(serverParamsString, firstTimeCalled) {
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
		$q.all([promise.$promise, uiGmapGoogleMapApi]).then(function(data){

			$scope.restaurantmarkers = [];
			updateRestaurants(data[0]);					

			restaurantsTimeout = $timeout(function() {
				$scope.loading = false;
				if (firstTimeCalled) {
					centerWatcher();
				}
			}, delay);
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;
			} else {
				$scope.errorMessage = "Fail to load google maps. Please try again";
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


	getUpdateRadio = function(zoom) {
		var x = 9
		if (zoom < 10) {
			x = zoom;
		} else if (zoom > 16) {
			x += 0.99;
		} else if (zoom == 16) {
			x += zoom * 0.062;
		} else if (zoom > 9 && zoom < 12 || zoom > 16) {
			x += zoom * 0.05;
		} else if (zoom > 14) {
			x += zoom * 0.065;
		} else if (zoom > 11 && zoom < 14 || zoom > 13) {
			x += zoom * 0.07;
		}

		return x;
	}



	init();
 }]);