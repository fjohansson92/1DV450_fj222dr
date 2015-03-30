angular.module('RestaurantManager.Restaurants').controller('SearchCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory', '$location', '$routeParams',
																   function ($scope, RestaurantFactory, RestaurantDataFactory, $location, $routeParams) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();
	var latestParams = {};

	var init = function() {
		if ($routeParams.search) {
			$scope.freeSearch($routeParams.search);
		} else if ($routeParams.tag) {
			$scope.tagSearch({ id: $routeParams.tag});
		} else if ($routeParams.user) {
			$scope.userSearch({ id: $routeParams.user});
		}
	}


	var restaurantsSearch = function(params) {
		RestaurantDataFactory.loading();
		$scope.tagError = "";
		$scope.userError = "";

		RestaurantDataFactory.removeRestaurants();
		$location.search('search', null).replace();
		$location.search('tag', null).replace();
		$location.search('user', null).replace();


		promise = RestaurantFactory.get(params);
		promise.$promise.then(function(data) {
			latestParams = params;
			RestaurantDataFactory.setRestaurantData(data);
			RestaurantDataFactory.stopLoading();			
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;
			} 
			RestaurantDataFactory.stopLoading();
		});
	}

	$scope.$on('paginate', function(event, args) {
		if (!$scope.restData.loading ) {
			latestParams.limit = args.limit;
			latestParams.offset = args.offset;
			restaurantsSearch(latestParams);
		}
	});


	$scope.tagSearch = function(tag) {
		if (tag && tag.id) {
			restaurantsSearch({ tag_id: tag.id });
			$location.search('tag', tag.id).replace();
		} else {
			$scope.userError = "";
			$scope.tagError = 'Invalid search. Please select from autocomplete.';
		}
	}

	$scope.$on('tagChange', function(event, args) {
		$scope.tagSearch(args.tag);
	});


	$scope.userSearch = function(user) {
		if (user && user.id) {
			restaurantsSearch({ apiuser_id: user.id });
			$location.search('user', user.id).replace();
		} else {
			$scope.tagError = "";
			$scope.userError = 'Invalid search. Please select from autocomplete.';
		}
	}

	$scope.$on('userChange', function(event, args) {
		$scope.userSearch(args.user);
	});

	$scope.freeSearch = function(searchWords) {
		params = {}
		if (!$scope.restData.loading) {
			if (searchWords) {
				$scope.latestSearch = searchWords;
				params.q = searchWords.replace(/\s/g, ' ');
				restaurantsSearch(params);

				$location.search('search', searchWords).replace();
			} else {
				$scope.tagError = "";
				$scope.userError = "";
			}
		}
	}

	init();
}]);