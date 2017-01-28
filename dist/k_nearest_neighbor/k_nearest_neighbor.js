;(function($){

    /**
     * Creating a data set
     *
     * Data set will be a series of rows with the following characteristics
     * [input, input, output]
     * [input, input, output]
     * [input, input, output]
     *
     * First we generate 50 numbers that are between 0 and 100 for our output values
     *
     * Then we generate input values that are +- 20% of the originally generated number to use as input values.
     */
    var max_a = 0;
    var min_a = 0;

    var max_b = 0;
    var min_b = 0;

    var max_c = 0;
    var min_c = 0;

    var outArray = Array.apply(null, {length: 50})
        .map(function(i, current){
            return Math.random() * 100;
        });

    var dataset = Array.apply(null, {length: 50})
        .map(function (i, index){
            var min = outArray[index] - outArray[index] * .2;
            var max = outArray[index] + outArray[index] * .2;

            //Return a data row that represents the [input, input, output]
            return [
                Math.random() * (max - min) + min,
                Math.random() * (max - min) + min,
                outArray[index]
            ];
        });

    var normalized = (function(d){
        var n = Array.apply(null, {length: 50})
            .map(function(i, index){
                return [0,0,0];
            });

        var i = 0;
        for(i = 0; i < d.length; i++){
            if(d[i][0] > max_a) max_a = d[i][0];
            if(d[i][0] < min_a) min_a = d[i][0];

            if(d[i][1] > max_b) max_b = d[i][1];
            if(d[i][1] < min_b) min_b = d[i][1];

            if(d[i][2] > max_c) max_c = d[i][2];
            if(d[i][2] < min_c) min_c = d[i][2];
        }

        for(i = 0; i < d.length; i++){
            n[i][0] = (d[i][0] - min_a) / max_a - min_a;
            n[i][1] = (d[i][1] - min_b) / max_b - min_b;
            n[i][2] = d[i][2];
        }
        return n;
    })(dataset);

    var neighbors = [];

    function knn(s){
        //Normalize sample
        var s0 = (s[0] - min_a) / max_a - min_a;
        var s1 = (s[1] - min_b) / max_b - min_b;

        //Find nearest neighbors
        var c1 = false;
        var c2 = false;

        var distance;
        for(var i = 0; i < normalized.length; i++){
            distance = Math.sqrt(Math.pow((s0 - normalized[i][0]), 2) + Math.pow((s1 - normalized[i][1]), 2));
            if(!c1){
                neighbors[0] = i;
                c1 = [distance, normalized[i][2]];
            }else if(!c2){
                neighbors[1] = i;
                c2 = [distance, normalized[i][2]];
            } else if(distance < c1[0]){
                neighbors[0] = i;
                c1 = [distance, normalized[i][2]];
            } else if(distance < c2[0]){
                neighbors[1] = i;
                c2 = [distance, normalized[i][2]];
            }
        }
        return (c1[1] + c1[1]) / 2;
    }

    var series = [
        {
            name: 'Measurement',
            data: dataset.map(function(i){
                return i[2];
            }),
            lineWidth : 0,
            marker : {
                enabled : true,
                radius : 3
            }
        },
        {
            name: 'Regression Line',
            data: dataset.map(knn),
            lineWidth: 1,
            type: "spline",
            marker: {
                enabled: true,
                radius: 0
            }
        }
    ];

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    $(function(){

        $(dataset).each(function(i, el){
            var row = "<tr><td>" + el[0] + "</td><td>" + el[1] + "</td><td>" + el[2] + "</td></tr>";
            $("#data_table tbody").append(row);
        });

        var chart = new Highcharts.Chart({
            chart:{
                renderTo: 'hc_container'
            },
            title: {
                text: "K Nearest Neighbor Regression"
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

        var data1 = false;
        var data2 = false;

        $("#predict_b").click(function(e){
            var a = $("#pre_1").val();
            var b = $("#pre_2").val();
            var value = knn([a, b]);

            if(data1 && data2){
                data1.update({
                    marker: {
                        enabled: true,
                        radius: 0
                    }
                });
                data2.update({
                    marker: {
                        enabled: true,
                        radius: 0
                    }
                });
            }

            data1 = chart.series[1].data[neighbors[0]];
            data2 = chart.series[1].data[neighbors[1]];

            data1.update({color: "red", marker: {
                enabled: true,
                radius: 5
            }});
            data2.update({color: "red", marker: {
                enabled: true,
                radius: 5
            }});

            chart.yAxis[0].removePlotLine("plot-line-1");

            chart.yAxis[0].addPlotLine({
                value: value,
                color: "red",
                width: 2,
                id: "plot-line-1"
            });
            $("#pre_out").val(value);
        });

        var canvas = $("#quick_prediction")[0];
        var context = canvas.getContext("2d");

        $("#quick_prediction").on({
            "mousemove": function(e){
                var pos = getMousePos(canvas, e);
                console.log(pos);
                $("#pre_1").val(pos.x);
                $("#pre_2").val(pos.y);
                $("#predict_b").click();
            }
        });
    });

})(jQuery);