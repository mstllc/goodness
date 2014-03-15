module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      mini_src: {
        options: {
          banner: '/*! Goodness v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          './<%= pkg.name %>.min.js': 'src/<%= pkg.name %>.js'
        }
      }
    },
    sass: {
      develop: {
        options: {
          style: 'expanded',
          lineNumbers: true
        },
        files: {
          'example/styles/style.css' : 'example/styles/style.scss'
        }
      }
    },
    watch: {
      sass: {
        files: ['example/styles/**/*.scss'],
        tasks: ['sass:develop'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['example/index.html'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('develop', ['sass:develop', 'watch']);
};
