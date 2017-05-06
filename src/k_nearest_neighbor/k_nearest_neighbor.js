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
    var max_X = -Infinity;
    var min_X = Infinity;

    var data_length = 100;

    var outArray = Array.apply(null, {length: data_length})
        .map(function(i, current){
            return Math.random() * 100;
        });

    var dataset = Array.apply(null, {length: data_length})
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
        var max_y = -Infinity;
        var min_y = Infinity;

        var n = Array.apply(null, {length: d.length})
            .map(function(i, index){
                return [0,0,0];
            });

        var i;
        for(i = 0; i < d.length; i++){
            if(d[i][0] > max_X) max_X = d[i][0];
            if(d[i][0] < min_X) min_X = d[i][0];

            if(d[i][1] > max_X) max_X = d[i][1];
            if(d[i][1] < min_X) min_X = d[i][1];

            if(d[i][2] > max_y) max_y = d[i][2];
            if(d[i][2] < min_y) min_y = d[i][2];
        }

        for(i = 0; i < d.length; i++){
            n[i][0] = (d[i][0] - min_X) / (max_X - min_X);
            n[i][1] = (d[i][1] - min_X) / (max_X - min_X);
            n[i][2] = (d[i][2] - min_y) / (max_y - min_y);
        }
        return n;
    })(dataset);

    var neighbors = [];

    var canvas, ctx;

    function knn(s){
        //Normalize sample
        var s0 = (s[0] - min_X) / (max_X - min_X);
        var s1 = (s[1] - min_X) / (max_X - min_X);

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
        return ((c1[1] + c2[1]) / 2) * 100;
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

    function canvasRedraw(mouse_x, mouse_y){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(20, 50);
        ctx.lineTo(80, 50);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.lineTo(50, 80);
        ctx.stroke();

        ctx.fillText("0", 2, 10);
        ctx.fillText("25", 45, 10);
        ctx.fillText("25", 2, 52);

        ctx.fillText("50", 86, 10);
        ctx.fillText("50", 2, 98);

        ctx.fillText("75", 45, 98);
        ctx.fillText("75", 86, 52);

        ctx.fillText("100", 82, 98);
        if(mouse_x && mouse_y){
            var diffs = [
                // 0
                Math.sqrt(Math.pow(mouse_x, 2) + Math.pow(mouse_y, 2)),
                // 25 top
                Math.sqrt(Math.pow(mouse_x - 50, 2) + Math.pow(mouse_y, 2)),
                // 50 top right
                Math.sqrt(Math.pow(mouse_x - 100, 2) + Math.pow(mouse_y, 2)),
                // 75 right
                Math.sqrt(Math.pow(mouse_x - 100, 2) + Math.pow(mouse_y - 50, 2)),
                // 100
                Math.sqrt(Math.pow(mouse_x - 100, 2) + Math.pow(mouse_y - 100, 2)),
                // 75 bottom
                Math.sqrt(Math.pow(mouse_x - 50, 2) + Math.pow(mouse_y - 100, 2)),
                // 50 bottom left
                Math.sqrt(Math.pow(mouse_x, 2) + Math.pow(mouse_y - 100, 2)),
                // 25 left
                Math.sqrt(Math.pow(mouse_x, 2) + Math.pow(mouse_y - 50, 2)),
            ];
            console.log(diffs);
            var min = Math.min.apply(null, diffs);
            var ind = diffs.indexOf(min);
            switch(ind){
                case 0:
                    ctx.beginPath();
                    ctx.arc(5, 5, 10, 0, 2*Math.PI);
                    ctx.stroke();
                    break;

                case 1:
                    ctx.beginPath();
                    ctx.arc(50, 5, 10, 0, 2*Math.PI);
                    ctx.stroke();
                    break;

                case 2:
                    ctx.beginPath();
                    ctx.arc(90, 5, 10, 0, 2*Math.PI);
                    ctx.stroke();
                    break;

                case 3:
                    ctx.beginPath();
                    ctx.arc(90, 50, 10, 0, 2*Math.PI);
                    ctx.stroke();
                    break;

                case 4:
                    ctx.beginPath();
                    ctx.arc(90, 95, 10, 0, 2*Math.PI);
                    ctx.stroke();
                    break;

                case 5:
                    ctx.beginPath();
                    ctx.arc(50, 95, 10, 0, 2*Math.PI);
                    ctx.stroke();
                    break;

                case 6:
                    ctx.beginPath();
                    ctx.arc(5, 95, 10, 0, 2*Math.PI);
                    ctx.stroke();
                    break;

                case 7:
                    ctx.beginPath();
                    ctx.arc(5, 50, 10, 0, 2*Math.PI);
                    ctx.stroke();
                    break;
            }
        }
    }

    $(function(){
        canvas = $("#quick_prediction")[0];
        ctx = canvas.getContext("2d");

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

        canvasRedraw();

        $("#quick_prediction").on({
            "mousemove": function(e){
                var pos = getMousePos(canvas, e);

                $("#pre_1").val(pos.x);
                $("#pre_2").val(pos.y);
                $("#predict_b").click();
                canvasRedraw(pos.x, pos.y);
            }
        });
    });

})(jQuery);