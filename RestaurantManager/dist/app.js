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
}]);;angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', '$q', 'RestaurantFactory', 'uiGmapGoogleMapApi', function ($scope, $q, RestaurantFactory, uiGmapGoogleMapApi) {

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




 }]);;angular.module('RestaurantManager.Restaurants').directive('temp', function () {
	return {
		template: 'test test test'
	}
});angular.module('RestaurantManager.Restaurants').factory('RestaurantFactory', ['$resource', 'API', function ($resource, $API) {
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
    "		<ui-gmap-google-map center='map.center' zoom='map.zoom' >\n" +
    "			<ui-gmap-markers models=\"restaurantmarkers\" coords=\"'self'\" icon=\"'icon'\"></ui-gmap-markers>\n" +
    "		</ui-gmap-google-map>	\n" +
    "	</div>\n" +
    "</div>\n" +
    "<p>{{restaurantsError}}</p>\n" +
    "");
}]);
