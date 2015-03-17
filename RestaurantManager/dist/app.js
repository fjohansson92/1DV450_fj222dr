angular.module('RestaurantManager.Restaurants', []);;angular.module('RestaurantManager', [
										'ngRoute',
										'ngAnimate',
										'route-segment', 
										'view-segment',
										'ngResource',
										'uiGmapgoogle-maps',
									 	'RestaurantManager.Restaurants'
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


    .segment('s1', {
    	templateUrl: 'views/restaurants.html',
    	controller: 'RestaurantCtrl'
    })

    .within()
    	.segment('search', {
    		controller: 'SearchCtrl',
			templateUrl: 'views/restaurants/search.html'
    	})


    	.segment('home/:latitude?/:longitude?/:zoom?', {
    		controller: 'PositionCtrl',
			templateUrl: 'views/restaurants/positions.html',
			'default': true
    	})

   	$routeProvider.otherwise({redirectTo: '/restaurants'});
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
		console.log("?");
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

}]);;angular.module('RestaurantManager.Restaurants').controller('SearchCtrl', ['$scope', 'RestaurantFactory', 'RestaurantDataFactory', '$location', 
																   function ($scope, RestaurantFactory, RestaurantDataFactory, $location) {

	$scope.restData = RestaurantDataFactory.restaurantsData;
	RestaurantDataFactory.updateMapFromRoutes();

	$scope.search = function(searchWords) {

		$location.search('search', searchWords).replace();

		$scope.latestSearch = searchWords;

		q = searchWords.replace(/\s/g, ' ')
		promise = RestaurantFactory.get({q: q});
		promise.$promise.then(function(data) {
			RestaurantDataFactory.setRestaurantData(data);	
		});
	}



}]);;angular.module('RestaurantManager.Restaurants').directive('temp', function () {
	return {
		template: 'test test test'
	}
});angular.module('RestaurantManager.Restaurants').factory('PositionFactory', ['$resource', 'API', function ($resource, $API) {
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
		}

	};


 }]);;angular.module('RestaurantManager.Restaurants').factory('RestaurantFactory', ['$resource', 'API', function ($resource, $API) {
	return $resource($API + 'restaurants/:id', {}, {
		'put':    {method:'PUT'}
	});
 }]);;angular.module('templates-dist', ['../views/restaurants.html', '../views/restaurants/positions.html', '../views/restaurants/search.html']);

angular.module("../views/restaurants.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("../views/restaurants.html",
    "<div class=\"row fullheight\">\n" +
    "	<div class=\"col-md-3 fullheight\">\n" +
    "		\n" +
    "		<a href=\"#{{ 's1' | routeSegmentUrl}}\">Home</a>	\n" +
    "		<a href=\"#{{ 's1.search' | routeSegmentUrl}}\">Search</a>\n" +
    "\n" +
    "		<div app-view-segment=\"1\"></div>\n" +
    "\n" +
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
    "		<ui-gmap-google-map center='restData.map.center' zoom='restData.map.zoom' bounds=\"restData.map.bounds\" control=\"restData.map.control\">\n" +
    "			<ui-gmap-markers models=\"restData.restaurantmarkers\" coords=\"'self'\" icon=\"'icon'\"></ui-gmap-markers>\n" +
    "		</ui-gmap-google-map>	\n" +
    "	</div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
    "\n" +
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
    "    <form data-ng-submit=\"search(searchWords)\">\n" +
    "        <div class=\"form-group has-feedback\">\n" +
    "        <input class=\"form-control\" data-ng-model=\"searchWords\" />\n" +
    "         <i class=\"glyphicon glyphicon-search form-control-feedback\"></i>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "    <p data-ng-if=\"latestSearch\">\n" +
    "        Result for search: {{latestSearch}}\n" +
    "    </p>\n" +
    "</div>");
}]);
