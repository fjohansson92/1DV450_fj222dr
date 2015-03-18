angular.module('RestaurantManager.Restaurants').factory('UserFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'apiusers/:id', {}, {});
 }]);