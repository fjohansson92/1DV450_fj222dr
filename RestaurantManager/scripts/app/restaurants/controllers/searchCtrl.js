angular.module('RestaurantManager.Restaurants').controller('SearchCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory', '$location', 
																   function ($scope, RestaurantFactory, RestaurantDataFactory, $location) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();

	var restaurantsSearch = function(params) {
		promise = RestaurantFactory.get(params);
		promise.$promise.then(function(data) {
			RestaurantDataFactory.setRestaurantData(data);	
		});
	}


	$scope.tagSearch = function(tag) {
		if (tag && tag.id) {
			restaurantsSearch({ tag_id: tag.id });
		} else {
			$scope.tagSearchError = 'Fel';
		}
	}
	$scope.userSearch = function(user) {
		if (user && user.id) {
			restaurantsSearch({ apiuser_id: user.id });
		} else {
			$scope.tagSearchError = 'Fel';
		}
	}



	$scope.freeSearch = function(searchWords) {
		params = {}
		if (searchWords) {
			$location.search('search', searchWords).replace();
			$scope.latestSearch = searchWords;
			params.q = searchWords.replace(/\s/g, ' ');
			restaurantsSearch(params);
		}
	}





}]);