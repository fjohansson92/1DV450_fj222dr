angular.module('RestaurantManager.Login').directive('loginMenu', ['LoginFactory', function (LoginFactory) {
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
