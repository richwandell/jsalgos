;(function($){
    var real_number = 50;
    var real_numbers = Array.apply(null, {length: 100}).map(function(){return real_number});

    var dirty_numbers = Array.apply(null, {length: 100}).map(function(i, current){
        var min = real_number - Math.floor(real_number * .8);
        var max = real_number + Math.ceil(real_number * .8);
        return Math.round(Math.random() * (max - min) + min);
    });

    var cest, pest = 0, mea, kg, eest = 1, emea = 1;
    function kalman(m){
        mea = m;
        kg = eest / (eest + emea);
        cest = pest + kg * (mea - pest);
        pest = cest;
        eest = (emea * eest) / (emea + eest);
        return cest;
    }


    $(function(){
        $('#hc_container').highcharts({
            title: {
                text: "Simple Kalman Filter"
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
            series: [{
                name: 'Correct Number: ' + real_number,
                data: real_numbers,
                lineWidth : 0,
                marker : {
                    enabled : true,
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
                data: dirty_numbers.map(kalman),
                lineWidth: 1,
                marker: {
                    enabled: true,
                    radius: 2
                }
            }]
        });
    });
})(jQuery);