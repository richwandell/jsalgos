var webpack = require('webpack');

module.exports = function (grunt) {

    function wConfig(options) {
        var config = {
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
        };

        for(var k in options) {
            config[k] = options[k];
        }
        return config;
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            huffman_coding: ['dist/huffman_coding'],
            mandelbrot_set: ['dist/mandelbrot_set'],
            fractal_tree: ['dist/fractal_tree'],
            image_resizing: ['dist/image_resizing'],
            edge_detection: ['dist/edge_detection'],
            dist: ['dist'],
            knn: ['dist/k_nearest_neighbor'],
            logistic_regression: ['dist/logistic_regression'],
            linear_regression: ['dist/linear_regression'],
            kalman: ['dist/kalman_filter'],
            ann: ['dist/a_nn'],
            projective_geometry: ['dist/projective_geometry'],
            particle_filter: ['dist/particle_filter'],
            mnb: ['dist/mnb']
        },
        copy: {
            huffman_coding: {
                files: [{
                    cwd: 'src/huffman_coding',
                    src: ['test.html'],
                    dest: 'dist/huffman_coding',
                    expand: true
                }]
            },
            mandelbrot_set: {
                files: [{
                    cwd: 'src/mandelbrot_set',
                    src: ['*.html'],
                    dest: 'dist/mandelbrot_set',
                    expand: true
                }]
            },
            fractal_tree: {
                files: [{
                    cwd: 'src/fractal_tree',
                    src: ['*.html'],
                    dest: 'dist/fractal_tree',
                    expand: true
                }]
            },
            projective_geometry: {
                files: [{
                    cwd: 'src/projective_geometry',
                    src: ['test.html'],
                    dest: 'dist/projective_geometry',
                    expand: true
                }]
            },
            image_resizing: {
                files: [{
                    cwd: 'src/image_resizing',
                    src: ['*.html', '*.png'],
                    dest: 'dist/image_resizing',
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
            },
            particle_filter: {
                files: [{
                    cwd: 'src/particle_filter',
                    src: ['**/*'],
                    dest: 'dist/particle_filter',
                    expand: true
                }]
            },
            mnb: {
                files: [
                    {
                        cwd: 'src/mnb',
                        src: ['**/*'],
                        dest: 'dist/mnb',
                        expand: true
                    }
                ]
            }
        },
        watch: {
            huffman_coding: {
                files: ['src/huffman_coding/**/*'],
                tasks: ['clean:huffman_coding', 'webpack:huffman_coding', 'copy:huffman_coding', 'copy:dependencies']
            },
            mandelbrot_set: {
                files: ['src/mandelbrot_set/**/*'],
                tasks: ['clean:mandelbrot_set', 'webpack:mandelbrot_set', 'copy:mandelbrot_set', 'copy:dependencies']
            },
            fractal_tree: {
                files: ['src/fractal_tree/**/*'],
                tasks: ['clean:fractal_tree', 'webpack:fractal_tree', 'copy:fractal_tree', 'copy:dependencies']
            },
            image_resizing: {
                files: ['src/image_resizing/**/*'],
                tasks: ['clean:image_resizing', 'webpack:image_resizing', 'copy:image_resizing', 'copy:dependencies']
            },
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
                tasks: ['clean:kalman', 'copy:kalman', 'webpack:kalman',  'copy:dependencies']
            },
            ann: {
                files: ['src/a_nn/**/*'],
                tasks: ['clean:ann', 'copy:ann', 'copy:dependencies']
            },
            projective_geometry: {
                files: ['src/projective_geometry/**/*'],
                tasks: ['clean:projective_geometry', 'webpack:projective_geometry', 'copy:projective_geometry', 'copy:dependencies']
            },
            mnb: {
                files: ['src/mnb/**/*'],
                tasks: ['clean:mnb', 'webpack:mnb', 'copy:mnb', 'copy:dependencies']
            }
        },
        webpack: {
            huffman_coding: wConfig({
                entry: ['./src/huffman_coding/Huffman.es6'],
                output: {filename: './dist/huffman_coding/Huffman.js'}
            }),
            mandelbrot_set: wConfig({
                entry: ['./src/mandelbrot_set/Mandelbrot.es6'],
                output: {filename: './dist/mandelbrot_set/Mandelbrot.js'}
            }),
            fractal_tree: wConfig({
                entry: ['./src/fractal_tree/FractalTree.es6'],
                output: {filename: './dist/fractal_tree/FractalTree.js'}
            }),
            kalman: wConfig({
                entry: ['./src/kalman_filter/2d/Kalman.es6'],
                output: {filename: './dist/kalman_filter/2d/kalman_filter.js'}
            }),
            image_resizing: wConfig({
                entry: ['./src/image_resizing/ImageResizing.es6'],
                output: {filename: './dist/image_resizing/ImageResizing.js'}
            }),
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