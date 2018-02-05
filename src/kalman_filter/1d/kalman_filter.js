;(function($){
    var real_numbers, dirty_numbers, kalman_prediction;

    var cest, pest = 0, mea, kg, eest = 1, emea = 1;
    function kalman(m){
        mea = m;
        kg = eest / (eest + emea);
        cest = pest + kg * (mea - pest);
        pest = cest;
        eest = (emea * eest) / (emea + eest);
        return cest;
    }

    function fakeNumber(i, current){
        var min = real_numbers[current] - real_numbers[current] * .8;
        var max = real_numbers[current] + real_numbers[current] * .8;
        return Math.random() * (max - min) + min;
    }

    function makeSeries(real_number, length){
        real_numbers = Array
            .apply(null, {length: length})
            .map(function(i, current){
                return real_number;
            });

        dirty_numbers = Array.apply(null, {length: length}).map(fakeNumber);

        eest = 1;
        emea = 1;
        pest = dirty_numbers[0];

        kalman_prediction = dirty_numbers.map(kalman);
        $("#real").val(real_number);
        return [{
            name: 'Correct Number',
            data: real_numbers,
            lineWidth : 1,
            type: "spline",
            marker : {
                enabled : false,
                radius : 2
            }
        }, {
            name: 'Measurement',
            data: dirty_numbers,
            lineWidth : 0,
            marker : {
                enabled : true,
                radius : 3
            }
        },{
            name: 'Kalman Prediction',
            data: kalman_prediction,
            lineWidth: 1,
            type: "spline",
            marker: {
                enabled: true,
                radius: 2
            }
        }];
    }

    $(function(){
        var series = makeSeries(50, 50);
        console.log(real_numbers, dirty_numbers, kalman_prediction);
        $('#hc_container').highcharts({
            title: {
                text: "Kalman Filter"
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

        $("#clear").click(function(){
            var chart = $('#hc_container').highcharts();
            while(chart.series.length > 0){
                chart.series[0].remove();
            }
            real_numbers = [];
            dirty_numbers = [];
        });

        $("#measure").click(function(){
            var real = Number($("#real").val());
            var value = fakeNumber(null, real_numbers.length - 1);
            var kvalue = kalman(value);
            var chart = $('#hc_container').highcharts();
            if(chart.series.length == 0){
                real_numbers = [real];
                var series = makeSeries(real_numbers[0], real_numbers.length);
                $(series).each(function(i, s){
                    chart.addSeries(s);
                });
            }
            var correct = chart.series[0];
            var measurement = chart.series[1];
            var kalmans = chart.series[2];
            var shift = real_numbers.length > 50;
            correct.addPoint(real, false, shift);
            measurement.addPoint(value, false, shift);
            kalmans.addPoint(kvalue, false, shift);
            chart.redraw();
            console.log(real_numbers, real, value, dirty_numbers);
        });

        $("#real").change(function(){
            eest = 1, emea = 1;
        });
    });
})(jQuery);