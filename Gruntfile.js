module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        copy: {
            dev: {
                files: [{
                    cwd: 'node_modules/papaparse/',
                    src: 'papaparse.min.js',
                    dest: 'dist/scripts/',
                    expand: true
                },{
                    cwd: 'node_modules/numeric/',
                    src: 'numeric-1.2.6.min.js',
                    dest: 'dist/scripts/',
                    expand: true
                },{
                    cwd: 'node_modules/jquery/dist/',
                    src: 'jquery.min.js',
                    dest: 'dist/scripts/',
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
                }, {
                    cwd: 'src/',
                    src: ['*.js', '**'],
                    dest: 'dist/',
                    expand: true
                }]
            }
        },
        watch: {
            vendor: {
                files: ['src/**/*.*'],
                tasks: ['webpack', 'copy:dev']
            }
        },
        webpack: {
            linear_regression:  {
                entry: [
                    './src/linear_regression/bgdVsgd/Main.es6'
                ],
                output: {
                    filename: './dist/linear_regression/bgdVsgd/app.js'
                },
                module: {
                    loaders: [{
                        exclude: /node_modules/,
                        loader: 'babel-loader'
                    }]
                },
                resolve: {
                    extensions: ['.es6', '.js', '.jsx']
                },
                stats: {
                    colors: true
                },
                progress: false,
                inline: false,
                devtool: 'source-map'
            },
            worker: {
                entry: [
                    './src/linear_regression/bgdVsgd/Worker.es6'
                ],
                output: {
                    filename: './dist/linear_regression/bgdVsgd/Worker.js'
                },
                module: {
                    loaders: [{
                        exclude: /node_modules/,
                        loader: 'babel-loader'
                    }]
                },
                resolve: {
                    extensions: ['.es6', '.js', '.jsx']
                },
                stats: {
                    colors: true
                },
                progress: false,
                inline: false,
                devtool: 'source-map'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-webpack');
};