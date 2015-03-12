describe('RestaurantsCtrl', function() {
	
    var $q, $rootScope, $scope, mockRestaurantsFactory;
    var mockRestaurantsResponse = { restaurants: [
    												{"id": 1 , "name": "test1", "latitude": "5.5", "longitude": "3.5"},
    												{"id": 2 , "name": "test2", "latitude": "3.5", "longitude": "4.5"}
    											 ] };

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

		mapDeferred = $q.defer();
		uiGmapGoogleMapApi = mapDeferred.promise;

		restaurantsCtrl = $controller('RestaurantsCtrl', { $scope: $scope, RestaurantFactory: mockRestaurantsFactory, uiGmapGoogleMapApi: uiGmapGoogleMapApi });
	}));



	describe('RestaurantsCtrl.get', function() {

	    beforeEach(function() {
	    	mapDeferred.resolve();
	    	deferred.resolve(mockRestaurantsResponse);
	    	$rootScope.$apply();
	    });


		it('should get from RestaurantsFactory', function() {
			expect(mockRestaurantsFactory.get).toHaveBeenCalled();
		});


		it('should set result to scope', function() {
			expect($scope.restaurants).toBe(mockRestaurantsResponse.restaurants);
		});

		it('should set markers', function() {
			restaurant1 = mockRestaurantsResponse.restaurants[0];
			restaurant2 = mockRestaurantsResponse.restaurants[1];

			expect(angular.equals($scope.restaurantmarkers[0], {
																	title: restaurant1.name,
																	id: parseInt(restaurant1.id),
														            latitude: restaurant1.latitude,
														            longitude: restaurant1.longitude
														        })).toBe(true);
			expect(angular.equals($scope.restaurantmarkers[1], {
																	title: restaurant2.name,
																	id: parseInt(restaurant2.id),
														            latitude: restaurant2.latitude,
														            longitude: restaurant2.longitude
														        })).toBe(true);
		});
	});

	describe('RestaurantsCtrl.get fails', function() {

	    beforeEach(function() {
	    	mapDeferred.resolve();
	    	deferred.reject({ data: {userMessage: "error"} });
	    	$rootScope.$apply();
	    });

		it('should set error message', function() {
			expect($scope.errorMessage).toBe("error");
		});
	});

	describe('Google map fails', function() {

	    beforeEach(function() {
	    	mapDeferred.reject({});
	    	deferred.resolve(mockRestaurantsResponse);
	    	$rootScope.$apply();
	    });

		it('should set error message', function() {
			expect($scope.errorMessage).toBe("Fail to load google maps. Please try again");
		});
	});


});