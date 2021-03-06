angular.module('RestaurantManager.Restaurants').controller('CreatedCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory',
																   function ($scope, RestaurantFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();
	RestaurantDataFactory.setOwnRestaurants();

	var getOwnRestaurants = function(params) {
		RestaurantDataFactory.loading();
		ownRestaurants = RestaurantFactory.getOwn(params);
		ownRestaurants.$promise.then(function(data) {
			RestaurantDataFactory.setRestaurantData(data);
			RestaurantDataFactory.stopLoading();
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;
			} 
			RestaurantDataFactory.stopLoading();
		});
	}
	getOwnRestaurants();

	$scope.$on('removeRestaurant', function(event, restaurant) {
		RestaurantDataFactory.loading();
		ownRestaurant = RestaurantFactory.remove({id: restaurant.id});
		ownRestaurant.$promise.then(function(data) {

			RestaurantDataFactory.removeRestaurant(restaurant.id)
			RestaurantDataFactory.stopLoading();
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;

				if (reason.data.errorCode == '1401') {
					$scope.$emit('userNotValid');
				}
			}
			RestaurantDataFactory.stopLoading(); 
		});
	});

	$scope.$on('paginate', function(event, args) {
		if (!$scope.restData.loading ) {
			getOwnRestaurants(args);
		}
	});

}]);															