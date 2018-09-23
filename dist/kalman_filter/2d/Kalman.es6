new class Kalman {
    constructor() {
        this.realNumbers = [];
        this.dirtyNumbers = [];
        this.kalmanPrediction = null;

        var fake_which;

        var real_number_array = [];

        var cest,
            pest = math.ones(2),
            mea,
            kg,
            eest = math.ones(2),
            emea = math.ones(2);
    }
}


;(function($){


    function kalman(m){
        mea = m;

        var eestPlusEmea = math.add(eest, emea);
        kg = math.dotDivide(eest, eestPlusEmea);

        var meaMinusPest = math.subtract(mea, pest);
        var kgTimesMea = math.dotMultiply(kg, meaMinusPest);
        cest = math.add(pest, kgTimesMea);
        pest = cest;

        var emeaPlusEest = math.add(emea, eest);
        var emeaTimesEest = math.dotMultiply(emea, eest);
        eest = math.dotDivide(emeaTimesEest, emeaPlusEest);

        return cest.valueOf();
    }

    function fakeNumber(i, current){
        var min = real_numbers[fake_which][current] - real_numbers[fake_which][current] * .8;
        var max = real_numbers[fake_which][current] + real_numbers[fake_which][current] * .8;
        return Math.random() * (max - min) + min;
    }

    function makeDirtyNumbers(real_number, length) {
        real_numbers[real_number] = Array
            .apply(null, {length: length})
            .map(function(i, current){
                return real_number;
            });
        fake_which = real_number;
        real_number_array.push(real_number);
        dirty_numbers[real_number] = real_numbers[real_number].map(fakeNumber);
    }

    function makeSeries(r1, r2){

        makeDirtyNumbers(r1, 50);
        makeDirtyNumbers(r2, 50);


        var zip = dirty_numbers[r1].map(function(e, i) {
            return [e, dirty_numbers[r2][i]];
        });

        pest = zip[0];

        console.log(dirty_numbers, zip);

        kalman_prediction = zip.map(kalman);
        $("#real1").val(r1);
        $("#real2").val(r2);

        return [{
            name: 'Measurement: ',
            data: zip,
            lineWidth : 0,
            color: 'rgba(119, 152, 191, .5)',
            marker : {
                enabled : true,
                radius : 3
            }
        },{
            name: 'Kalman Prediction',
            data: kalman_prediction,
            color: 'rgba(223, 83, 83, .5)',
            lineWidth: 0,
            marker: {
                enabled: true,
                radius: 5
            }
        }];
    }

    $(function(){
        var series = makeSeries(50, 25);
        $('#hc_container').highcharts({
            chart: {
                type: 'scatter'
            },
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
        var interval;
        $("#measure").click(function(){

            if(typeof(interval) === "number") {
                clearInterval(interval);
                interval = null;
                return;
            }

            interval = setInterval(function() {
                var real1 = Number($("#real1").val());
                var real2 = Number($("#real2").val());
                real_numbers[real_number_array[0]].push(real1);
                real_numbers[real_number_array[1]].push(real2);

                fake_which = real_number_array[0];
                var value1 = fakeNumber(null, real_numbers.length - 1);
                fake_which = real_number_array[1];
                var value2 = fakeNumber(null, real_numbers.length - 1);

                var kvalue = kalman([value1, value2]);

                var chart = $('#hc_container').highcharts();
                if (chart.series.length == 0) {
                    real_numbers = [real];
                    var series = makeSeries(real_numbers[0], real_numbers.length);
                    $(series).each(function (i, s) {
                        chart.addSeries(s);
                    });
                }

                var measurement = chart.series[0];
                var kalmans = chart.series[1];
                var shift = real_numbers[real_number_array[0]].length > 50;

                measurement.addPoint([value1, value2], false, shift);
                kalmans.addPoint(kvalue, false, shift);

                chart.redraw();
            }, 1000);
        });

        $("#real1, #real2").change(function(){
            eest = math.ones(2);
            emea = math.ones(2);
        });
    });
})(jQuery);