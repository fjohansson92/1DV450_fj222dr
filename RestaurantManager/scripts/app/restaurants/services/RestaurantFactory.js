angular.module('RestaurantManager.Restaurants').factory('RestaurantFactory', ['$resource', 'API', 'LoginFactory', function ($resource, $API, LoginFactory) {
	return $resource($API + 'restaurants/:id', {}, {
		'save': {method: 'POST', headers: { user_token: LoginFactory.user.user_token, 
											auth_token: LoginFactory.user.auth_token} },  
		'put': {method:'PUT'}
	});
 }]);