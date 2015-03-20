angular.module('RestaurantManager.Restaurants').controller('PositionCtrl', ['$scope', '$q', '$timeout', 'PositionFactory', 'RestaurantDataFactory',
																	  function ($scope, $q, $timeout, PositionFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();
	var allowWatch = false;

	init = function() {
		
		if($scope.restData.cordsInParams) {
			var unregister = $scope.$watch('restData.map', function(newVal, oldVal) {
				if (!$scope.restData.map.waitForRefresh) {
					getRestaurantsOnMap(null);
					unregister();
					allowWatch = true;
				}
			}, true);
		} else {
			getRestaurantsOnMap(null, true);
			allowWatch = true;
		}
	}

	// Watch for map change and update restaurants when latitude or longitude change enoufh relative to zoom.
	centerWatcher = function(newVal, oldVal) {
		updateRadio = getUpdateRadio(newVal.zoom);				

		if (!$scope.restData.loading && (
			(newVal.center.latitude > $scope.restData.lastLatitude && newVal.center.latitude - (10 - updateRadio ) > $scope.restData.lastLatitude) ||
			(newVal.center.latitude < $scope.restData.lastLatitude && newVal.center.latitude + (10 - updateRadio ) < $scope.restData.lastLatitude) ||
			(newVal.center.longitude > $scope.restData.lastLongitude && newVal.center.longitude - (10 - updateRadio ) > $scope.restData.lastLongitude) ||
			(newVal.center.longitude < $scope.restData.lastLongitude && newVal.center.longitude + (10 - updateRadio ) < $scope.restData.lastLongitude) || 
			newVal.zoom != oldVal.zoom)
		) {	
			update = false;
			$scope.restData.lastLatitude = newVal.center.latitude;
			$scope.restData.lastLongitude = newVal.center.longitude;
			getRestaurantsOnMap(null);
		}
	}

	$scope.$on('mapChange', function(event, args) {
		if (allowWatch) {
			centerWatcher(args.newVal, args.oldVal);
		}
	});

	$scope.$on('paginate', function(event, args) {
		if (allowWatch && !$scope.restData.loading ) {
			getRestaurantsOnMap(args);
		}
	});


	getRestaurantsOnMap = function(serverParamsString, firstTimeCalled) {
		RestaurantDataFactory.loading();
		params = serverParamsString ? serverParamsString : {};

		params.lat_top = $scope.restData.map.bounds.northeast.latitude;
		params.lat_bottom = $scope.restData.map.bounds.southwest.latitude;
		params.lng_right = $scope.restData.map.bounds.northeast.longitude;
		params.lng_left = $scope.restData.map.bounds.southwest.longitude;


		promise = PositionFactory.get(params);
		$q.all([promise.$promise, $scope.restData.uiGmapApiPromise]).then(function(data){

			RestaurantDataFactory.setRestaurantData(data[0]);					
			if (firstTimeCalled) {
				RestaurantDataFactory.refreshMap();
			}

			var restaurantsTimeout = $timeout(function() {
				RestaurantDataFactory.stopLoading();
			}, 1000);
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				RestaurantDataFactory.setErrorMessage(reason.data.userMessage);
			}
		});
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