angular.module('RestaurantManager.Restaurants', []);
angular.module('RestaurantManager.Login', []);;angular.module('RestaurantManager', [
										'ngRoute',
										'ngAnimate',
										'ui.bootstrap',
										'route-segment', 
										'view-segment',
										'ngResource',
										'uiGmapgoogle-maps',
									 	'RestaurantManager.Restaurants',
									 	'RestaurantManager.Login'
									]
);;angular.module('RestaurantManager')
	.constant('API', 'http://api.lvh.me:3001/v1/');;angular.module('RestaurantManager').config(['$httpProvider', function ($httpProvider) {

	$httpProvider.defaults.headers.common.Authorization = 'Token 123';
	$httpProvider.defaults.headers.common.Accept = 'application/json';

	

}]);;angular.module('RestaurantManager').config(function(uiGmapGoogleMapApiProvider) {
    
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBmjjMKhsChjnsU63RzxJat-jOZhoZb5xQ',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
});angular.module('RestaurantManager').config(['$routeSegmentProvider', '$routeProvider', function ($routeSegmentProvider, $routeProvider) {

$routeSegmentProvider

    .when('/restaurants', 's1')
    .when('/restaurants/search', 's1.search')
    .when('/restaurants/create', 's1.create')
    .when('/restaurants/edit/:id', 's1.edit')
    .when('/restaurants/created', 's1.created')

    .segment('s1', {
    	templateUrl: 'views/restaurants.html',
    	controller: 'RestaurantCtrl'
    })

    .within()
    	.segment('search', {
    		controller: 'SearchCtrl',
			templateUrl: 'views/restaurants/search.html'
    	})
        .segment('create', {
            controller: 'CreateCtrl',
            templateUrl: 'views/restaurants/create.html',
            resolve: {
                resolvedData: checkUser
            }
        })
        .segment('edit', {
            controller: 'CreateCtrl',
            templateUrl: 'views/restaurants/create.html',
            dependencies: ['id'],
            resolve: {
                resolvedData: checkUser
            }
        })
        .segment('created', {
            controller: 'CreatedCtrl',
            templateUrl: 'views/restaurants/created.html',
            resolve: {
                resolvedData: checkUser
            }
        })
    	.segment('home/:latitude?/:longitude?/:zoom?', {
    		controller: 'PositionCtrl',
			templateUrl: 'views/restaurants/positions.html',
			'default': true
    	})

   	$routeProvider.otherwise({redirectTo: '/restaurants'});
}]);

var checkUser = ['LoginFactory', '$location', function(LoginFactory, $location) {
    if (!LoginFactory.user.loggedin) {
        LoginFactory.setShowMessage();
        $location.path('/restaurants');
    }
}];

;angular.module('RestaurantManager.Login').controller('LoginCtrl', ['$scope', '$location', '$routeParams', 'LoginFactory', '$routeSegment', function ($scope, $location, $routeParams, LoginFactory, $routeSegment) {

	var init = function() {
		
		if ($routeParams.auth_token && $routeParams.token_expires && $routeParams.apiuser_id) {
			LoginFactory.login($routeParams.auth_token, $routeParams.apiuser_id);
		}
		$location.search('auth_token', null).replace();
		$location.search('token_expires', null).replace();
		$location.search('apiuser_id', null).replace();

		$scope.$on('userNotValid', function() {
			$scope.login();	
	  	});

	  	$scope.user = LoginFactory.user;
	}

	listener = $scope.$on('$routeChangeSuccess', function() {
    	init();
    	listener();
  	});

	$scope.login = function() {
		var user_token = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < 35; i++ )
			user_token += possible.charAt(Math.floor(Math.random() * possible.length));

		LoginFactory.setUserToken(user_token);
		
		callback = encodeURIComponent($location.absUrl());
		url = "http://www.api.lvh.me:3001/v1/authenticate?user_token=" + user_token + '&callback=' + callback;
		window.location.href = url;
	}

	$scope.logout = function() {
		LoginFactory.logout();
		$location.path($routeSegment.getSegmentUrl('s1'));
	}
	
}]);;angular.module('RestaurantManager.Login').directive('loginMenu', ['LoginFactory', function (LoginFactory) {
	return {
		restrict: 'A',
		scope: {
			logout: '&',
			login: '&'
		},
		link: function(scope) {
			scope.user = LoginFactory.user;
		},
		template: '<button class="btn btn-default navbar-btn" data-ng-if="user.loggedin" data-ng-click="logout()">Logout</button>' +
				  '<button class="btn btn-default navbar-btn" data-ng-if="!user.loggedin" data-ng-click="login()">Login with GitHub</button>'
    }
}]);
;angular.module('RestaurantManager.Login').factory('LoginFactory', ['$q', function ($q) {
	
	var user_token_localstorage = 'user_token';
	var auth_token_localstorage = 'auth_token';
	var apiuser_id_localstorage = 'apiuser_id';

	saved_user_token = localStorage.getItem(user_token_localstorage);
	saved_auth_token = localStorage.getItem(auth_token_localstorage);
	saved_apiuser_id = localStorage.getItem(apiuser_id_localstorage);
	
	var user = {
					user_token: saved_user_token,
					auth_token: saved_auth_token,
					apiuser_id: saved_apiuser_id,
					loggedin: false,
					showMessage: false
				};

	if (saved_user_token && saved_auth_token && saved_apiuser_id) {
		user.loggedin = true;
	}

	return {
		user: user,
		setUserToken: function(user_token) {
			localStorage.setItem(user_token_localstorage, user_token);
		},
		login: function(auth_token, apiuser_id) {
			localStorage.setItem(auth_token_localstorage, auth_token);
			localStorage.setItem(apiuser_id_localstorage, apiuser_id);
			user.auth_token = auth_token;
			user.apiuser_id = apiuser_id;
			user.loggedin = true;
		},
		logout: function() {
			localStorage.removeItem(user_token_localstorage);
			localStorage.removeItem(auth_token_localstorage);
			localStorage.removeItem(apiuser_id_localstorage);

			user.user_token = null;
			user.auth_token = null;
			user.apiuser_id = null;
			user.loggedin = false;
		},
		setShowMessage: function() {
			user.showMessage = true;
		}
	}	
}]);;angular.module('RestaurantManager.Restaurants').controller('CreateCtrl', ['$scope', '$q','$routeParams', 'RestaurantFactory', 'RestaurantDataFactory',
																   function ($scope, $q, $routeParams, RestaurantFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.removeRestaurants();
	RestaurantDataFactory.addSelectMarker();
	$scope.newTags = [];
	$scope.restaurant = {};
	var original = {};

	var ownRestaurant;
	var edit = false;

	if ($routeParams.id) {
		edit = true;
		ownRestaurant = RestaurantFactory.get({id: $routeParams.id}).$promise;
		ownRestaurant.then(function(data) {
			$scope.restaurant = data.restaurant;
			$scope.restData.selectmarker.coords.latitude = data.restaurant.latitude;
 			$scope.restData.selectmarker.coords.longitude = data.restaurant.longitude;

			for (var key in data.restaurant.tags) {
				tag = data.restaurant.tags[key]
				$scope.newTags.push(tag["name"]);
			}
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;
			} 
		});
	}

	$scope.errorMessageisString = function() {

		return angular.isString($scope.errorMessage);
	}

	$scope.addTag = function(tag) {
		if (tag) {
			if (tag.name) {
				tag = tag.name;
			}
			if ($scope.newTags.indexOf(tag) < 0) {
				$scope.newTags.push(tag); 
			}
			$scope.tagAutocomplete = '';
		}
	};

	$scope.removeTag = function(tag) {
		var index = $scope.newTags.indexOf(tag);
		$scope.newTags.splice(index, 1);
	}

	var saveRestaurant = function() {
		if (!$scope.restData.loading) {
			RestaurantDataFactory.loading();
			$scope.successMessage = false;
			delete $scope.errorMessage; 
			restaurant = $scope.restaurant;
			restaurant.latitude = $scope.restData.selectmarker.coords.latitude;
			restaurant.longitude = $scope.restData.selectmarker.coords.longitude;
			restaurant.tags_attributes = [];
			for (var key in $scope.newTags) {
				tag = $scope.newTags[key]

				restaurant.tags_attributes.push({
					name: tag				
				});
			}

			var restaurantPost;
			if (edit) {
				restaurantPost = RestaurantFactory.put({ id: restaurant.id},{ restaurant: restaurant });
				
			} else {
				restaurantPost = RestaurantFactory.save({ restaurant: restaurant });
			}

			restaurantPost.$promise.then(function(data) {
				if (!edit) {
					$scope.newTags = [];
					$scope.restaurant = angular.copy(original);
					$scope.restForm.$setUntouched();
				}
				$scope.successMessage = true;
				RestaurantDataFactory.stopLoading();
			}, function(reason) {
				if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
					$scope.errorMessage = reason.data.userMessage;

					if (reason.data.errorCode == '1401') {
						$scope.$emit('userNotValid');
					}
				} 
				RestaurantDataFactory.stopLoading();
			});
		}
	}


	$scope.submit = function() {
		if ($routeParams.id) {
			ownRestaurant.then(function() {
				saveRestaurant();
			});
		} else {
			saveRestaurant();
		}
	}

}]);
;angular.module('RestaurantManager.Restaurants').controller('CreatedCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory',
																   function ($scope, RestaurantFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();
	RestaurantDataFactory.setOwnRestaurants();

	var getOwnRestaurants = function(params) {
		RestaurantDataFactory.loading();
		ownRestaurants = RestaurantFactory.getOwn(params);
		ownRestaurants.$promise.then(function(data) {
			RestaurantDataFactory.setRestaurantData(data);
			RestaurantDataFactory.stopLoading();
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;
			} 
			RestaurantDataFactory.stopLoading();
		});
	}
	getOwnRestaurants();

	$scope.$on('removeRestaurant', function(event, restaurant) {
		RestaurantDataFactory.loading();
		ownRestaurant = RestaurantFactory.remove({id: restaurant.id});
		ownRestaurant.$promise.then(function(data) {

			RestaurantDataFactory.removeRestaurant(restaurant.id)
			RestaurantDataFactory.stopLoading();
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;

				if (reason.data.errorCode == '1401') {
					$scope.$emit('userNotValid');
				}
			}
			RestaurantDataFactory.stopLoading(); 
		});
	});

	$scope.$on('paginate', function(event, args) {
		if (!$scope.restData.loading ) {
			getOwnRestaurants(args);
		}
	});

}]);															;angular.module('RestaurantManager.Restaurants').controller('PositionCtrl', ['$scope', '$q', '$timeout', 'PositionFactory', 'RestaurantDataFactory',
																	  function ($scope, $q, $timeout, PositionFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();
	var allowWatch = false;

	init = function() {
		
		if($scope.restData.cordsInParams) {
			var unregister = $scope.$watch('restData.map.center', function(newVal, oldVal) {
				if (!$scope.restData.waitForRefresh) {					
					getRestaurantsOnMap(null);
					unregister();
					allowWatch = true;
				}
			}, true);
		} else {
			getRestaurantsOnMap(null, true);
			allowWatch = true;
		}
	}

	// Watch for map change and update restaurants when latitude or longitude change enoufh relative to zoom.
	centerWatcher = function(newVal, oldVal) {
		updateRadio = getUpdateRatio(newVal.zoom);				

		if (!$scope.restData.loading && (
			(newVal.center.latitude > $scope.restData.lastLatitude && newVal.center.latitude - (10 - updateRadio ) > $scope.restData.lastLatitude) ||
			(newVal.center.latitude < $scope.restData.lastLatitude && newVal.center.latitude + (10 - updateRadio ) < $scope.restData.lastLatitude) ||
			(newVal.center.longitude > $scope.restData.lastLongitude && newVal.center.longitude - (10 - updateRadio ) > $scope.restData.lastLongitude) ||
			(newVal.center.longitude < $scope.restData.lastLongitude && newVal.center.longitude + (10 - updateRadio ) < $scope.restData.lastLongitude) || 
			newVal.zoom != oldVal.zoom)
		) {	
			update = false;
			$scope.restData.lastLatitude = newVal.center.latitude;
			$scope.restData.lastLongitude = newVal.center.longitude;
			getRestaurantsOnMap(null);
		}
	}

	$scope.$on('mapChange', function(event, args) {
		if (allowWatch) {
			centerWatcher(args.newVal, args.oldVal);
		}
	});

	$scope.$on('paginate', function(event, args) {
		if (allowWatch && !$scope.restData.loading ) {
			getRestaurantsOnMap(args);
		}
	});


	getRestaurantsOnMap = function(serverParamsString, firstTimeCalled) {
		RestaurantDataFactory.loading();

		params = serverParamsString ? serverParamsString : {};
		params.lat_top = $scope.restData.map.bounds.northeast.latitude;
		params.lat_bottom = $scope.restData.map.bounds.southwest.latitude;
		params.lng_right = $scope.restData.map.bounds.northeast.longitude;
		params.lng_left = $scope.restData.map.bounds.southwest.longitude;

		promise = PositionFactory.get(params);
		$q.all([promise.$promise, $scope.restData.uiGmapApiPromise]).then(function(data){

			RestaurantDataFactory.setRestaurantData(data[0]);					
			if (firstTimeCalled) {
				RestaurantDataFactory.refreshMap();
			}

			var restaurantsTimeout = $timeout(function() {
				RestaurantDataFactory.stopLoading();
			}, 1000);
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;
			}
			RestaurantDataFactory.stopLoading();
		});
	}

	getUpdateRatio = function(zoom) {
		var x = 9
		if (zoom < 10) {
			x = zoom;
		} else if (zoom > 16) {
			x += 0.99;
		} else if (zoom == 16) {
			x += zoom * 0.062;
		} else if (zoom > 9 && zoom < 12 || zoom > 16) {
			x += zoom * 0.05;
		} else if (zoom > 14) {
			x += zoom * 0.065;
		} else if (zoom > 11 && zoom < 14 || zoom > 13) {
			x += zoom * 0.07;
		}

		return x;
	}


	init();
 }]);;angular.module('RestaurantManager.Restaurants').controller('RestaurantCtrl', ['$scope', '$route', '$location', '$routeSegment', 'RestaurantDataFactory', 'uiGmapIsReady', 'uiGmapGoogleMapApi',
																   function ($scope, $route, $location, $routeSegment, RestaurantDataFactory, uiGmapIsReady, uiGmapGoogleMapApi) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	var allowReload = false;

	uiGmapIsReady.promise().then(function(data){
		RestaurantDataFactory.resolveGmap();
	}, function(reason) {
		RestaurantDataFactory.rejectGmap();
	});

	uiGmapGoogleMapApi.then(function(data){
		RestaurantDataFactory.resolveGmapApi();
	
	}, function(reason) {
		RestaurantDataFactory.rejectGmapApi();
	});

	$scope.$watch('restData.map', function(newVal, oldVal) {
		$location.search('latitude', newVal.center.latitude).replace();
		$location.search('longitude', newVal.center.longitude).replace();
		$location.search('zoom', newVal.zoom).replace();
		$scope.$broadcast('mapChange', {newVal: newVal, oldVal: oldVal});
	}, true);

	$scope.remove = function(id, event) {
		event.stopPropagation();
		event.preventDefault();
		$scope.$broadcast('removeRestaurant', {id: id});
	}

	$scope.tagSearch = function(tag) {
		$location.path($routeSegment.getSegmentUrl('s1.search')).search({ tag: tag.id});
		$scope.$broadcast('tagChange', {tag: tag});	
	}

	$scope.userSearch = function(user) {
		$location.path($routeSegment.getSegmentUrl('s1.search')).search({ user: user.id});
		$scope.$broadcast('userChange', {user: user});	
	}


	$scope.paginate = function(url) {
		urlParams = url.split('&');
		params = {};
		
		for (var i in urlParams ) {
			param = urlParams[i].split('=');
			params[param[0]] = param[1];
		}

		$scope.$broadcast('paginate', params);
	}

	$scope.showRestaurantInfo = function(marker) {
		if (!marker.showMoreInfo) {
			marker.showMoreInfo = true;
			document.getElementById('restaurantList').scrollTop = 0;
			from = $scope.restData.restaurants.indexOf(marker);
			$scope.restData.restaurants.splice(0, 0, $scope.restData.restaurants.splice(from, 1)[0]);
		}
	}



	var lastRoute = $route.current;
 	$scope.$on('$locationChangeSuccess', function(event) {
		if ($route.current.$$route.segment == lastRoute.$$route.segment) {
			$route.current = lastRoute;
		} else {
			lastRoute = $route.current;
		}        
	});

}]);;angular.module('RestaurantManager.Restaurants').controller('SearchCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory', '$location', '$routeParams',
																   function ($scope, RestaurantFactory, RestaurantDataFactory, $location, $routeParams) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	RestaurantDataFactory.removeRestaurants();
	var latestParams = {};

	var init = function() {
		if ($routeParams.search) {
			$scope.freeSearch($routeParams.search);
		} else if ($routeParams.tag) {
			$scope.tagSearch({ id: $routeParams.tag});
		} else if ($routeParams.user) {
			$scope.userSearch({ id: $routeParams.user});
		}
	}


	var restaurantsSearch = function(params) {
		RestaurantDataFactory.loading();
		$scope.tagError = "";
		$scope.userError = "";

		RestaurantDataFactory.removeRestaurants();
		$location.search('search', null).replace();
		$location.search('tag', null).replace();
		$location.search('user', null).replace();


		promise = RestaurantFactory.get(params);
		promise.$promise.then(function(data) {
			latestParams = params;
			RestaurantDataFactory.setRestaurantData(data);
			RestaurantDataFactory.stopLoading();			
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				$scope.errorMessage = reason.data.userMessage;
			} 
			RestaurantDataFactory.stopLoading();
		});
	}

	$scope.$on('paginate', function(event, args) {
		if (!$scope.restData.loading ) {
			latestParams.limit = args.limit;
			latestParams.offset = args.offset;
			restaurantsSearch(latestParams);
		}
	});


	$scope.tagSearch = function(tag) {
		if (tag && tag.id) {
			restaurantsSearch({ tag_id: tag.id });
			$location.search('tag', tag.id).replace();
		} else {
			$scope.userError = "";
			$scope.tagError = 'Invalid search. Please select from autocomplete.';
		}
	}

	$scope.$on('tagChange', function(event, args) {
		$scope.tagSearch(args.tag);
	});


	$scope.userSearch = function(user) {
		if (user && user.id) {
			restaurantsSearch({ apiuser_id: user.id });
			$location.search('user', user.id).replace();
		} else {
			$scope.tagError = "";
			$scope.userError = 'Invalid search. Please select from autocomplete.';
		}
	}

	$scope.$on('userChange', function(event, args) {
		$scope.userSearch(args.user);
	});

	$scope.freeSearch = function(searchWords) {
		params = {}
		if (!$scope.restData.loading) {
			if (searchWords) {
				$scope.latestSearch = searchWords;
				params.q = searchWords.replace(/\s/g, ' ');
				restaurantsSearch(params);

				$location.search('search', searchWords).replace();
			} else {
				$scope.tagError = "";
				$scope.userError = "";
			}
		}
	}

	init();
}]);;angular.module('RestaurantManager.Restaurants').directive('showValidation', [function() {
    return {
        restrict: "A",
        require:'form',
        link: function(scope, element, attrs, formCtrl) {
            element.find('.form-group').each(function() {
                var $formGroup=$(this);
                var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                if ($inputs.length > 0) {
                    $inputs.each(function() {
                        var $input=$(this);
                        scope.$watch(function() {
                            return $input.hasClass('ng-invalid');
                        }, function(isInvalid) {
                            $formGroup.toggleClass('has-error', isInvalid);
                        });
                    });
                }
            });
        }
    };
}]);;angular.module('RestaurantManager.Restaurants').directive('tagsAutocomplete', [  function () {
	return {
		restrict: 'E',
		controller: ['$scope', 'AutocompleteFactory', function($scope, AutocompleteFactory) {
			$scope.getTags = function(term) {
				promise = AutocompleteFactory.tags(term);
				return promise;
			}
		}],
		template: '<input type="text" data-ng-model="tagAutocomplete" placeholder="Search by tag"' +
						 'typeahead="tag as tag.name for tag in getTags($viewValue)" typeahead-loading="tagloadingLocations" class="form-control">' +
    				'<i ng-show="tagloadingLocations" class="glyphicon glyphicon-refresh"></i>' +
    				'<p>{{ tagAutocompleteError }}</p>'
	}
}]);
;angular.module('RestaurantManager.Restaurants').directive('usersAutocomplete', [  function () {
	return {
		restrict: 'E',
		controller: ['$scope', 'AutocompleteFactory', function($scope, AutocompleteFactory) {
			$scope.getUsers = function(term) {
				promise = AutocompleteFactory.users(term);
				return promise;
			}
		}],
		template: '<input type="text" data-ng-model="userAutocomplete" placeholder="Search by user"' +
						 'typeahead="user as user.name for user in getUsers($viewValue)" typeahead-loading="userloadingLocations" class="form-control">' +
    				'<i ng-show="userloadingLocations" class="glyphicon glyphicon-refresh"></i>' +
    				'<p>{{ userAutocompleteError }}</p>'
    }
}]);
;angular.module('RestaurantManager.Restaurants').factory('UserFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'apiusers/:id', {}, {});
 }]);;angular.module('RestaurantManager.Restaurants').factory('AutocompleteFactory', [ '$q', '$timeout', 'TagFactory', 'UserFactory', function ($q, $timeout, TagFactory, UserFactory) {
	
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
}]);;angular.module('RestaurantManager.Restaurants').factory('PositionFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'positions', {}, {});
 }]);;angular.module('RestaurantManager.Restaurants').factory('RestaurantDataFactory', [ '$q', '$routeParams', function ($q, $routeParams) {
	
	var uiGmapDeferred = $q.defer();
	var uiGmapApiDeferred = $q.defer();
	var lastLatitude = 45.0;
	var lastLongitude = 15.0;

	var restaurantsData = {
		ownRestaurants: false,
		errorMessage: null,
		loading: false,
		restaurants: [],
		selectmarker: {},
		watchMap: true,
		uiGmapPromise: uiGmapDeferred.promise,
		uiGmapApiPromise: uiGmapApiDeferred.promise,
		waitForRefresh: true,
		map: {  control: {}, 
				center: { latitude: lastLatitude, longitude: lastLongitude }, 
				zoom: 3,
				changer: false,				  
				bounds: {	northeast: { latitude: 68, longitude: 100 },	
							southwest: { latitude: -29,	longitude: -91 }}
		},
		lastLatitude: lastLatitude,
		lastLongitude: lastLongitude,
		cordsInParams: false,
		options: {
			styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#647ea4"},{"visibility":"on"}]}]
		}
	}

	var updateMapFromRoutes = function() { 
		if( $routeParams.zoom && !isNaN(parseInt($routeParams.zoom))) {
			restaurantsData.map.zoom = parseInt($routeParams.zoom);
		}  
		

		if($routeParams.latitude && $routeParams.longitude && !isNaN(parseFloat($routeParams.latitude)) && !isNaN(parseFloat($routeParams.longitude))) {
			restaurantsData.lastLatitude = parseFloat($routeParams.latitude) - 20;
			restaurantsData.cordsInParams = true;



			restaurantsData.uiGmapPromise.then(function(data){
				restaurantsData.waitForRefresh = false;
				restaurantsData.map.control.refresh({latitude: parseFloat($routeParams.latitude), 
													 longitude: parseFloat($routeParams.longitude)});
			});
		} else {
			restaurantsData.cordsInParams = false;
		}

	}


	return {
		restaurantsData: restaurantsData,
		setRestaurantData: function(data) {
			restaurantsData.firstUrl = data.links.first ? data.links.first.split('?')[1] : "";
			restaurantsData.nextUrl = data.links.next ? data.links.next.split('?')[1] : "";
			restaurantsData.prevUrl = data.links.prev ? data.links.prev.split('?')[1] : "";
			restaurantsData.lastUrl = data.links.last ? data.links.last.split('?')[1] : "";

			var openRestaurants = [];
			var openRestaurantsIds = [];

			for (var key in restaurantsData.restaurants) {
				restaurant = restaurantsData.restaurants[key]
				if(restaurant.showMoreInfo) {
					openRestaurants.push(restaurant);
					openRestaurantsIds.push(restaurant.id);
				}
			}

			for (var key in data.restaurants) {
				restaurant = data.restaurants[key];
				if (openRestaurantsIds.indexOf(restaurant.id) < 0) {
					openRestaurants.push(restaurant);
				}
			}
						
			restaurantsData.restaurants = openRestaurants;	
		},
		resolveGmap: function() {
			uiGmapDeferred.resolve();
		},
		resolveGmapApi: function() {
			uiGmapApiDeferred.resolve();
		},
		rejectGmap: function() {
			uiGmapDeferred.reject();
		},
		rejectGmapApi: function() {
			uiGmapApiDeferred.reject();
		},
		updateMapFromRoutes: function() {
			updateMapFromRoutes();
		},
		loading: function() {
			restaurantsData.loading = true;
		},
		stopLoading: function() {
			restaurantsData.loading = false;
		},
		refreshMap: function() {
			restaurantsData.map.changer = !restaurantsData.map.changer;
		},
		setErrorMessage: function(errorMessage) {
			restaurantsData.errorMessage = errorMessage;
		},
		removeRestaurants: function() {
			restaurantsData.restaurants = [];
			restaurantsData.selectmarker.show = false;
			restaurantsData.ownRestaurants = false;
		},
		addSelectMarker: function() {
			restaurantsData.selectmarker = {
				id: 0,
				show: true,
				coords: {
					latitude: restaurantsData.map.center.latitude,
					longitude: restaurantsData.map.center.longitude
				},
				options: { draggable: true }				
			};
		},
		setOwnRestaurants: function() {
			restaurantsData.ownRestaurants = true;	
		},
		removeRestaurant: function(id) {

			for(var i=0; i<restaurantsData.restaurants.length; i++){
				if(restaurantsData.restaurants[i].id == id){
					restaurantsData.restaurants.splice(i, 1);
					break;
				}
			}
		}
	};
 }]);;angular.module('RestaurantManager.Restaurants').factory('RestaurantFactory', ['$resource', 'API', 'LoginFactory', function ($resource, $API, LoginFactory) {
	return $resource($API + 'restaurants/:id', {}, {
		'save': {method: 'POST', headers: { user_token: LoginFactory.user.user_token, 
											auth_token: LoginFactory.user.auth_token} },
		'getOwn': {method: 'GET', params: { apiuser_id: LoginFactory.user.apiuser_id }},  
		'put': {method:'PUT', headers: { user_token: LoginFactory.user.user_token, 
							  			 auth_token: LoginFactory.user.auth_token} },
		'remove': {method:'DELETE', headers: { user_token: LoginFactory.user.user_token, 
							  			 	   auth_token: LoginFactory.user.auth_token} }
	});
 }]);;angular.module('RestaurantManager.Restaurants').factory('TagFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'tags/:id', {}, {});
 }]);;angular.module('templates-dist', ['../views/restaurants.html', '../views/restaurants/create.html', '../views/restaurants/created.html', '../views/restaurants/positions.html', '../views/restaurants/search.html']);

angular.module("../views/restaurants.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants.html",
    "<div class=\"row fullheight\">\n" +
    "	<div class=\"col-md-3 fullheight\">\n" +
    "		<ul class=\"nav nav-tabs\">\n" +
    "			<li data-ng-class=\"{active: ('s1.home' | routeSegmentStartsWith)}\" class=\"presentation\"><a href=\"#{{ 's1' | routeSegmentUrl}}\">Home</a></li>\n" +
    "			<li data-ng-class=\"{active: ('s1.search' | routeSegmentEqualsTo)}\" class=\"presentation\"><a href=\"#{{ 's1.search' | routeSegmentUrl}}\">Search</a></li>\n" +
    "			<li data-ng-if=\"user.loggedin\" data-ng-class=\"{active: ('s1.create' | routeSegmentEqualsTo)}\" class=\"presentation\">\n" +
    "				<a href=\"#{{ 's1.create' | routeSegmentUrl}}\">Create</a>\n" +
    "			</li>\n" +
    "			<li data-ng-if=\"user.loggedin\" data-ng-class=\"{active: ('s1.created' | routeSegmentEqualsTo)}\" class=\"presentation\">\n" +
    "				<a href=\"#{{ 's1.created' | routeSegmentUrl}}\">My restaurants</a>\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "\n" +
    "		<div class=\"sideContent\">\n" +
    "			<div class=\"restaurantForms\" app-view-segment=\"1\"></div>\n" +
    "			<div data-ng-if=\"!restData.selectmarker.show\" class=\"restaurantList\">\n" +
    "				<div class=\"form-group has-feedback filterInput\">\n" +
    "					<input data-ng-model=\"filterText\" class=\"form-control\" placeholder=\"Filter\" />\n" +
    "					<i class=\"glyphicon glyphicon-search form-control-feedback\"></i>\n" +
    "				</div>\n" +
    "				<ul id=\"restaurantList\" class=\"list-unstyled\">\n" +
    "					<li class=\"noRestaurants\" data-ng-show=\"!restData.restaurants.length\">No restaurants found</li>\n" +
    "					<li data-ng-repeat=\"restaurant in restData.restaurants | filter:filterText\" id=\"restaurant{{restaurant.id}}\">\n" +
    "						<div class=\"restaurantHeader\" data-ng-click=\"restaurant.showMoreInfo = !restaurant.showMoreInfo\">\n" +
    "							<p data-ng-class=\"{shortWithMoreInfo: restaurant.showMoreInfo}\" class=\"restaurantName\" >{{restaurant.name}}</p>\n" +
    "							<div data-ng-if=\"restData.ownRestaurants\" class=\"btn-group restaurantEditBtns\" role=\"group\" aria-label=\"...\">\n" +
    "								<a href=\"#{{ 's1.edit' | routeSegmentUrl: {id: restaurant.id} }}\" type=\"button\" class=\"btn btn-success btn-xs\">\n" +
    "									<span class=\"glyphicon glyphicon-edit\" aria-hidden=\"true\"></span>\n" +
    "								</a>\n" +
    "								<button data-ng-click=\"remove(restaurant.id, $event)\" type=\"button\" class=\"btn btn-danger btn-xs\">\n" +
    "									<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n" +
    "								</button>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "						<div class=\"restaurantMoreInfo\" data-ng-show=\"restaurant.showMoreInfo\">\n" +
    "							<div class=\"row\">\n" +
    "								<div class=\"col-sm-4 attributeDescription\">Phone:</div>\n" +
    "								<div class=\"col-sm-8 attributeData\"><p>{{restaurant.phone}}</p></div>\n" +
    "							</div>\n" +
    "							<div class=\"row\">\n" +
    "								<div class=\"col-sm-4 attributeDescription\">Address:</div>\n" +
    "								<div class=\"col-sm-8 attributeData\"><p>{{restaurant.address}}</p></div>\n" +
    "							</div>						\n" +
    "							<div class=\"row\">\n" +
    "								<div class=\"col-sm-4 attributeDescription\">Description:</div>\n" +
    "								<div class=\"col-sm-8 attributeData\"><p>{{restaurant.description}}</p></div>\n" +
    "							</div>\n" +
    "							<div class=\"row\">\n" +
    "								<div class=\"col-sm-4 attributeDescription\">Publisher:</div>\n" +
    "								<div class=\"col-sm-8 attributeData\">\n" +
    "									<p><a class=\"restaurantUser\" data-ng-click=\"userSearch(restaurant.apiuser)\">\n" +
    "										{{restaurant.apiuser.name}}\n" +
    "									</a></p>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "							<div class=\"row\">\n" +
    "								<div class=\"col-sm-4 attributeDescription\">Tags:</div>\n" +
    "								<div class=\"col-sm-8 attributeData\">\n" +
    "									<p><a class=\"restaurantTags\" data-ng-repeat=\"tag in restaurant.tags\"  data-ng-click=\"tagSearch(tag)\">\n" +
    "										{{tag.name}}\n" +
    "									</a></p>\n" +
    "								</div>\n" +
    "							</div>\n" +
    "						</div>\n" +
    "\n" +
    "					</li>\n" +
    "				</ul>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<div data-ng-if=\"!restData.selectmarker.show\" class=\"paginationBtns\">\n" +
    "			<button class=\"btn btn-link\" data-ng-disabled=\"restData.firstUrl.length < 1 || restData.prevUrl.length < 1\" data-ng-click=\"paginate(restData.firstUrl)\">&lt;&lt;</button>\n" +
    "			<button class=\"btn btn-link\" data-ng-disabled=\"restData.prevUrl.length < 1\" data-ng-click=\"paginate(restData.prevUrl)\">&lt;</button>\n" +
    "			<button class=\"btn btn-link\" data-ng-disabled=\"restData.nextUrl.length < 1\" data-ng-click=\"paginate(restData.nextUrl)\">&gt;</button>\n" +
    "			<button class=\"btn btn-link\" data-ng-disabled=\"restData.lastUrl.length < 1 || restData.nextUrl.length < 1\" data-ng-click=\"paginate(restData.lastUrl)\">&gt;&gt;</button>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"col-md-9 fullheight\">\n" +
    "		<ui-gmap-google-map center='restData.map.center' zoom='restData.map.zoom' bounds=\"restData.map.bounds\" draggable=\"true\" control=\"restData.map.control\" options=\"restData.options\">\n" +
    "	        <ui-gmap-marker data-ng-if=\"!restData.selectmarker.show\" data-ng-repeat=\"m in restData.restaurants\" coords=\"m\" icon=\"markerIcon\" click=\"showRestaurantInfo(m);\" idKey=\"m.id\">\n" +
    "	            <ui-gmap-window data-ng-cloak  coords=\"map.infoWindowWithCustomClass.coords\" show=\"m.showMoreInfo\" closeClick=\"m.showMoreInfo = false\" \n" +
    "	            	options=\"map.infoWindowWithCustomClass.options\">\n" +
    "	            	<div>\n" +
    "		            	<p>{{m.name}}</p>\n" +
    "		            	<p>{{m.address}}</p>\n" +
    "		            </div>\n" +
    "	            </ui-gmap-window>\n" +
    "	        </ui-gmap-marker>\n" +
    "			<ui-gmap-marker data-ng-if=\"restData.selectmarker.show\" coords=\"restData.selectmarker.coords\" options=\"restData.selectmarker.options\" \n" +
    "				events=\"restData.selectmarker.events\" idkey=\"restData.selectmarker.id\">\n" +
    "		</ui-gmap-google-map>	\n" +
    "		\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("../views/restaurants/create.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/create.html",
    "<form class=\"form-horizontal creatRestaurant\" name=\"restForm\" novalidate>\n" +
    "	<div class=\"alert alert-danger\" role=\"alert\" data-ng-if=\"errorMessage\">\n" +
    "		<ul data-ng-if=\"!errorMessageisString()\">\n" +
    "			<li data-ng-repeat=\"(key, error) in errorMessage\">\n" +
    "				{{key}}: {{error[0]}}\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "		<p data-ng-if=\"errorMessageisString()\">\n" +
    "			{{errorMessage}}\n" +
    "		</p>\n" +
    "	</div>\n" +
    "	\n" +
    "	<div class=\"form-group\" data-ng-class=\"{'has-error': restForm.name.$invalid && restForm.name.$touched}\">\n" +
    "		<label for=\"name\" class=\"col-sm-3 control-label\">Name</label>\n" +
    "		<div class=\"col-sm-9\">\n" +
    "			<input type=\"text\" class=\"form-control\" id=\"name\" name=\"name\" data-ng-model=\"restaurant.name\" required placeholder=\"Ex Harrys\">		\n" +
    "		</div>\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"form-group\" data-ng-class=\"{'has-error': restForm.phone.$invalid && restForm.phone.$touched}\">\n" +
    "		<label for=\"phone\" class=\"col-sm-3 control-label\">Phone</label>\n" +
    "		<div class=\"col-sm-9\">\n" +
    "			<input type=\"text\" class=\"form-control\" name=\"phone\" data-ng-model=\"restaurant.phone\" required id=\"phone\">		\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\" data-ng-class=\"{'has-error': restForm.address.$invalid && restForm.address.$touched}\">\n" +
    "		<label for=\"address\" class=\"col-sm-3 control-label\">Address</label>\n" +
    "		<div class=\"col-sm-9\">\n" +
    "			<input type=\"text\" class=\"form-control\" name=\"address\" data-ng-model=\"restaurant.address\" id=\"address\" required placeholder=\"Ex Road 2, Kalmar 333 00\">		\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\" data-ng-class=\"{'has-error': restForm.description.$invalid && restForm.description.$touched}\">\n" +
    "		<label for=\"description\" class=\"col-sm-3 control-label\">Description</label>\n" +
    "		<div class=\"col-sm-9\">\n" +
    "			<textarea rows=\"3\" type=\"text\" class=\"form-control\" name=\"description\" data-ng-model=\"restaurant.description\" \n" +
    "				required id=\"description\" placeholder=\"Tell us about your restaurant!\"></textarea>		\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"createCoordsInfo\">\n" +
    "		<p>Move the marker on the map to set coordinates</p>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"longitude\" class=\"col-sm-3 control-label\">Longitude</label>\n" +
    "		<div class=\"col-sm-9\">\n" +
    "			<input type=\"text\" class=\"form-control\" id=\"longitude\" readonly data-ng-model=\"restData.selectmarker.coords.longitude\">				\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"latitude\" class=\"col-sm-3 control-label\">Latitude</label>\n" +
    "		<div class=\"col-sm-9\">\n" +
    "			<input type=\"text\" class=\"form-control\" id=\"latitude\" readonly data-ng-model=\"restData.selectmarker.coords.latitude\">				\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"tagAdder\">\n" +
    "		<div class=\"form-group\">\n" +
    "			<tags-autocomplete></tags-autocomplete>\n" +
    "		</div>\n" +
    "		<button type=\"submit\" data-ng-click=\"addTag(tagAutocomplete)\" class=\"btn btn-default addTagBtn\">Add</button>\n" +
    "	</div>\n" +
    "	<div class=\"form-group tagListFormGroup\">\n" +
    "		<div class=\"col-sm-9\">\n" +
    "			<ul class=\"tagList\" data-ng-if=\"newTags.length\">\n" +
    "				<li data-ng-repeat=\"tag in newTags\">\n" +
    "					{{tag}}\n" +
    "					<button type=\"button\" class=\"btn btn-default btn-xs removeTagBtn\" data-ng-click=\"removeTag(tag)\">\n" +
    "						<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\" ></span>\n" +
    "					</button>\n" +
    "				</li>\n" +
    "			</ul>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\">\n" +
    "		<div class=\"col-sm-8\">\n" +
    "			<div data-ng-if=\"successMessage\" class=\"alert alert-success\" role=\"alert\">\n" +
    "				<p>Restaurangen sparades!</p>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "		<button type=\"submit\" data-ng-click=\"submit()\" data-ng-disabled=\"restForm.$invalid\" class=\"btn btn-success pull-right\">Submit</button>\n" +
    "\n" +
    "	</div>\n" +
    "	<div class=\"createLoading\" data-ng-if=\"restData.loading\">\n" +
    "		<div></div>\n" +
    "	</div>\n" +
    "</form>\n" +
    "");
}]);

angular.module("../views/restaurants/created.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/created.html",
    "<div class=\"createdInfo\">\n" +
    "	<p data-ng-if=\"!errorMessage\">Edit or remove the restaurants you created.</p>\n" +
    "	<p data-ng-if=\"errorMessage\" class=\"errorMessage\">{{errorMessage}}</p>\n" +
    "	<div class=\"createdLoading\" data-ng-if=\"restData.loading\">\n" +
    "		<div></div>\n" +
    "	</div>\n" +
    "</div>");
}]);

angular.module("../views/restaurants/positions.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/positions.html",
    "<div class=\"positionsInfo\">\n" +
    "	<p data-ng-if=\"!errorMessage\">Please navigate the map and restaurants will load relevant to your position!</p>\n" +
    "	<p data-ng-if=\"errorMessage\" class=\"errorMessage\">{{errorMessage}}</p>\n" +
    "	<div class=\"positionLoading\" data-ng-if=\"restData.loading\">\n" +
    "		<div></div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);

angular.module("../views/restaurants/search.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/search.html",
    "<div class=\"searchLoading\" data-ng-if=\"restData.loading\">\n" +
    "	<div></div>\n" +
    "</div>\n" +
    "<div data-ng-if=\"!errorMessage\" class=\"searchForms\" >\n" +
    "	<div class=\"freeSearchForm\">\n" +
    "		<form class=\"form-inline\" data-ng-submit=\"freeSearch(searchWords)\">\n" +
    "			<div class=\"form-group has-feedback\">\n" +
    "				<input class=\"form-control\" id=\"searchWords\" data-ng-model=\"searchWords\" placeholder=\"Search for restaurants\" />\n" +
    "				<i class=\"glyphicon glyphicon-search form-control-feedback\"></i>\n" +
    "			</div>\n" +
    "		</form>   \n" +
    "	</div>\n" +
    "	<div class=\"tagSearchForm\">\n" +
    "		<form class=\"form-inline\">\n" +
    "			<div class=\"form-group\">\n" +
    "				<tags-autocomplete></tags-autocomplete>\n" +
    "			</div>\n" +
    "			<button type=\"submit\" data-ng-disabled=\"restData.loading\" data-ng-click=\"tagSearch(tagAutocomplete)\" class=\"btn btn-default\">Search</button>\n" +
    "		</form>\n" +
    "		<div data-ng-if=\"tagError\" >\n" +
    "			<p class=\"autoCompleteError\">{{tagError}}</p>\n" +
    "		</div>	\n" +
    "	</div>\n" +
    "	<div class=\"userSearchForm\">\n" +
    "		<form class=\"form-inline\">\n" +
    "			<div class=\"form-group\">\n" +
    "				<users-autocomplete></users-autocomplete>\n" +
    "			</div>\n" +
    "			<button type=\"submit\" data-ng-disabled=\"restData.loading\" data-ng-click=\"userSearch(userAutocomplete)\" class=\"btn btn-default\">Search</button>\n" +
    "		</form>\n" +
    "		<div data-ng-if=\"userError\" >\n" +
    "			<p class=\"autoCompleteError\">{{userError}}</p>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "		\n" +
    "</div>\n" +
    "<div data-ng-if=\"errorMessage\" class=\"errorInfo errorMessage\">\n" +
    "	<p>{{errorMessage}}</p>\n" +
    "</div>\n" +
    "");
}]);
