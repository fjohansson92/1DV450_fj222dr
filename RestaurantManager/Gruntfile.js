'use strict';
module.exports = function (grunt) {
  
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          hostname: 'localhost',
          port: 8080
        }
      }
    },
    bower: {
      install: {
        options: {
          install: true,
          copy: false,
          targetDir: './libs',
          cleanTargetDir: true
        }
      }
    },
    karma: {
      options: {
        configFile: 'config/karma.conf.js'
      },
      unit: {
        singleRun: true
      },
         
      continuous: {
        singleRun: false,
        autoWatch: true
      }
    },
    html2js: {
      dist: {
        src: [ 'views/**/*.html' ],
        dest: 'tmp/templates.js'
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [ 'scripts/app/**/*.js', 'tmp/*.js' ],
        dest: 'dist/app.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/app.js': [ 'dist/app.js' ]
        },
        options: {
          mangle: false
        }
      }
    },
    clean: {
      temp: {
        src: [ 'tmp' ]
      }
    },
    watch: {
      dev: {
        files: [ 'Gruntfile.js', 'scripts/app/**/*.js', '*.html' ],
        tasks: [ 'karma:unit', 'html2js:dist', 'concat:dist', 'clean:temp' ],
        options: {
          atBegin: true
        }
      },
      min: {
        files: [ 'Gruntfile.js', 'scripts/app/**/*.js', '*.html' ],
        tasks: [ 'karma:unit', 'html2js:dist', 'concat:dist', 'clean:temp', 'uglify:dist' ],
        options: {
          atBegin: true
        }
      }
    }
    
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('dev', [ 'bower', 'connect:server', 'watch:dev' ]);
  grunt.registerTask('test', [ 'bower', 'karma:continuous' ]);
  grunt.registerTask('minified', [ 'bower', 'connect:server', 'watch:min' ]);
  grunt.registerTask('package', [ 'bower', 'karma:unit', 'html2js:dist', 'concat:dist', 'uglify:dist', 'clean:temp' ]);


};