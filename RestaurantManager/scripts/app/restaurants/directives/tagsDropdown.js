angular.module('RestaurantManager.Restaurants').directive('tagsSearcher', [  function () {
	return {
		restrict: 'E',
		controller: ['$scope', '$q', '$timeout', 'TagFactory', function($scope, $q, $timeout, TagFactory) {
			var timeout = 0;
			
			$scope.getTags = function(term) {
				
				$scope.tagAutocompleteError = '';
				$timeout.cancel(timeout);
				tagPromise = $q.defer()

				timeout = $timeout(function() {
					TagFactory.get({ term: term, limit: 8 }).$promise.then(function(data) {	
						tagPromise.resolve(data.tags.map(function(item) {
							return item;
						}));
					}, function() {
						$scope.tagAutocompleteError = "Something went wrong.";
					});
				}, 200);
				return tagPromise.promise;
			}
		}],
		template: '<input type="text" data-ng-model="tagAutocomplete" placeholder="Hämta via tag"' +
						 'typeahead="tag as tag.name for tag in getTags($viewValue)" typeahead-loading="loadingLocations" class="form-control">' +
    				'<i ng-show="loadingLocations" class="glyphicon glyphicon-refresh"></i>' +
    				'<p>{{ tagAutocompleteError }}</p>'
	}
}]);
