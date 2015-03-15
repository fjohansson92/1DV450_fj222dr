angular.module('RestaurantManager.Restaurants', []);;angular.module('RestaurantManager', [
										'ngRoute',
										'ngResource',
										'uiGmapgoogle-maps',
									 	'RestaurantManager.Restaurants'
									]
);;angular.module('RestaurantManager')
	.constant('API', 'http://api.lvh.me:3001/v1/');;angular.module('RestaurantManager').config(['$httpProvider', function ($httpProvider) {

	$httpProvider.defaults.headers.common.Authorization = 'Token 123';
	$httpProvider.defaults.headers.common.Accept = 'application/json';

}]);;angular.module('RestaurantManager').config(function(uiGmapGoogleMapApiProvider) {
    
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBmjjMKhsChjnsU63RzxJat-jOZhoZb5xQ',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});angular.module('RestaurantManager').config(['$routeProvider', function ($routeProvider) {

	$routeProvider.
		when('/:southwestlatitude?/:northeastlongitude?/:northeastlatitude?/:southwestlongitude?', {
			controller: 'RestaurantsCtrl',
			templateUrl: 'views/restaurants/restaurants.html'
		}).
		otherwise({ redirectTo: '/' });
}]);;angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', '$q', '$timeout', '$routeParams', 'RestaurantFactory', 'PositionFactory', 'uiGmapGoogleMapApi',
																	  function ($scope, $q, $timeout, $routeParams, RestaurantFactory, PositionFactory, uiGmapGoogleMapApi) {

	var lastLatitude = 45;
	var lastLongitude = 15;
	var restaurantsTimeout;
	var delay = 2000;


	init = function() {
		$scope.map = { center: { latitude: lastLatitude, longitude: lastLongitude }, zoom: 3, bounds: {	northeast: { latitude: 68, longitude: 100 },	
																										southwest: { latitude: -29,	longitude: -91 }}};

		if($routeParams.northeastlatitude && $routeParams.northeastlongitude && $routeParams.southwestlatitude && $routeParams.southwestlongitude) {
		}
		
		getRestaurantsOnMap(null, true);
	}


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


	init();
 }]);;angular.module('RestaurantManager.Restaurants').directive('temp', function () {
	return {
		template: 'test test test'
	}
});angular.module('RestaurantManager.Restaurants').factory('PositionFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'positions', {}, {});
 }]);;angular.module('RestaurantManager.Restaurants').factory('RestaurantFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'restaurants/:id', {}, {
		'put':    {method:'PUT'}
	});
 }]);;angular.module('templates-dist', ['../views/restaurants/restaurants.html']);

angular.module("../views/restaurants/restaurants.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/restaurants.html",
    "<div class=\"row fullheight\">\n" +
    "	<div class=\"col-md-3\">\n" +
    "		<ul>\n" +
    "			<li data-ng-repeat=\"restaurant in restaurants\" >\n" +
    "				{{restaurant.name}}\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "		<button data-ng-disabled=\"firstUrl.length < 1 || prevUrl.length < 1\" data-ng-click=\"paginate(firstUrl)\">First</button>\n" +
    "		<button data-ng-disabled=\"prevUrl.length < 1\" data-ng-click=\"paginate(prevUrl)\">Prev</button>\n" +
    "		<button data-ng-disabled=\"nextUrl.length < 1\" data-ng-click=\"paginate(nextUrl)\">Next</button>\n" +
    "		<button data-ng-disabled=\"lastUrl.length < 1 || nextUrl.length < 1\" data-ng-click=\"paginate(lastUrl)\">Last</button>\n" +
    "	</div>\n" +
    "	<div class=\"col-md-9 fullheight\">\n" +
    "		<ui-gmap-google-map center='map.center' zoom='map.zoom' bounds=\"map.bounds\">\n" +
    "			<ui-gmap-markers models=\"restaurantmarkers\" coords=\"'self'\" icon=\"'icon'\"></ui-gmap-markers>\n" +
    "		</ui-gmap-google-map>	\n" +
    "	</div>\n" +
    "</div>\n" +
    "<p>{{restaurantsError}}</p>\n" +
    "");
}]);
