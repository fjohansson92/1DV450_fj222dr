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


}]);															