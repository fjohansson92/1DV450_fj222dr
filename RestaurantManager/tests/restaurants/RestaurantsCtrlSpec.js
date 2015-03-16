describe('RestaurantsCtrl', function() {
	
    var $q, $rootScope, $scope, mockPositionFactory, uiGmapIsReady, routeParams, mockLocation;
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


	describe('Without routeParams Startup', function() {

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


			it('should get from Positionfactory', function() {
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



	describe('RestaurantsCtrl Startup With Cords', function() {

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

			mapApiDeferred = $q.defer();
			uiGmapGoogleMapApi = mapApiDeferred.promise;


			routeParams = {
				latitude: '35.5',
				longitude: '35.5',
				zoom: '5'
			}
			
			uiGmapIsReady = {
				promise: function() {
					uiGmapIsReady = $q.defer();
					return uiGmapIsReady.promise
				}
			};
			
			mockLocation = {
				search: function (name, value) {

				}
			}
			spyOn(mockLocation, 'search').andCallThrough();

			restaurantsCtrl = $controller('RestaurantsCtrl', { $scope: $scope, 
															   PositionFactory: mockPositionFactory, 
															   uiGmapIsReady: uiGmapIsReady, 
															   uiGmapGoogleMapApi: uiGmapGoogleMapApi, 
															   $routeParams: routeParams,
															   $location: mockLocation });
		}));

		describe('Success', function() {
	
			beforeEach(function() {
				$scope.map.control =  { refresh: function() { return null }}
				spyOn($scope.map.control, 'refresh').andCallThrough();

				uiGmapIsReady.resolve();
				$rootScope.$apply();						
			});


			it('should refresh map', function() {
				expect($scope.map.control.refresh).toHaveBeenCalled();
			});


			describe('Check scope values', function() {

				beforeEach(function() {
					$scope.map = {
								center: { latitude: parseFloat(routeParams.latitude), longitude: parseFloat(routeParams.longitude) }, 
								zoom: parseInt(routeParams.zoom),
								bounds: {	northeast: { latitude: 75, longitude: 158 },	
											southwest: { latitude: -39,	longitude: -88 }}
					};
					$rootScope.$apply();		
				});

				it('should update cords and zoom in url', function() {
					
					expect(mockLocation.search).toHaveBeenCalledWith('latitude', parseFloat(routeParams.latitude));
					expect(mockLocation.search).toHaveBeenCalledWith('longitude', parseFloat(routeParams.longitude));
					expect(mockLocation.search).toHaveBeenCalledWith('zoom', parseFloat(routeParams.zoom));
				});


				it('should get from Positionfactory', function() {
					expect(mockPositionFactory.get).toHaveBeenCalled();
				});
			});




			describe('Check when params is close to default values', function() {		

				beforeEach(function() {
					$scope.map = {
								center: { latitude: 45.0, longitude: 16.0 }, 
								zoom: parseInt(routeParams.zoom),
								bounds: {	northeast: { latitude: 68, longitude: 100 },	
											southwest: { latitude: -29,	longitude: -91 }}
					};
					$rootScope.$apply();		
				});
				
				it('should get from Positionfactory', function() {
					expect(mockPositionFactory.get).toHaveBeenCalled();
				});
			});
		});
		
		describe('Fail', function() {
	
			beforeEach(function() {
				$scope.map.control =  { refresh: function() { return null }}
				spyOn($scope.map.control, 'refresh').andCallThrough();
				uiGmapIsReady.reject({});
				$rootScope.$apply();						
			});


			it('should refresh map', function() {
				expect($scope.errorMessage).toBe("Fail to load google maps. Please try again");
			});
		});	
	});




	describe('RestaurantsCtrl Startup With Bad Cords', function() {

		describe('RestaurantsCtrl Startup With Bad latitude', function() {

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

				mapApiDeferred = $q.defer();
				uiGmapGoogleMapApi = mapApiDeferred.promise;


				routeParams = {
					latitude: 'bad',
					longitude: '35.5',
					zoom: '5'
				}

				restaurantsCtrl = $controller('RestaurantsCtrl', { $scope: $scope, 
																   PositionFactory: mockPositionFactory, 
																   uiGmapIsReady: uiGmapIsReady, 
																   uiGmapGoogleMapApi: uiGmapGoogleMapApi, 
																   $routeParams: routeParams
																  });
			}));

			it('should refresh map', function() {
				expect(mockPositionFactory.get).toHaveBeenCalled();
			});
		});


		describe('RestaurantsCtrl Startup With Bad longitude', function() {

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

				mapApiDeferred = $q.defer();
				uiGmapGoogleMapApi = mapApiDeferred.promise;


				routeParams = {
					latitude: '40',
					longitude: 'bad',
					zoom: '5'
				}

				restaurantsCtrl = $controller('RestaurantsCtrl', { $scope: $scope, 
																   PositionFactory: mockPositionFactory, 
																   uiGmapIsReady: uiGmapIsReady, 
																   uiGmapGoogleMapApi: uiGmapGoogleMapApi, 
																   $routeParams: routeParams
																});
			}));

			it('should refresh map', function() {
				expect(mockPositionFactory.get).toHaveBeenCalled();
			});
		});

		describe('RestaurantsCtrl Startup With Bad zoom', function() {

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

				mapApiDeferred = $q.defer();
				uiGmapGoogleMapApi = mapApiDeferred.promise;


				routeParams = {
					latitude: '40',
					longitude: '40',
					zoom: 'bad'
				}

				uiGmapIsReady = {
					promise: function() {
						uiGmapIsReady = $q.defer();
						return uiGmapIsReady.promise
					}
				};
				
				restaurantsCtrl = $controller('RestaurantsCtrl', { $scope: $scope, 
																   PositionFactory: mockPositionFactory, 
																   uiGmapIsReady: uiGmapIsReady, 
																   uiGmapGoogleMapApi: uiGmapGoogleMapApi, 
																   $routeParams: routeParams
																});
			}));

			beforeEach(function() {
				$scope.map.control =  { refresh: function() { return null }}
				spyOn($scope.map.control, 'refresh').andCallThrough();

				uiGmapIsReady.resolve();
				$rootScope.$apply();						
			});


			it('should refresh map', function() {
				expect($scope.map.control.refresh).toHaveBeenCalled();
			});
		});

	});
});



