angular.module('RestaurantManager').config(function(uiGmapGoogleMapApiProvider) {
    
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCLdCLd1hLOdvRVRi0T7791g-UUKQGg1z8',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})