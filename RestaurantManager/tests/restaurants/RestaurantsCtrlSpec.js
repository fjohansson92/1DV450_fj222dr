describe('RestaurantsCtrl', function() {
	
    var $q, $rootScope, $scope, mockRestaurantsFactory;
    var mockRestaurantsResponse = { restaurants: [{"name": "test"}] };

	beforeEach(module('RestaurantManager'));

	beforeEach(inject(function(_$q_, _$rootScope_) {
		$q = _$q_;
		$rootScope = _$rootScope_;
	}));

	beforeEach(inject(function ($controller) {
		$scope = $rootScope.$new();

		mockRestaurantsFactory = {
			get: function() {
				deferred = $q.defer();
				return { $promise: deferred.promise};
			}
		}

		spyOn(mockRestaurantsFactory, 'get').andCallThrough();

		restaurantsCtrl = $controller('RestaurantsCtrl', { $scope: $scope, RestaurantFactory: mockRestaurantsFactory });
	}));



	describe('RestaurantsCtrl.get', function() {

	    beforeEach(function() {
	    	deferred.resolve(mockRestaurantsResponse);
	    	$rootScope.$apply();
	    });


		it('should get from RestaurantsFactory', function() {
			expect(mockRestaurantsFactory.get).toHaveBeenCalled();
		});


		it('should set result to scope', function() {
			expect($scope.restaurants).toBe(mockRestaurantsResponse.restaurants);
		});
	});



});