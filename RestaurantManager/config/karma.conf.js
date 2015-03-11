module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: [ 'jasmine' ],
    files: [
      'scripts/vendor/angular.js',
      'scripts/vendor/angular-mocks.js',
      'scripts/vendor/angular-route.js',
      'scripts/app/**/*.js',
      'tests/**/*.js',
      'views/**/*.html'
    ],
    preprocessors: {
      'views/**/*.html': 'ng-html2js'
    },
    reporters: [ 'progress' ],
    colors: true,
    autoWatch: false,
    browsers: [ 'PhantomJS' ],
    singleRun: true,
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor'
    ]
  });
};