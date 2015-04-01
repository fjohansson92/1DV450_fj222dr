angular.module('RestaurantManager.Login').controller('LoginCtrl', ['$scope', '$location', '$routeParams', 'LoginFactory', '$routeSegment', function ($scope, $location, $routeParams, LoginFactory, $routeSegment) {

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
		url = "http://178.62.233.41/api/v1/authenticate?user_token=" + user_token + '&callback=' + callback;
		window.location.href = url;
	}

	$scope.logout = function() {
		LoginFactory.logout();
		$location.path($routeSegment.getSegmentUrl('s1'));
	}
	
}]);