angular.module('RestaurantManager.Restaurants', []);;angular.module('RestaurantManager', [
										'ngRoute', 
									 	'RestaurantManager.Restaurants'
									]
);;angular.module('RestaurantManager').config(['$routeProvider', function ($routeProvider) {

	$routeProvider.
		when('/', {
			controller: 'tempctrl',
			templateUrl: 'views/restaurants/temp.html'
		}).
		otherwise({ redirectTo: '/' });
}]);;angular.module('RestaurantManager.Restaurants').controller('tempctrl', ['$scope', function ($scope) {
	console.log("körs?");
	$scope.temp = function() {
		alert($scope.name)
	}
 }]);;angular.module('RestaurantManager.Restaurants').directive('temp', function () {
	return {
		template: 'test test test'
	}
});angular.module('templates-dist', ['../views/restaurants/temp.html']);

angular.module("../views/restaurants/temp.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/temp.html",
    "<input data-ng-model=\"name\" />\n" +
    "<button data-ng-click=\"temp()\">Test</button>\n" +
    "<div temp></div>\n" +
    "");
}]);
