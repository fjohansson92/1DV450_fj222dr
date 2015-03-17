angular.module('RestaurantManager.Restaurants').controller('SearchCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory', '$location', 
																   function ($scope, RestaurantFactory, RestaurantDataFactory, $location) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();

	$scope.search = function(searchWords) {

		$location.search('search', searchWords).replace();

		$scope.latestSearch = searchWords;

		q = searchWords.replace(/\s/g, ' ')
		promise = RestaurantFactory.get({q: q});
		promise.$promise.then(function(data) {
			RestaurantDataFactory.setRestaurantData(data);	
		});
	}



}]);