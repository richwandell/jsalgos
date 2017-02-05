;(function($){
    /**
     * Generate a data set with 5 centroids.
     * The data points will all be randomly generated within max_range of the centroids
     *
     * This generated data will be used in the clustering based prediction to attempt to determine a class that
     * is associated with a centroid
     *
     * (Pretend we don't already know our centroids)
     *
     */
    var max_range = 80;
    var centroids = [
        //Class 1
        [10, 10],
        //Class 2
        [150, 50],
        //Class 3
        [150, 200],
        //Class 4
        [300, 300],
        //Class 5
        [300, 100]
    ];
    var dataset = (function(c){
        var points = [];
        for(var i = 0; i < c.length; i++){
            for(var j = 0; j < 20; j++){
                var xmax = c[i][0] + max_range;
                var xmin = c[i][0] - max_range;
                var ymax = c[i][1] + max_range;
                var ymin = c[i][1] - max_range;
                points.push([
                    Math.random() * (xmax - xmin) + xmin,
                    Math.random() * (ymax - ymin) + ymin
                ]);
            }
        }
        return points;
    })(centroids);
    var classes = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];

    var K = 5;

    //Randomly choose centroids as our starting point for the K Means clustering
    var clusters = [
        [dataset[Math.random() * dataset.length - 1]],
        [dataset[Math.random() * dataset.length - 1]],
        [dataset[Math.random() * dataset.length - 1]],
        [dataset[Math.random() * dataset.length - 1]],
        [dataset[Math.random() * dataset.length - 1]]
    ];



    var series = [
        {
            name: 'Measurement',
            data: dataset,
            lineWidth : 0,
            marker : {
                enabled : true,
                radius : 3
            }
        },
        // {
        //     name: 'Regression Line',
        //     data: dataset.map(knn),
        //     lineWidth: 1,
        //     type: "spline",
        //     marker: {
        //         enabled: true,
        //         radius: 0
        //     }
        // }
    ];

    $(function(){

        var chart = new Highcharts.Chart({
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
            series: series
        });

        $("#run_button").click(function(e){

        });
    });

})(jQuery);