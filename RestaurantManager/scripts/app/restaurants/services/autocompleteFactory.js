angular.module('RestaurantManager.Restaurants').factory('AutocompleteFactory', [ '$q', '$timeout', 'TagFactory', 'UserFactory', function ($q, $timeout, TagFactory, UserFactory) {
	
	var timeout = 0;

	var autocomplete = function(factory, term, attr) {
		$timeout.cancel(timeout);
		defer = $q.defer()

		timeout = $timeout(function() {
			data = factory.get({ term: term, limit: 8 });
			data.$promise.then(function(data) {	
				defer.resolve(data[attr].map(function(item) {
					return item;
				}));
			}, function() {
				defer.reject();
			});
		}, 200);
		return defer.promise;
	}

	return {
		tags: function(term) {
			return autocomplete(TagFactory, term, 'tags');
		},
		users: function(term) {
			return autocomplete(UserFactory, term, 'apiusers');	
		}

	}	
}]);