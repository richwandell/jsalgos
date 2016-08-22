module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            dev: {
                files: [{
                    cwd: 'node_modules/jquery/dist/',
                    src: 'jquery.min.js',
                    dest: 'dist/scripts/',
                    expand: true
                }, {
                    cwd: 'src/kalman_filter/',
                    src: '*',
                    dest: 'dist/kalman_filter/',
                    expand: true
                }, {
                    cwd: 'node_modules/highcharts/themes/',
                    src: '*',
                    dest: 'dist/scripts/highcharts/themes/',
                    expand: true
                }, {
                    cwd: 'node_modules/highcharts/',
                    src: 'highcharts.js',
                    dest: 'dist/scripts/highcharts/',
                    expand: true
                }, {
                    cwd: 'node_modules/mathjs/dist/',
                    src: 'math.js',
                    dest: 'dist/scripts/',
                    expand: true
                }]
            }
        },
        watch: {
            vendor: {
                files: ['src/kalman_filter/*'],
                tasks: ['copy:dev']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
};