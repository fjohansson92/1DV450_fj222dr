describe('RestaurantsCtrl', function() {
	
    var $q, $rootScope, $scope, mockPositionFactory;
    var mockPositionsResponse = { 
    								restaurants: [
    												{"id": 1 , "name": "test1", "latitude": "5.5", "longitude": "3.5"},
    												{"id": 2 , "name": "test2", "latitude": "3.5", "longitude": "4.5"}
    											 ],
    								links: {
												first: "http://api.lvh.me:3001/v...tions?limit=25&offset=0",
												prev: null,
												next: "http://api.lvh.me:3001/v...ions?limit=25&offset=25",
												last: "http://api.lvh.me:3001/v...ons?limit=25&offset=100"
    										}
    							};



	beforeEach(module('RestaurantManager'));

	beforeEach(inject(function(_$q_, _$rootScope_) {
		$q = _$q_;
		$rootScope = _$rootScope_;
	}));

	beforeEach(inject(function ($controller) {
		$scope = $rootScope.$new();

		mockPositionFactory = {
			get: function(parameters) {
				positionDeferred = $q.defer();
				requestParameters = parameters
				return { $promise: positionDeferred.promise};
			}
		}
		spyOn(mockPositionFactory, 'get').andCallThrough();

		mapDeferred = $q.defer();
		uiGmapGoogleMapApi = mapDeferred.promise;

		restaurantsCtrl = $controller('RestaurantsCtrl', { $scope: $scope, PositionFactory: mockPositionFactory, uiGmapGoogleMapApi: uiGmapGoogleMapApi });
	}));



	describe('RestaurantsCtrl Startup', function() {

	    beforeEach(function() {
	    	mapDeferred.resolve();
	    	positionDeferred.resolve(mockPositionsResponse);
	    	$rootScope.$apply();
	    });


		it('should get from RestaurantsFactory', function() {
			expect(mockPositionFactory.get).toHaveBeenCalled();
		});


		it('should set result to scope', function() {
			expect($scope.restaurants).toBe(mockPositionsResponse.restaurants);
		});

		it('should set markers', function() {
			restaurant1 = mockPositionsResponse.restaurants[0];
			restaurant2 = mockPositionsResponse.restaurants[1];

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

	describe('RestaurantsCtrl restaurants get fails', function() {

	    beforeEach(function() {
	    	mapDeferred.resolve();
	    	positionDeferred.reject({ data: {userMessage: "error"} });
	    	$rootScope.$apply();
	    });

		it('should set error message', function() {
			expect($scope.errorMessage).toBe("error");
		});
	});

	describe('Google map fails', function() {

	    beforeEach(function() {
	    	mapDeferred.reject({});
	    	positionDeferred.resolve(mockPositionsResponse);
	    	$rootScope.$apply();
	    });

		it('should set error message', function() {
			expect($scope.errorMessage).toBe("Fail to load google maps. Please try again");
		});
	});






	describe('RestaurantsCtrl map watch', function() {

	    beforeEach(function() {
	    	mapDeferred.resolve();
	    	$rootScope.$apply();

	    	$scope.loading = false;
			$scope.map = {
							zoom: 3,
							center: {
										latitude: 5,
										longitude: 10	
							},
							bounds: {
										northeast: {
														latitude: 65,
														longitude: 97
													},
										southwest: {
														latitude: -56,
														longitude: -106
													}
									}
						};
			$rootScope.$apply();

			positionDeferred.resolve(mockPositionsResponse);
	    	$rootScope.$apply();
	    });


		it('should get from RestaurantsFactory', function() {

			expect(mockPositionFactory.get).toHaveBeenCalled();
		});

		it('should set markers', function() {
			restaurant1 = mockPositionsResponse.restaurants[0];
			restaurant2 = mockPositionsResponse.restaurants[1];

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

		it('should set pagination urls', function() {
			expect(angular.equals($scope.firstUrl, mockPositionsResponse.links.first.split('?')[1])).toBe(true);
			expect(angular.equals($scope.nextUrl, mockPositionsResponse.links.next.split('?')[1])).toBe(true);
			expect(angular.equals($scope.prevUrl, "")).toBe(true);
			expect(angular.equals($scope.lastUrl, mockPositionsResponse.links.last.split('?')[1])).toBe(true);
		});

		it('should be able to next paginate', function() {
			$scope.loading = false;
			$scope.paginate($scope.nextUrl);
			$rootScope.$apply();

			positionDeferred.resolve(mockPositionsResponse);
	    	$rootScope.$apply();

			expect(angular.equals({offset: requestParameters.offset, limit: requestParameters.limit}, {offset: '25', limit: '25'})).toBe(true);
		});

		it('should be able to last paginate', function() {
			$scope.loading = false;
			$scope.paginate($scope.lastUrl);
			$rootScope.$apply();

			positionDeferred.resolve(mockPositionsResponse);
	    	$rootScope.$apply();

			expect(angular.equals({offset: requestParameters.offset, limit: requestParameters.limit}, {offset: '100', limit: '25'})).toBe(true);
		});
	});

	
	describe('Positionfactory.get fails', function() {

	    beforeEach(function() {
	    	mapDeferred.resolve();
	    	$rootScope.$apply();

	    	$scope.loading = false;
			$scope.map = {
							zoom: 3,
							center: {
										latitude: 5,
										longitude: 10	
							},
							bounds: {
										northeast: {
														latitude: 65,
														longitude: 97
													},
										southwest: {
														latitude: -56,
														longitude: -106
													}
									}
						};
			$rootScope.$apply();
	    	positionDeferred.reject({ data: {userMessage: "error"} });
	    	$rootScope.$apply();
	    });

		it('should set error message', function() {
			expect($scope.errorMessage).toBe("error");
		});
	});




	describe('paginate after startup', function() {

	    beforeEach(function() {
	    	mapDeferred.resolve();
			positionDeferred.resolve(mockPositionsResponse);
	    	$rootScope.$apply();
	    });

		it('should get from RestaurantsFactory', function() {

			$scope.loading = false;
			$scope.paginate($scope.nextUrl);
			$rootScope.$apply();

			positionDeferred.resolve(mockPositionsResponse);
	    	$rootScope.$apply();

			expect(angular.equals({offset: requestParameters.offset, limit: requestParameters.limit}, {offset: '25', limit: '25'})).toBe(true);
		});
	});
});