angular.module('RestaurantManager.Restaurants').directive('tagsAutocomplete', [  function () {
	return {
		restrict: 'E',
		controller: ['$scope', 'AutocompleteFactory', function($scope, AutocompleteFactory) {
			$scope.getTags = function(term) {
				promise = AutocompleteFactory.tags(term);
				return promise;
			}
		}],
		template: '<input type="text" data-ng-model="tagAutocomplete" placeholder="Ange tag"' +
						 'typeahead="tag as tag.name for tag in getTags($viewValue)" typeahead-loading="tagloadingLocations" class="form-control">' +
    				'<i ng-show="tagloadingLocations" class="glyphicon glyphicon-refresh"></i>' +
    				'<p>{{ tagAutocompleteError }}</p>'
	}
}]);
