angular.module('RestaurantManager.Restaurants').controller('CreateCtrl', ['$scope', '$q','$routeParams', 'RestaurantFactory', 'RestaurantDataFactory',
																   function ($scope, $q, $routeParams, RestaurantFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.removeRestaurants();
	RestaurantDataFactory.addSelectMarker();
	$scope.newTags = [];
	$scope.restaurant = {};
	var original = $scope.restaurant;

	var ownRestaurant;
	var edit = false;

	if ($routeParams.id) {
		edit = true;
		ownRestaurant = RestaurantFactory.get({id: $routeParams.id}).$promise;
		ownRestaurant.then(function(data) {
			$scope.restaurant = data.restaurant;
			for (var key in data.restaurant.tags) {
				tag = data.restaurant.tags[key]
				$scope.newTags.push(tag["name"]);
			}
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				RestaurantDataFactory.setErrorMessage(reason.data.userMessage);
			} 
		});
	} else {
		ownRestaurant = $scope.defer();
		ownRestaurant.reolve();
	}





	$scope.addTag = function(tag) {
		if (tag) {
			if (tag.name) {
				tag = tag.name;
			}
			if ($scope.newTags.indexOf(tag) < 0) {
				$scope.newTags.push(tag); 
			}
			$scope.tagAutocomplete = '';
		}
	};

	$scope.removeTag = function(tag) {
		var index = $scope.newTags.indexOf(tag);
		$scope.newTags.splice(index, 1);
	}

	$scope.submit = function() {
		
		ownRestaurant.then(function() {
			restaurant = $scope.restaurant;
			restaurant.latitude = $scope.restData.selectmarker.coords.latitude;
			restaurant.longitude = $scope.restData.selectmarker.coords.longitude;
			restaurant.tags_attributes = [];
			for (var key in $scope.newTags) {
				tag = $scope.newTags[key]

				restaurant.tags_attributes.push({
					name: tag				
				});
			}

			var restaurantPost;
			if (edit) {
				restaurantPost = RestaurantFactory.put({ id: restaurant.id},{ restaurant: restaurant });
				
			} else {
				restaurantPost = RestaurantFactory.save({ restaurant: restaurant });
			}

			restaurantPost.$promise.then(function(data) {
				if (!edit) {
					$scope.newTags = [];
					$scope.restaurant = angular.copy(original);
					$scope.restForm.$setUntouched();
				}
			}, function(reason) {
				if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
					RestaurantDataFactory.setErrorMessage(reason.data.userMessage);
				} 
			});
		});

	}

}]);
