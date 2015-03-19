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
            templateUrl: 'views/restaurants/create.html'
        })
    	.segment('home/:latitude?/:longitude?/:zoom?', {
    		controller: 'PositionCtrl',
			templateUrl: 'views/restaurants/positions.html',
			'default': true
    	})

   	$routeProvider.otherwise({redirectTo: '/restaurants'});
}]);

;angular.module('RestaurantManager.Login').controller('LoginCtrl', ['$scope', '$location', '$routeParams', 'LoginFactory', function ($scope, $location, $routeParams, LoginFactory) {

	var init = function() {
		
		if ($routeParams.auth_token && $routeParams.token_expires) {
			LoginFactory.login($routeParams.auth_token);
		}
		$location.search('auth_token', null).replace();
		$location.search('token_expires', null).replace();
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
		template: '<button data-ng-if="user.loggedin" data-ng-click="logout()">Logout</button>' +
				  '<button data-ng-if="!user.loggedin" data-ng-click="login()">Login</button>'
    }
}]);
;angular.module('RestaurantManager.Login').factory('LoginFactory', [ function () {
	
	var user_token_localstorage = 'user_token';
	var auth_token_localstorage = 'auth_token';

	saved_user_token = localStorage.getItem(user_token_localstorage);
	saved_auth_token = localStorage.getItem(auth_token_localstorage);
	
	var user = {
					user_token: saved_user_token,
					auth_token: saved_auth_token,
					loggedin: false
				};

	if (saved_user_token && saved_auth_token) {
		user.loggedin = true;
	}

	return {
		user: user,
		setUserToken: function(user_token) {
			localStorage.setItem(user_token_localstorage, user_token);
		},
		login: function(auth_token) {
			localStorage.setItem(auth_token_localstorage, auth_token);
			user.auth_token = auth_token;
			user.loggedin = true;
		},
		logout: function() {
			localStorage.removeItem(user_token_localstorage);
			localStorage.removeItem(auth_token_localstorage);

			user.user_token = null;
			user.auth_token = null;
			user.loggedin = false;
		}  
	}	
}]);;angular.module('RestaurantManager.Restaurants').controller('CreateCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory',
																   function ($scope, RestaurantFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.removeRestaurants();
	RestaurantDataFactory.addSelectMarker();
	$scope.newTags = [];
	$scope.restaurant = {};
	var original = $scope.restaurant;

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

	$scope.submit = function() {
		
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

		restaurantPost = RestaurantFactory.save({ restaurant: restaurant });
		restaurantPost.$promise.then(function(data) {
			$scope.newTags = [];
			$scope.restaurant = angular.copy(original);
			$scope.restForm.$setUntouched();
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				RestaurantDataFactory.setErrorMessage(reason.data.userMessage);
			} 
		});

	}

}]);
;angular.module('RestaurantManager.Restaurants').controller('PositionCtrl', ['$scope', '$q', '$timeout', 'PositionFactory', 'RestaurantDataFactory',
																	  function ($scope, $q, $timeout, PositionFactory, RestaurantDataFactory) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();
	var allowWatch = false;

	init = function() {
		
		if($scope.restData.cordsInParams) {
			var unregister = $scope.$watch('restData.map', function(newVal, oldVal) {
				if (!$scope.restData.map.waitForRefresh) {
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
		updateRadio = getUpdateRadio(newVal.zoom);				

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
				RestaurantDataFactory.setErrorMessage(reason.data.userMessage);
			}
		});
	}


	getUpdateRadio = function(zoom) {
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
 }]);;angular.module('RestaurantManager.Restaurants').controller('RestaurantCtrl', ['$scope', '$route', '$location', 'RestaurantDataFactory', 'uiGmapIsReady', 'uiGmapGoogleMapApi',
																   function ($scope, $route, $location, RestaurantDataFactory, uiGmapIsReady, uiGmapGoogleMapApi) {

	$scope.restData = RestaurantDataFactory.restaurantsData;

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


	$scope.paginate = function(url) {
		urlParams = url.split('&');
		params = {};
		
		for (var i in urlParams ) {
			param = urlParams[i].split('=');
			params[param[0]] = param[1];
		}

		$scope.$broadcast('paginate', params);
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


	var init = function() {
		if ($routeParams.search) {
			$scope.freeSearch($routeParams.search);
		} else if ($routeParams.tag) {
			$scope.tagSearch({ id: $routeParams.tag});
		} else if ($routeParams.user) {
			$scope.tagSearch({ id: $routeParams.user});
		}
	}


	var restaurantsSearch = function(params) {
		$scope.searchError = "";
		RestaurantDataFactory.removeRestaurants();
		$location.search('search', null).replace();
		$location.search('tag', null).replace();
		$location.search('user', null).replace();


		promise = RestaurantFactory.get(params);
		promise.$promise.then(function(data) {
			RestaurantDataFactory.setRestaurantData(data);			
		}, function(reason) {
			if (reason && reason.hasOwnProperty('data') && reason.data.hasOwnProperty('userMessage')) {
				RestaurantDataFactory.setErrorMessage(reason.data.userMessage);
			} 
		});
	}


	$scope.tagSearch = function(tag) {
		if (tag && tag.id) {
			restaurantsSearch({ tag_id: tag.id });
			$location.search('tag', tag.id).replace();
		} else {
			$scope.searchError = 'Unvalid search. Please select from autocomplete.';
		}
	}
	$scope.userSearch = function(user) {
		if (user && user.id) {
			restaurantsSearch({ apiuser_id: user.id });
			$location.search('user', user.id).replace();
		} else {
			$scope.searchError = 'Unvalid search. Please select from autocomplete.';
		}
	}

	$scope.freeSearch = function(searchWords) {
		params = {}
		if (searchWords) {
			$scope.latestSearch = searchWords;
			params.q = searchWords.replace(/\s/g, ' ');
			restaurantsSearch(params);

			$location.search('search', searchWords).replace();
		} else {
			$scope.searchError = "";
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
		template: '<input type="text" data-ng-model="tagAutocomplete" placeholder="Ange tag"' +
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
		template: '<input type="text" data-ng-model="userAutocomplete" placeholder="Ange användare"' +
						 'typeahead="user as user.name for user in getUsers($viewValue)" typeahead-loading="userloadingLocations" class="form-control">' +
    				'<i ng-show="userloadingLocations" class="glyphicon glyphicon-refresh"></i>' +
    				'<p>{{ userAutocompleteError }}</p>'
    }
}]);
;angular.module('RestaurantManager.Restaurants').factory('UserFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'apiusers/:id', {}, {});
 }]);;angular.module('RestaurantManager.Restaurants').factory('AutocompleteFactory', [ '$q', '$timeout', 'TagFactory', 'UserFactory', function ($q, $timeout, TagFactory, UserFactory) {
	
	var timeout = 0;

	var autocomplete = function(factory, attr) {
		$timeout.cancel(timeout);
		defer = $q.defer()

		timeout = $timeout(function() {
			factory.$promise.then(function(data) {	
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
			return autocomplete(TagFactory.get({ term: term, limit: 8 }), 'tags');
		},
		users: function(term) {
			return autocomplete(UserFactory.get({ term: term, limit: 8 }), 'apiusers');	
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
		errorMessage: null,
		loading: false,
		restaurants: [],
		restaurantmarkers: [],
		watchMap: true,
		uiGmapPromise: uiGmapDeferred.promise,
		uiGmapApiPromise: uiGmapApiDeferred.promise,
		map: {  control: {}, 
				center: { latitude: lastLatitude, longitude: lastLongitude }, 
				zoom: 3,
				changer: false,
				waitForRefresh: true,  
				bounds: {	northeast: { latitude: 68, longitude: 100 },	
							southwest: { latitude: -29,	longitude: -91 }}
		},
		lastLatitude: lastLatitude,
		lastLongitude: lastLongitude,
		cordsInParams: false
	}

	var updateMapFromRoutes = function() { 
		if( $routeParams.zoom && !isNaN(parseInt($routeParams.zoom))) {
			restaurantsData.map.zoom = parseInt($routeParams.zoom);
		}  
		

		if($routeParams.latitude && $routeParams.longitude && !isNaN(parseFloat($routeParams.latitude)) && !isNaN(parseFloat($routeParams.longitude))) {
			restaurantsData.lastLatitude = parseFloat($routeParams.latitude) - 20;
			restaurantsData.cordsInParams = true;



			restaurantsData.uiGmapPromise.then(function(data){
				restaurantsData.map.waitForRefresh = false;
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

			restaurantsData.restaurants = data.restaurants;
			restaurantsData.restaurantmarkers = [];

			for (var key in data.restaurants) {
				restaurant = data.restaurants[key]

				restaurantsData.restaurantmarkers.push({
					title: restaurant.name,
					id: parseInt(restaurant.id),
					latitude: restaurant.latitude,
					longitude: restaurant.longitude
			    });
			}
			
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
			restaurantsData.restaurantmarkers = [];
		},
		addSelectMarker: function() {
			restaurantsData.selectmarker = {
				id: 0,
				coords: {
					latitude: restaurantsData.map.center.latitude,
					longitude: restaurantsData.map.center.longitude
				},
				options: { draggable: true }				
			};
		}

	};


 }]);;angular.module('RestaurantManager.Restaurants').factory('RestaurantFactory', ['$resource', 'API', 'LoginFactory', function ($resource, $API, LoginFactory) {
	return $resource($API + 'restaurants/:id', {}, {
		'save': {method: 'POST', headers: { user_token: LoginFactory.user.user_token, 
											auth_token: LoginFactory.user.auth_token} },  
		'put': {method:'PUT'}
	});
 }]);;angular.module('RestaurantManager.Restaurants').factory('TagFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'tags/:id', {}, {});
 }]);;angular.module('templates-dist', ['../views/restaurants.html', '../views/restaurants/create.html', '../views/restaurants/positions.html', '../views/restaurants/search.html']);

angular.module("../views/restaurants.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants.html",
    "<div class=\"row fullheight\">\n" +
    "	<div class=\"col-md-3 fullheight\">\n" +
    "		\n" +
    "		<a href=\"#{{ 's1' | routeSegmentUrl}}\">Home</a>	\n" +
    "		<a href=\"#{{ 's1.search' | routeSegmentUrl}}\">Search</a>\n" +
    "		<a href=\"#{{ 's1.create' | routeSegmentUrl}}\">Create</a>\n" +
    "				\n" +
    "		<div app-view-segment=\"1\"></div>\n" +
    "\n" +
    "		<p data-ng-show=\"!restData.restaurants.length\">Inga restauranger</p>\n" +
    "		<ul>\n" +
    "			<li data-ng-repeat=\"restaurant in restData.restaurants\" >\n" +
    "				{{restaurant.name}}\n" +
    "			</li>\n" +
    "		</ul>\n" +
    "\n" +
    "		<div class=\"paginationBtns\">\n" +
    "			<button class=\"btn btn-link\" data-ng-disabled=\"restData.firstUrl.length < 1 || restData.prevUrl.length < 1\" data-ng-click=\"paginate(restData.firstUrl)\">&lt;&lt;</button>\n" +
    "			<button class=\"btn btn-link\" data-ng-disabled=\"restData.prevUrl.length < 1\" data-ng-click=\"paginate(restData.prevUrl)\">&lt;</button>\n" +
    "			<button class=\"btn btn-link\" data-ng-disabled=\"restData.nextUrl.length < 1\" data-ng-click=\"paginate(restData.nextUrl)\">&gt;</button>\n" +
    "			<button class=\"btn btn-link\" data-ng-disabled=\"restData.lastUrl.length < 1 || restData.nextUrl.length < 1\" data-ng-click=\"paginate(restData.lastUrl)\">&gt;&gt;</button>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"col-md-9 fullheight\">\n" +
    "		<ui-gmap-google-map center='restData.map.center' zoom='restData.map.zoom' bounds=\"restData.map.bounds\" draggable=\"true\" control=\"restData.map.control\">\n" +
    "			<ui-gmap-markers models=\"restData.restaurantmarkers\" coords=\"'self'\" dra icon=\"'icon'\"></ui-gmap-markers>\n" +
    "			<ui-gmap-marker coords=\"restData.selectmarker.coords\" options=\"restData.selectmarker.options\" events=\"restData.selectmarker.events\" idkey=\"restData.selectmarker.id\">\n" +
    "		</ui-gmap-google-map>	\n" +
    "		\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("../views/restaurants/create.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/create.html",
    "<form class=\"form-horizontal creatRestaurant\" name=\"restForm\" novalidate>\n" +
    "	<ul>\n" +
    "		<li data-ng-repeat=\"(key, error) in restData.errorMessage\">\n" +
    "			{{key}}: {{error[0]}}\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "\n" +
    "	\n" +
    "	<div class=\"form-group\" data-ng-class=\"{'has-error': restForm.name.$invalid && restForm.name.$touched}\">\n" +
    "		<label for=\"name\" class=\"col-sm-2 control-label\">Name</label>\n" +
    "		<input type=\"text\" class=\"form-control\" id=\"name\" name=\"name\" data-ng-model=\"restaurant.name\" required placeholder=\"Ex Harrys\">		\n" +
    "	</div>\n" +
    "\n" +
    "	<div class=\"form-group\" data-ng-class=\"{'has-error': restForm.phone.$invalid && restForm.phone.$touched}\">\n" +
    "		<label for=\"phone\" class=\"col-sm-2 control-label\">Phone</label>\n" +
    "		<input type=\"text\" class=\"form-control\" name=\"phone\" data-ng-model=\"restaurant.phone\" required id=\"phone\">		\n" +
    "	</div>\n" +
    "	<div class=\"form-group\" data-ng-class=\"{'has-error': restForm.address.$invalid && restForm.address.$touched}\">\n" +
    "		<label for=\"address\" class=\"col-sm-2 control-label\">Address</label>\n" +
    "		<input type=\"text\" class=\"form-control\" name=\"address\" data-ng-model=\"restaurant.address\" id=\"address\" required placeholder=\"Ex Road 2, Kalmar 333 00\">		\n" +
    "	</div>\n" +
    "	<div class=\"form-group\" data-ng-class=\"{'has-error': restForm.description.$invalid && restForm.description.$touched}\">\n" +
    "		<label for=\"description\" class=\"col-sm-2 control-label\">Description</label>\n" +
    "		<textarea rows=\"3\" type=\"text\" class=\"form-control\" name=\"description\" data-ng-model=\"restaurant.description\" \n" +
    "			required id=\"description\" placeholder=\"Tell us about your restaurant!\"></textarea>		\n" +
    "	</div>\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"longitude\" class=\"col-sm-4 control-label\">Longitude</label>\n" +
    "		<div class=\"col-sm-8\">\n" +
    "			<input type=\"text\" class=\"form-control\" id=\"longitude\" readonly data-ng-model=\"restData.selectmarker.coords.longitude\">				\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"form-group\">\n" +
    "		<label for=\"latitude\" class=\"col-sm-4 control-label\">Latitude</label>\n" +
    "		<div class=\"col-sm-8\">\n" +
    "			<input type=\"text\" class=\"form-control\" id=\"latitude\" readonly data-ng-model=\"restData.selectmarker.coords.latitude\">				\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<ul class=\"tagList\">\n" +
    "		<li data-ng-repeat=\"tag in newTags\">\n" +
    "			{{tag}}\n" +
    "			<button type=\"button\" class=\"btn btn-default btn-xs\">\n" +
    "				<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\" data-ng-click=\"removeTag(tag)\"></span>\n" +
    "			</button>\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "	<div>\n" +
    "		<form class=\"form-inline\">\n" +
    "			<div class=\"form-group\">\n" +
    "				<tags-autocomplete></tags-autocomplete>\n" +
    "			</div>\n" +
    "			<button type=\"submit\" data-ng-click=\"addTag(tagAutocomplete)\" class=\"btn btn-default\">Add</button>\n" +
    "		</form>\n" +
    "	</div>\n" +
    "\n" +
    "	<button type=\"submit\" data-ng-click=\"submit()\" data-ng-disabled=\"restForm.$invalid\" class=\"btn btn-default\">Submit</button>\n" +
    "</form>\n" +
    "");
}]);

angular.module("../views/restaurants/positions.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/positions.html",
    "Info om hur man letar runt. \n" +
    "<p>{{restaurantsError}}</p>\n" +
    "");
}]);

angular.module("../views/restaurants/search.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants/search.html",
    "<div>\n" +
    "	<duv>\n" +
    "		<form data-ng-submit=\"freeSearch(searchWords)\">\n" +
    "			<div class=\"form-group has-feedback\">\n" +
    "				<input class=\"form-control\" data-ng-model=\"searchWords\" />\n" +
    "				<i class=\"glyphicon glyphicon-search form-control-feedback\"></i>\n" +
    "			</div>\n" +
    "		</form>   \n" +
    "	</div>\n" +
    "	<div>\n" +
    "		<form class=\"form-inline\">\n" +
    "			<div class=\"form-group\">\n" +
    "				<tags-autocomplete></tags-autocomplete>\n" +
    "			</div>\n" +
    "			<button type=\"submit\" data-ng-click=\"tagSearch(tagAutocomplete)\" class=\"btn btn-default\">Sök</button>\n" +
    "		</form>\n" +
    "	</div>\n" +
    "	<div>\n" +
    "		<form class=\"form-inline\">\n" +
    "			<div class=\"form-group\">\n" +
    "				<users-autocomplete></users-autocomplete>\n" +
    "				<button type=\"submit\" data-ng-click=\"userSearch(userAutocomplete)\" class=\"btn btn-default\">Sök</button>\n" +
    "			</div>\n" +
    "		</form>\n" +
    "	</div>\n" +
    "		\n" +
    "	<div data-ng-if=\"searchError\" >\n" +
    "		<p>{{searchError}}</p>\n" +
    "	</div>	\n" +
    "</div>");
}]);
