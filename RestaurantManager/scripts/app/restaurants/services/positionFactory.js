angular.module('RestaurantManager.Restaurants').factory('PositionFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'positions', {}, {});
 }]);