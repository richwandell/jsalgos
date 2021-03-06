;(function($){

    var real_numbers = Array.apply(null, {length: 50}).map(function(i, current){
        return current;
    });

    var measurements = Array.apply(null, {length: 50}).map(function (i, current){
        var min = real_numbers[current] - real_numbers[current] * .8;
        var max = real_numbers[current] + real_numbers[current] * .8;
        return Math.random() * (max - min) + min;
    });

    var linreg = (function(numbers){
        var xsum = 0, ysum = 0, xysum = 0, x2sum = 0, m, b;
        for(var i = 0; i < numbers.length; i++){
            xsum += i;
            ysum += numbers[i];
            xysum += i * numbers[i];
            x2sum += Math.pow(i, 2);
        }
        m = (numbers.length * xysum - xsum * ysum) / (numbers.length * x2sum - Math.pow(xsum, 2));
        b = (ysum - m * xsum) / numbers.length;

        return function(x){
            return b + m * x;
        }
    })(measurements);

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
            return [i, linreg(n)];
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