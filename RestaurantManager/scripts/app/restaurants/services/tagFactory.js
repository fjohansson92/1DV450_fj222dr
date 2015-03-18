angular.module('RestaurantManager.Restaurants').factory('TagFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'tags/:id', {}, {});
 }]);