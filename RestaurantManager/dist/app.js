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
			controller: 'tempctrl',
			templateUrl: 'views/restaurants/temp.html'
		}).
		otherwise({ redirectTo: '/' });
}]);;angular.module('RestaurantManager.Restaurants').controller('tempctrl', ['$scope', 'RestaurantFactory', function ($scope, RestaurantFactory) {

	$scope.temp = function() {
		$scope.result = RestaurantFactory.get();
	}
 }]);;angular.module('RestaurantManager.Restaurants').directive('temp', function () {
	return {
		template: 'test test test'
	}
});angular.module('RestaurantManager.Restaurants').factory('RestaurantFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'restaurants/:id', {}, {
		'put':    {method:'PUT'}
	});
 }]);;angular.module('templates-dist', ['../views/restaurants/temp.html']);

angular.module("../views/restaurants/temp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/temp.html",
    "<input data-ng-model=\"name\" />\n" +
    "<button data-ng-click=\"temp()\">Test</button>\n" +
    "<div temp></div>\n" +
    "<p data-ng-model=\"result\"></p>\n" +
    "");
}]);
