angular.module('RestaurantManager').config(function(uiGmapGoogleMapApiProvider) {
    
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyBmjjMKhsChjnsU63RzxJat-jOZhoZb5xQ',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})