angular.module('RestaurantManager.Restaurants').controller('SearchCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory', '$location', '$routeParams',
																   function ($scope, RestaurantFactory, RestaurantDataFactory, $location, $routeParams) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();


	var init = function() {
		if ($routeParams.search) {
			$scope.freeSearch($routeParams.search);
		} else if ($routeParams.tag) {
			$scope.tagSearch({ id: $routeParams.tag});
		} else if ($routeParams.user) {
			$scope.tagSearch({ id: $routeParams.user});
		}
	}


	var restaurantsSearch = function(params) {
		$scope.searchError = "";
		RestaurantDataFactory.removeRestaurants();
		$location.search('search', null).replace();
		$location.search('tag', null).replace();
		$location.search('user', null).replace();


		promise = RestaurantFactory.get(params);
		promise.$promise.then(function(data) {
			RestaurantDataFactory.setRestaurantData(data);			
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				RestaurantDataFactory.setErrorMessage(reason.data.userMessage);
			} 
		});
	}


	$scope.tagSearch = function(tag) {
		if (tag && tag.id) {
			restaurantsSearch({ tag_id: tag.id });
			$location.search('tag', tag.id).replace();
		} else {
			$scope.searchError = 'Unvalid search. Please select from autocomplete.';
		}
	}
	$scope.userSearch = function(user) {
		if (user && user.id) {
			restaurantsSearch({ apiuser_id: user.id });
			$location.search('user', user.id).replace();
		} else {
			$scope.searchError = 'Unvalid search. Please select from autocomplete.';
		}
	}

	$scope.freeSearch = function(searchWords) {
		params = {}
		if (searchWords) {
			$scope.latestSearch = searchWords;
			params.q = searchWords.replace(/\s/g, ' ');
			restaurantsSearch(params);

			$location.search('search', searchWords).replace();
		} else {
			$scope.searchError = "";
		}
	}

	init();
}]);