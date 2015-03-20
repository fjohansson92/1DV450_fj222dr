angular.module('RestaurantManager.Restaurants').controller('RestaurantCtrl', ['$scope', '$route', '$location', 'RestaurantDataFactory', 'uiGmapIsReady', 'uiGmapGoogleMapApi',
																   function ($scope, $route, $location, RestaurantDataFactory, uiGmapIsReady, uiGmapGoogleMapApi) {

	$scope.restData = RestaurantDataFactory.restaurantsData;

	uiGmapIsReady.promise().then(function(data){
		RestaurantDataFactory.resolveGmap();
	}, function(reason) {
		RestaurantDataFactory.rejectGmap();
	});

	uiGmapGoogleMapApi.then(function(data){
		RestaurantDataFactory.resolveGmapApi();
	
	}, function(reason) {
		RestaurantDataFactory.rejectGmapApi();
	});

	$scope.$watch('restData.map', function(newVal, oldVal) {
		$location.search('latitude', newVal.center.latitude).replace();
		$location.search('longitude', newVal.center.longitude).replace();
		$location.search('zoom', newVal.zoom).replace();
		$scope.$broadcast('mapChange', {newVal: newVal, oldVal: oldVal});
	}, true);

	$scope.remove = function(id) {
		$scope.$broadcast('removeRestaurant', {id: id});
	}


	$scope.paginate = function(url) {
		urlParams = url.split('&');
		params = {};
		
		for (var i in urlParams ) {
			param = urlParams[i].split('=');
			params[param[0]] = param[1];
		}

		$scope.$broadcast('paginate', params);
	}



	var lastRoute = $route.current;
 	$scope.$on('$locationChangeSuccess', function(event) {
		if ($route.current.$$route.segment == lastRoute.$$route.segment) {
			$route.current = lastRoute;
		} else {
			lastRoute = $route.current;
		}
		           
	});

}]);