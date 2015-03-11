angular.module('RestaurantManager.Restaurants', []);;angular.module('RestaurantManager', [
										'ngRoute',
										'ngResource',
									 	'RestaurantManager.Restaurants'
									]
);;angular.module('RestaurantManager')
	.constant('API', 'http://api.lvh.me:3001/v1/');;angular.module('RestaurantManager').config(['$httpProvider', function ($httpProvider) {

	$httpProvider.defaults.headers.common.Authorization = 'Token 123';
	$httpProvider.defaults.headers.common.Accept = 'application/json';
}]);;angular.module('RestaurantManager').config(['$routeProvider', function ($routeProvider) {

	$routeProvider.
		when('/', {
			controller: 'RestaurantsCtrl',
			templateUrl: 'views/restaurants/restaurants.html'
		}).
		otherwise({ redirectTo: '/' });
}]);;angular.module('RestaurantManager.Restaurants').controller('RestaurantsCtrl', ['$scope', 'RestaurantFactory', function ($scope, RestaurantFactory) {

	RestaurantFactory.get().$promise.then(function(data) {

		$scope.restaurants = data.restaurants;
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
    "<ul>\n" +
    "	<li data-ng-repeat=\"restaurant in restaurants\" >\n" +
    "		{{restaurant.name}}\n" +
    "	</li>\n" +
    "</ul>");
}]);
