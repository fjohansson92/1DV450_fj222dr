describe('All restaurantcontrollers', function() {

	var $q, $rootScope, $scope, $timeout, eventEmitted;

	beforeEach(module('RestaurantManager'));

	beforeEach(inject(function(_$q_, _$rootScope_, _$timeout_) {
		$q = _$q_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;
	}));


	describe('RestaurantCtrl', function() {

		beforeEach(inject(function ($controller) {
			$scope = $rootScope.$new();

			spyOn($scope, '$broadcast').andCallThrough();	

			eventEmitted = false;
			$scope.$on("paginate", function() {
			   eventEmitted = true;
			});

			restaurantsData = {
				map: {  control: {},
						center: {},  
						zoom: 3,
						changer: false,
						waitForRefresh: true,  
						bounds: {	northeast: { latitude: 68, longitude: 100 },	
									southwest: { latitude: -29,	longitude: -91 }}
				}
			}

			mockRestaurantDataFactory = {
				restaurantsData: restaurantsData,
				resolveGmap: function() {},
				rejectGmap: function() {},
				resolveGmapApi: function() {},
				rejectGmapApi: function() {}
			}

			spyOn(mockRestaurantDataFactory, 'resolveGmap').andCallThrough();
			spyOn(mockRestaurantDataFactory, 'rejectGmap').andCallThrough();
			spyOn(mockRestaurantDataFactory, 'resolveGmapApi').andCallThrough();
			spyOn(mockRestaurantDataFactory, 'rejectGmapApi').andCallThrough();


			mapDeferred = $q.defer()
			mockuiGmap = {
				promise: function() {
					return mapDeferred.promise
				}
			};

			mapApiDeferred = $q.defer();
			mockuiGmapApi = mapApiDeferred.promise;

			$route = { current: { $$route: { segment: 's1' }}};

			mockLocation = {
				search: function (name, value) {
					return {
						replace: function() {}
					}
				}
			}
			spyOn(mockLocation, 'search').andCallThrough();

			routeSegment = {};

			positionCtrl = $controller('RestaurantCtrl', { 	$scope: $scope,
															$route: $route,
															$location: mockLocation,
															$routeSegment: routeSegment,
															RestaurantDataFactory: mockRestaurantDataFactory, 
															uiGmapIsReady: mockuiGmap, 
															uiGmapGoogleMapApi: mockuiGmapApi });
		}));

		it('should use RestaurantsFactory on startup', function() {
			expect($scope.restData).toBe(restaurantsData);
		});	

		it('should resolve when map is ready', function() {
			mapDeferred.resolve();
			$rootScope.$apply();

			expect(mockRestaurantDataFactory.resolveGmap).toHaveBeenCalled();
		});

		it('should reject when map fails', function() {
			mapDeferred.reject();
			$rootScope.$apply();

			expect(mockRestaurantDataFactory.rejectGmap).toHaveBeenCalled();
		});

		it('should resolve when mapApi is ready', function() {
			mapApiDeferred.resolve();
			$rootScope.$apply();

			expect(mockRestaurantDataFactory.resolveGmapApi).toHaveBeenCalled();
		});

		it('should reject when mapApi fails', function() {
			mapApiDeferred.reject();
			$rootScope.$apply();

			expect(mockRestaurantDataFactory.rejectGmapApi).toHaveBeenCalled();
		});


		it('should update cords, zoom in url and broadcast mapChange', function() {

			latitude = 5.3;
			longitude = 4.2;
			zoom = 5;

			restaurantsData.map = { center: { latitude: latitude, 
											  longitude: longitude },  
									zoom: zoom }
			$rootScope.$apply();		

			expect(mockLocation.search).toHaveBeenCalledWith('latitude', latitude);
			expect(mockLocation.search).toHaveBeenCalledWith('longitude', longitude);
			expect(mockLocation.search).toHaveBeenCalledWith('zoom', zoom);

			expect($scope.$broadcast).toHaveBeenCalledWith('mapChange', {newVal: { center: {latitude: latitude, longitude: longitude}, zoom: zoom}, 
																		 oldVal: { center: {latitude: latitude, longitude: longitude}, zoom: zoom}});
		});

		it('paginate should broadcast', function() {

			$scope.paginate('limit=5&offset=3');
			$rootScope.$apply();

			expect(eventEmitted).toBe(true);													
		});
	});


	describe('SearchCtrl', function() {

		beforeEach(inject(function ($controller) {
			$scope = $rootScope.$new();

			restaurantsData = {
				map: {  control: {},
						center: {},  
						zoom: 3,
						changer: false,
						waitForRefresh: true,  
						bounds: {	northeast: { latitude: 68, longitude: 100 },	
									southwest: { latitude: -29,	longitude: -91 }}
				}
			}

			mockRestaurantDataFactory = {
				restaurantsData: restaurantsData,
				updateMapFromRoutes: function() {},
				removeRestaurants: function() {}
			}

			spyOn(mockRestaurantDataFactory, 'updateMapFromRoutes').andCallThrough();
			spyOn(mockRestaurantDataFactory, 'removeRestaurants').andCallThrough();

			mockLocation = {
				search: function (name, value) {
					return {
						replace: function() {}
					}
				}
			}
			spyOn(mockLocation, 'search').andCallThrough();

			positionCtrl = $controller('SearchCtrl', { 	$scope: $scope,
															$location: mockLocation,
															RestaurantDataFactory: mockRestaurantDataFactory
														 });
		}));

		it('should use RestaurantsFactory on startup', function() {
			expect($scope.restData).toBe(restaurantsData);
			expect(mockRestaurantDataFactory.updateMapFromRoutes).toHaveBeenCalled();
			expect(mockRestaurantDataFactory.removeRestaurants).toHaveBeenCalled();
		});	



	});











	describe('PositionCtrl', function() {

		var mockPositionFactory, restaurantsData, mockRestaurantDataFactory;

		describe('Default startup', function() {

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


				restaurantsData = {
					map: {  control: {},  
							zoom: 3,
							changer: false,
							waitForRefresh: true,  
							bounds: {	northeast: { latitude: 68, longitude: 100 },	
										southwest: { latitude: -29,	longitude: -91 }}
					},
				}

				mockRestaurantDataFactory = {
					restaurantsData: restaurantsData,				
					updateMapFromRoutes: function() {},
					loading: function() {},
					setRestaurantData: function() {},
					refreshMap: function() {},
					stopLoading: function() {},
					setErrorMessage: function() {},
					removeRestaurants: function() {}
				}
				spyOn(mockRestaurantDataFactory, 'updateMapFromRoutes').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'loading').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'setRestaurantData').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'refreshMap').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'stopLoading').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'setErrorMessage').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'removeRestaurants').andCallThrough();

				positionCtrl = $controller('PositionCtrl', { $scope: $scope, PositionFactory: mockPositionFactory, RestaurantDataFactory: mockRestaurantDataFactory });
			}));

			it('should use RestaurantsFactory on startup', function() {

				expect($scope.restData).toBe(restaurantsData);
				expect(mockRestaurantDataFactory.updateMapFromRoutes).toHaveBeenCalled();
			});		

			it('should use get restaurants on startup', function() {
				expect(mockPositionFactory.get).toHaveBeenCalled();
			});	

			it('should call with right parameters on startup', function() {

				expect(angular.equals(requestParameters, { lat_top: 	restaurantsData.map.bounds.northeast.latitude,
														   lat_bottom: 	restaurantsData.map.bounds.southwest.latitude,
														   lng_right: 	restaurantsData.map.bounds.northeast.longitude,
														   lng_left: 	restaurantsData.map.bounds.southwest.longitude	})).toBe(true);
			});	

			it('should set RestaurantsData after Positionfactory get', function() {

				positionDeferred.resolve({test: "test"});
				$rootScope.$apply();

				expect(mockRestaurantDataFactory.setRestaurantData).toHaveBeenCalled();
				expect(mockRestaurantDataFactory.refreshMap).toHaveBeenCalled();
				$timeout.flush();
				expect(mockRestaurantDataFactory.stopLoading).toHaveBeenCalled();
			});


			it('should set errormessage if RestaurantsData get fails', function() {

				positionDeferred.reject({ data: {userMessage: "error"} });
				$rootScope.$apply();

				expect(mockRestaurantDataFactory.setErrorMessage).toHaveBeenCalled();	
			});

		});


		describe('Startup with parameters', function() {

			var newVal, oldVal, requestParameters;

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


				restaurantsData = {
					loading: false,
					cordsInParams: true,
					map: {  control: {}, 
							center: {}, 
							zoom: 3,
							waitForRefresh: true,
							changer: false,
							waitForRefresh: true,  
							bounds: {	northeast: { latitude: 68, longitude: 100 },	
										southwest: { latitude: -29,	longitude: -91 }}
					},
				}

				mockRestaurantDataFactory = {
					restaurantsData: restaurantsData,				
					updateMapFromRoutes: function() {},
					loading: function() {},
					setRestaurantData: function() {},
					refreshMap: function() {},
					stopLoading: function() {},
					removeRestaurants: function() {}
				}
				spyOn(mockRestaurantDataFactory, 'updateMapFromRoutes').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'loading').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'setRestaurantData').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'refreshMap').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'stopLoading').andCallThrough();
				spyOn(mockRestaurantDataFactory, 'removeRestaurants').andCallThrough();

				newVal = { control: {}, 
								center: { latitude: 50, longitude: 60 }, 
								zoom: 3,
								bounds: {	northeast: { latitude: 30, longitude: 100 },	
											southwest: { latitude: 20,	longitude: 0 }}
				}
				oldVal = { zoom: 10 }


				positionCtrl = $controller('PositionCtrl', { $scope: $scope, PositionFactory: mockPositionFactory, RestaurantDataFactory: mockRestaurantDataFactory });
			}));


			it('should not use RestaurantsFactory on startup', function() {

				expect(mockPositionFactory.get.callCount).toBe(0);
			});

			it('should use RestaurantsFactory on correct refresh', function() {
				restaurantsData.map.waitForRefresh = false;
				restaurantsData.map.center.latitude = 50;
				$rootScope.$apply();

				expect(mockPositionFactory.get).toHaveBeenCalled();
			});	

			it('mapChange should not use RestaurantsFactory before startup', function() {

				expect(mockPositionFactory.get.callCount).toBe(0);

				$scope.$broadcast('mapChange', {newVal: newVal, oldVal: oldVal});

				expect(mockPositionFactory.get.callCount).toBe(0);
			});

			it('mapChange should use RestaurantsFactory after startup', function() {

				restaurantsData.map.waitForRefresh = false;
				restaurantsData.map.center.latitude = 50;
				$rootScope.$apply();

				expect(mockPositionFactory.get).toHaveBeenCalled();

				$scope.$broadcast('mapChange', {newVal: newVal, oldVal: oldVal});

				expect(mockPositionFactory.get.callCount).toBe(2);
			});




			it('paginate should not use RestaurantsFactory before startup', function() {

				expect(mockPositionFactory.get.callCount).toBe(0);

				$scope.$broadcast('paginate', {parameters: {param1: 'test'}});

				expect(mockPositionFactory.get.callCount).toBe(0);
			});

			it('paginate should use RestaurantsFactory after startup', function() {

				restaurantsData.map.waitForRefresh = false;
				restaurantsData.map.center.latitude = 50;
				$rootScope.$apply();

				expect(mockPositionFactory.get).toHaveBeenCalled();

				$scope.$broadcast('paginate', {param1: 'test'});

				expect(mockPositionFactory.get.callCount).toBe(2);

				expect(angular.equals(requestParameters, { param1: 'test',
														   lat_top: 	restaurantsData.map.bounds.northeast.latitude,
														   lat_bottom: restaurantsData.map.bounds.southwest.latitude,
														   lng_right: 	restaurantsData.map.bounds.northeast.longitude,
														   lng_left: 	restaurantsData.map.bounds.southwest.longitude	})).toBe(true);
			});

			it('paginate should not use RestaurantsFactory if loading', function() {

				restaurantsData.map.waitForRefresh = false;
				restaurantsData.map.center.latitude = 50;
				$rootScope.$apply();

				expect(mockPositionFactory.get).toHaveBeenCalled();

				restaurantsData.loading = true;
				$rootScope.$apply();

				$scope.$broadcast('paginate', {param1: 'test'});

				expect(mockPositionFactory.get.callCount).toBe(1);
			});


		});
	});
});


