angular.module('RestaurantManager.Login').factory('LoginFactory', [ function () {
	
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
					loggedin: false
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
		}  
	}	
}]);