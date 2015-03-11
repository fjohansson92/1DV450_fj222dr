angular.module('RestaurantManager.Restaurants').controller('tempctrl', ['$scope', function ($scope) {
	console.log("körs?");
	$scope.temp = function() {
		alert($scope.name)
	}
 }]);