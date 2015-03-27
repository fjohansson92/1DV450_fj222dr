angular.module('RestaurantManager.Restaurants').controller('CreatedCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory',
																   function ($scope, RestaurantFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();
	RestaurantDataFactory.setOwnRestaurants();

	ownRestaurants = RestaurantFactory.getOwn();
	ownRestaurants.$promise.then(function(data) {
		RestaurantDataFactory.setRestaurantData(data);			
	}, function(reason) {
		if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
			RestaurantDataFactory.setErrorMessage(reason.data.userMessage);
		} 
	});

	$scope.$on('removeRestaurant', function(event, restaurant) {
		
		ownRestaurant = RestaurantFactory.remove({id: restaurant.id});
		ownRestaurant.$promise.then(function(data) {

			RestaurantDataFactory.removeRestaurant(restaurant.id)
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				RestaurantDataFactory.setErrorMessage(reason.data.userMessage);

				if (reason.data.errorCode == '1401') {
					$scope.$emit('userNotValid');
				}
			} 
		});
	});


}]);															