angular.module('RestaurantManager.Login').factory('LoginFactory', [ function () {
	
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
}]);