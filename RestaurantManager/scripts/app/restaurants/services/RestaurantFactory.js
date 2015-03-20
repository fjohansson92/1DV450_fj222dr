angular.module('RestaurantManager.Restaurants').factory('RestaurantFactory', ['$resource', 'API', 'LoginFactory', function ($resource, $API, LoginFactory) {
	return $resource($API + 'restaurants/:id', {}, {
		'save': {method: 'POST', headers: { user_token: LoginFactory.user.user_token, 
											auth_token: LoginFactory.user.auth_token} },
		'getOwn': {method: 'GET', params: { apiuser_id: LoginFactory.user.apiuser_id }},  
		'put': {method:'PUT', headers: { user_token: LoginFactory.user.user_token, 
							  			 auth_token: LoginFactory.user.auth_token} },
		'remove': {method:'DELETE', headers: { user_token: LoginFactory.user.user_token, 
							  			 	   auth_token: LoginFactory.user.auth_token} }
	});
 }]);