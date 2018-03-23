var webpack = require('webpack');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            edge_detection: ['dist/edge_detection'],
            dist: ['dist'],
            knn: ['dist/k_nearest_neighbor'],
            logistic_regression: ['dist/logistic_regression'],
            linear_regression: ['dist/linear_regression'],
            kalman: ['dist/kalman_filter'],
            ann: ['dist/a_nn'],
            projective_geometry: ['dist/projective_geometry']
        },
        copy: {
            projective_geometry: {
                files: [{
                    cwd: 'src/projective_geometry',
                    src: ['test.html'],
                    dest: 'dist/projective_geometry',
                    expand: true
                }]
            },
            edge_detection: {
                files: [{
                    cwd: 'src/edge_detection',
                    src: ['sobel/test.html', 'sobel/*.jpg'],
                    dest: 'dist/edge_detection',
                    expand: true
                }]
            },
            dependencies: {
                files: [{
                    cwd: 'node_modules/gist-async/js/',
                    src: 'gist-async.min.js',
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
                }]
            },
            ann: {
                files: [{
                    cwd: 'src/a_nn',
                    src: ['**/*'],
                    dest: 'dist/a_nn',
                    expand: true
                }]
            },
            kalman: {
                files: [{
                    cwd: 'src/kalman_filter',
                    src: ['**/*'],
                    dest: 'dist/kalman_filter',
                    expand: true
                }]
            },
            knn: {
                files: [{
                    cwd: 'src/k_nearest_neighbor',
                    src: ['*.*'],
                    dest: 'dist/k_nearest_neighbor',
                    expand: true
                }]
            },
            logistic_regression: {
                files: [{
                    cwd: 'src/logistic_regression',
                    src: ['*.html', '*.png'],
                    dest: 'dist/logistic_regression',
                    expand: true
                }]
            },
            linear_regression: {
                files: [{
                    cwd: 'src/linear_regression/bgdVsgd',
                    src: ['test.html', 'gd.png'],
                    dest: 'dist/linear_regression/bgdVsgd',
                    expand: true
                }, {
                    cwd: 'src/linear_regression/ols',
                    src: ['*.*'],
                    dest: 'dist/linear_regression/ols',
                    expand: true
                }]
            }
        },
        watch: {
            edge: {
                files: ['src/edge_detection/**/*'],
                tasks: ['clean:edge_detection', 'webpack:edge_detection', 'webpack:edge_detection_worker',
                    'copy:edge_detection', 'copy:dependencies']
            },
            knn: {
                files: ['src/k_nearest_neighbor/**/*'],
                tasks: ['clean:knn', 'copy:knn', 'copy:dependencies']
            },
            logistic_regression: {
                files: ['src/logistic_regression/**/*'],
                tasks: ['clean:logistic_regression', 'webpack:logistic_regression', 'copy:logistic_regression',
                    'copy:dependencies']
            },
            linear_regression: {
                files: ['src/linear_regression/**/*'],
                tasks: ['clean:linear_regression', 'webpack:linear_regression', 'webpack:linear_regression_worker',
                    'copy:linear_regression', 'copy:dependencies']
            },
            kalman_filter: {
                files: ['src/kalman_filter/**/*'],
                tasks: ['clean:kalman', 'copy:kalman', 'copy:dependencies']
            },
            ann: {
                files: ['src/a_nn/**/*'],
                tasks: ['clean:ann', 'copy:ann', 'copy:dependencies']
            },
            projective_geometry: {
                files: ['src/projective_geometry/**/*'],
                tasks: ['clean:projective_geometry', 'webpack:projective_geometry', 'copy:projective_geometry', 'copy:dependencies']
            }
        },
        webpack: {
            projective_geometry: {
                entry: [
                    './src/projective_geometry/Project.es6'
                ],
                output: {
                    filename: './dist/projective_geometry/Project.js'
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
                devtool: 'source-map',
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        },
                        output: {
                            comments: false
                        },
                        sourceMap: true
                    })
                ]
            },
            edge_detection: {
                entry: [
                    './src/edge_detection/sobel/Edge.es6'
                ],
                output: {
                    filename: './dist/edge_detection/sobel/edge.js'
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
                devtool: 'source-map',
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        },
                        output: {
                            comments: false
                        },
                        sourceMap: true
                    })
                ]
            },
            edge_detection_worker: {
                entry: [
                    './src/edge_detection/sobel/Worker.es6'
                ],
                output: {
                    filename: './dist/edge_detection/sobel/worker.js'
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
                devtool: 'source-map',
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        },
                        output: {
                            comments: false
                        },
                        sourceMap: true
                    })
                ]
            },
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
                devtool: 'source-map',
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false,
                        },
                        output: {
                            comments: false,
                        },
                        sourceMap: true
                    })
                ]
            },
            linear_regression_worker: {
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
                devtool: 'source-map',
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false,
                        },
                        output: {
                            comments: false,
                        },
                        sourceMap: true
                    })
                ]
            },
            mnb: {
                entry: [
                    './src/mnb/Mnb.jsx'
                ],
                output: {
                    filename: './dist/mnb/mnb.js'
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
            logistic_regression:  {
                entry: [
                    './src/logistic_regression/Main.es6'
                ],
                output: {
                    filename: './dist/logistic_regression/app.js'
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
                devtool: 'source-map',
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false,
                        },
                        output: {
                            comments: false,
                        },
                        sourceMap: true
                    })
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-webpack');
};