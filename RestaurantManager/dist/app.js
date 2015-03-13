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
		when('/', {
			controller: 'RestaurantsCtrl',
			templateUrl: 'views/restaurants/restaurants.html'
		}).
		otherwise({ redirectTo: '/' });
}]);;angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', '$q', '$timeout', 'RestaurantFactory', 'PositionFactory', 'uiGmapGoogleMapApi',
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
