;(function($){
    /**
     * Generate a data set with data points centered around centroids
     *
     * The data points will all be randomly generated within max_range of the centroids
     *
     * This generated data will be used in the clustering based prediction to attempt to determine a class that
     * is associated with a centroid
     *
     * (Centroids below are only used for initial data generation, new centroids are randomly selected)
     *
     */
    var chart;
    var max_range = 80;
    var centroids = [
        [10, 10],
        [150, 50],
        [150, 200],
        [300, 300],
        [300, 100],
        [0, 300]
    ];
    //Randomly generate 20 points near the above centroids
    var dataset = centroids
        .map(function(cent){
            var xmax = cent[0] + max_range;
            var xmin = cent[0] - max_range;
            var ymax = cent[1] + max_range;
            var ymin = cent[1] - max_range;

            return Array
                .apply(null, {length: 20})
                .map(function(i, index){
                    return [
                        Math.random() * (xmax - xmin) + xmin,
                        Math.random() * (ymax - ymin) + ymin
                    ];
                });
        })
        .reduce(function(a, b){ return a.concat(b); })
        .sort(function(a, b){ return a[0] - b[0]; });

    //Randomly pick a center point for our clusters (we don't know about the above centroids)
    var clusters = centroids.map(function(cent){
        return [dataset[Math.floor(Math.random() * dataset.length - 1)]];
    });
    var series = [
        {
            name: 'Measurement',
            data: dataset,
            lineWidth : 0,
            marker : {
                enabled : true,
                radius : 3
            }
        }
    ];
    var colors = ['red', 'green', 'yellow', 'orange', 'purple', 'blue'];
    var iterations = 0;
    var interval;
    var old_error = centroids.map(function(cent){return Infinity;});

    /**
     * Euclidean distance
     *
     * @param a
     * @param b
     * @returns {number}
     */
    function dist(a, b){
        var root = 0;
        for(var i = 0; i < a.length; i++){
            root += Math.pow((a[i] - b[i]), 2);
        }
        return Math.sqrt(root);
    }

    /**
     * Run our k Means algorithm
     * @param c
     * @returns {Array}
     */
    function kMeans(c){
        var center, i, j;
        var new_clusters = [];
        var new_error = centroids.map(function(){return 0;});
        centroids = [];
        //Determine the center point of each cluster
        for(i = 0; i < c.length; i++){
            var clu = c[i];
            var x = 0, y = 0;
            for(j = 0; j < clu.length; j++){
                x += clu[j][0];
                y += clu[j][1];
            }
            center = [x / clu.length, y / clu.length];
            new_clusters.push([center]);
            centroids.push(center);
        }
        //Each data point will find it's distance to the cluster center points
        for(i = 0; i < dataset.length; i++){
            var dp = dataset[i];
            var closest = false;
            var closest_distance = Infinity;
            for(j = 0; j < centroids.length; j++){
                center = centroids[j];
                var distance = dist(center, dp);
                if(distance < closest_distance){
                    closest = j;
                    closest_distance = distance;
                    new_error[j] = Number(new_error[j]) + Math.pow(closest_distance, 2);
                }
            }
            new_clusters[closest].push(dp);
        }
        //Check for our stopping condition using the
        var same = true;
        for(i = 0; i < new_error.length; i++){
            if(new_error[i] !== old_error[i]){
                same = false;
                old_error = new_error;
                break;
            }
        }
        if(same){
            clearInterval(interval);
            $("#iterations").html(iterations + " Convergence!");
        }
        return new_clusters;
    }

    function tick(){
        var series;

        for(var x = 0; x < clusters.length; x++){
            series = chart.get('cluster-' + x);
            if(series){
                series.remove();
            }
        }

        series = chart.get('centroids');
        if(series){
            series.remove();
        }
        $("#iterations").html(iterations);
        clusters = kMeans(clusters);
        for(var x = 0; x < clusters.length; x++) {
            chart.addSeries({
                color: colors[x],
                id: 'cluster-' + x,
                name: 'Cluster ' + x,
                data: clusters[x].sort(function(a, b){
                    return a[0] - b[0];
                }),
                lineWidth : 0,
                marker : {
                    enabled : true,
                    radius : 3,
                    symbol: 'circle'
                }
            })
        }

        chart.addSeries({
            color: 'black',
            id: 'centroids',
            name: 'Centroids',
            data: centroids.sort(function(a, b){
                return a[0] - b[0];
            }),
            lineWidth: 0,
            marker: {
                enabled: true,
                radius: 7,
                symbol: 'circle'
            }
        });
        iterations++;
    }


    $(function(){


        clusters = kMeans(clusters);
        for(var x = 0; x < clusters.length; x++) {
            series.push({
                color: colors[x],
                id: 'cluster-' + x,
                name: 'Cluster ' + x,
                data: clusters[x].sort(function(a, b){
                    return a[0] - b[0];
                }),
                lineWidth : 0,
                marker : {
                    enabled : true,
                    radius : 3,
                    symbol: 'circle'
                }
            })
        }

        chart = new Highcharts.Chart({
            chart:{
                renderTo: 'hc_container'
            },
            title: {
                text: "K Means Clustering"
            },
            yAxis: {
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: series,
            plotOptions:{
                series: {
                    animation: false
                }
            }
        });


        $("#run_button").click(function(e){
            clearInterval(interval);
            interval = setInterval(tick, 1000);
        });
        $("#stop_button").click(function(e){
            clearInterval(interval)
        });
        interval = setInterval(tick, 1000);
    });

})(jQuery);