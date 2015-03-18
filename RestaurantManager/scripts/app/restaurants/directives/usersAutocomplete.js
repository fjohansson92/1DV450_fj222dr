angular.module('RestaurantManager.Restaurants').directive('usersAutocomplete', [  function () {
	return {
		restrict: 'E',
		controller: ['$scope', 'AutocompleteFactory', function($scope, AutocompleteFactory) {
			$scope.getUsers = function(term) {
				promise = AutocompleteFactory.users(term);
				return promise;
			}
		}],
		template: '<input type="text" data-ng-model="userAutocomplete" placeholder="Hämta via användare"' +
						 'typeahead="user as user.name for user in getUsers($viewValue)" typeahead-loading="userloadingLocations" class="form-control">' +
    				'<i ng-show="userloadingLocations" class="glyphicon glyphicon-refresh"></i>' +
    				'<p>{{ userAutocompleteError }}</p>'
    }
}]);
