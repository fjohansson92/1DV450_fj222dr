angular.module('RestaurantManager.Restaurants').factory('RestaurantDataFactory', [ '$q', '$routeParams', function ($q, $routeParams) {
	
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
 }]);