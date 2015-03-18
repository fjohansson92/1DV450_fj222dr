describe("RestaurantDirectives", function() {

	var $q, $rootScope, $scope, $timeout;

	beforeEach(module('RestaurantManager'));

	beforeEach(inject(function(_$q_, _$rootScope_, _$timeout_) {
		$q = _$q_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
	}));

	describe("TagsSearcher", function() {

		beforeEach(inject(function ($compile) {
			$scope = $rootScope.$new();

			var element = angular.element("<tags-searcher></tags-searcher>")

			template = $compile(element)($scope);

			controller = element.controller
		}));

		it('template should show error message', function() {
			
			$scope.tagAutocompleteError = "error"
			$scope.$digest();

			var templateAsHtml = template.html();
			expect(templateAsHtml).toContain($scope.tagAutocompleteError);  		
		});

	});
 	
});