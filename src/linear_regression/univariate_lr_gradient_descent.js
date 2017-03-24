;(function($) {

    var real_numbers = Array.apply(null, {length: 50}).map(function (i, current) {
        return current;
    });

    //x = 0 - 50, y = random
    var measurements = Array.apply(null, {length: 50}).map(function (i, current) {
        var min = real_numbers[current] - real_numbers[current] * .8;
        var max = real_numbers[current] + real_numbers[current] * .8;
        return Math.random() * (max - min) + min;
    });

    var training_examples = measurements
        .map(function (n, i) {
            return [i, n];
        });

    function line(x) {
        return b + m * x;
    }

    function cost(points) {
        var error = 0, i, x, y;
        for (i = 0; i < points.length; i++) {
            x = points[i][0];
            y = points[i][1];
            error += Math.pow((y - line(x)), 2);
        }
        return error / points.length;
    }

    var ni = 0, c = 0, maxi = 500, a = 0.0001;
    var bestB = 0, bestM = 0, bestC = Infinity, b = measurements[0], m = 0;
    do{
        //keep track of how many times we go through the dataset
        ni++;

        for(var i = 0; i < training_examples.length; i ++){
            var example = training_examples[i];
            var lineI = line(example[0]);
            var diff = (example[1] - lineI);
            //update the weights
            b = b + (a * diff);
            m = m + (a * diff * example[0]);
        }
        //compute the mean squared error
        c = cost(training_examples);
        //keep track of the best possible answer
        if(c < bestC){
            bestB = b;
            bestM = m;
            bestC = c;
        }
    }while(c > 100 && ni < maxi);
    b = bestB;
    m = bestM;


    var series = [{
        name: 'Measurement',
        data: measurements,
        lineWidth : 1,
        type: 'spline',
        color: 'palevioletred',
        marker : {
            enabled : true,
            radius : 3
        }
    },{
        name: 'Regression Line',
        data: real_numbers.map(function(n, i){
            return line(i);
        }),
        lineWidth: 1,
        type: "spline",
        color: 'steelblue',
        marker: {
            enabled: true,
            radius: 2
        }
    }];

    $(function(){

        $('#hc_container').highcharts({
            title: {
                text: "Linear Regression"
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
    });
})(jQuery);