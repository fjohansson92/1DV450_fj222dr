angular.module('RestaurantManager.Restaurants').controller('SearchCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory', '$location', 
																   function ($scope, RestaurantFactory, RestaurantDataFactory, $location) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();


	$scope.search = function(searchWords) {

		params = {}

		$location.search('search', searchWords).replace();
		$scope.latestSearch = searchWords;
		params.q = searchWords.replace(/\s/g, ' ')

		if ($scope.tagDropdown && $scope.tagDropdown.id) {
			params.tag_id = $scope.tagDropdown.id;
		}

		promise = RestaurantFactory.get(params);
		promise.$promise.then(function(data) {
			RestaurantDataFactory.setRestaurantData(data);	
		});
	}


}]);