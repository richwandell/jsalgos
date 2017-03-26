;(function($){

    var worker = new Worker('worker.js');

    var input_layer = [
        {name: 'Thinking...', color: 'steelblue'},
        {name: 'Thinking...', color: 'steelblue'}
    ];

    var hidden_layer = [
        {name: 'Thinking...', color: 'palevioletred'},
        {name: 'Thinking...', color: 'palevioletred', children: input_layer},
        {name: 'Thinking...', color: 'palevioletred'}
    ];

    var output = {
        name: 'output',
        color: "steelblue",
        children: hidden_layer
    };

    var trainingData = [
        [3, 5],
        [5, 1],
        [10, 2],
        [1, 12]
    ];

    var trainingAnswers = [[75], [82], [93], [10]];

    var tmax = math.max(trainingData);
    var X = math.dotDivide(trainingData, tmax);
    var y = math.dotDivide(trainingAnswers, 100);

    function drawD3tree(treeData){
        d3.select("svg").remove();

        var canvas = d3.select("#d3_container").append("svg")
            .attr("width", $(window).width() / 2)
            .attr("height", 500)
            .append("g")
            .attr("transform", "translate(50, 50)");

        var tree = d3.layout.tree()
            .size([400, 400]);

        var nodes = tree.nodes(treeData);
        var links = tree.links(nodes);

        var two = links.slice(-2);

        two.forEach(function(l){
            links.push({
                source: l.target,
                target: links[0].target
            });
            links.push({
                source: l.target,
                target: links[2].target
            });
        });

        var node = canvas.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d){
                return "translate(" + (-d.y + 400) + ", " + d.x + ")";
            });

        node.append("circle")
            .attr("r", 10)
            .attr("stroke", function(d){
                return d.color;
            })
            .attr("fill", "white");

        node.append("text")
            .text(function(d){
                return d.name;
            })
            .attr("transform", "translate(-10, -15)");

        var diagonal = d3.svg.diagonal()
            .projection(function(d){
                return [-d.y + 400, d.x];
            });

        canvas.selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", diagonal);
    }

    function drawTree(params, inputLayerSize, hiddenLayerSize){
        for(var i = 0; i < inputLayerSize; i++){
            input_layer[i].name = "Input: " + params[i];
        }

        for(var i = 0; i < hiddenLayerSize; i++){
            hidden_layer[i].name = "Hidden: " + params[i + inputLayerSize];
        }
        drawD3tree(output);
    }

    function drawCostChart(cost){
        if(cost.length > 1000){
            var newcost = [];
            for(var i = 0; i < cost.length; i++){
                if(i % (Math.round(cost.length / 1000)) == 0){
                    newcost.push(cost[i])
                }
            }
            cost = newcost;
        }
        $('#hc_container').highcharts({
            title: {
                text: "Cost Function Optimization"
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
                name: 'Error',
                data: cost,
                lineWidth : 1,
                type: "spline",
                marker : {
                    enabled : false,
                    radius : 2
                }
            }]
        });
    }

    function drawRateChange(rateChanges){

        $('#hc_container1').highcharts({
            title: {
                text: "Adaptive Learning Rate"
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
                name: 'Learning Rate Changes',
                data: rateChanges,
                lineWidth : 1,
                type: "spline",
                marker : {
                    enabled : false,
                    radius : 2
                }
            }]
        });
    }

    function drawRegression(series){
        var s = [];

        series.forEach(function(ser, i){
            s.push({
                name: 'Hours of study: ' + (i),
                data: ser,
                lineWidth : 1,
                type: "spline",
                marker : {
                    enabled : false,
                    radius : 2
                }
            });
        });

        $('#hc_container2').highcharts({
            title: {
                text: "Regression"
            },
            yAxis: {
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            xAxis: {
                title: {
                    text: 'Hours of sleep'
                }
            },
            tooltip: {
                formatter: function() {
                    return 'Hours of Sleep: ' + this.x + '<br>' +
                        this.series.name + '<br>'
                        + this.y;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: s
        });
    }

    function drawDataTable(trainingData, trainingAnswers){
        var trs = "";
        trainingData.forEach(function(row, i){
            trs += "<tr>"
                + "<td>" + row[0] + "</td>"
                + "<td>" + row[1] + "</td>"
                + "<td><span>" + trainingAnswers[i] + "</span></td>"
                + "</tr>";
        });
        $("#data_table tbody").html(trs);
    }

    worker.onmessage = function(e){
        console.log(e.data);
        switch(e.data.action){

            case 'REGRESSION_RESULT':
                console.log(e.data);
                drawRegression(e.data.result);
                break;

            case 'DONE_TRAINING':
                var params = e.data.params;
                var cost = e.data.cost;
                var iterations = e.data.iterations;
                var inputLayerSize = e.data.inputLayerSize;
                var hiddenLayerSize = e.data.hiddenLayerSize;
                drawCostChart(cost);
                drawTree(params, inputLayerSize, hiddenLayerSize);
                $("#compute").click();
                $("#number_of_iterations").html("Number of Iterations: " + iterations);
                var to24 = Array
                    .apply(null, {length: 30})
                    .map(function(i, index){
                        return index;
                    });
                worker.postMessage({
                    action: 'GET_REGRESSION',
                    x: math.dotDivide(to24, tmax),
                    y: math.dotDivide(to24, tmax)
                });
                break;

            case 'FORWARD_RESULT':
                var yHat = e.data.result;
                var diffs = trainingAnswers.map(function(ans){
                    return Math.abs((yHat*100) - ans[0]);
                });
                var guess = diffs.indexOf(Math.min.apply(null, diffs));
                $("#data_table span").removeClass("answer");
                $($("#data_table tbody tr")[guess]).find("span").addClass("answer");

                output.name = "Output: " + yHat;
                drawD3tree(output);
                break;
        }
    };

    $("#compute").click(function(e){
        var row = math.dotDivide([Number($("#sleep").val()), Number($("#study").val())], tmax);
        worker.postMessage({
            action: 'FORWARD',
            row: row
        });
    });

    $(document).ready(function() {

        drawD3tree(output);

        drawDataTable(trainingData, trainingAnswers);

        worker.postMessage({
            action: 'START_TRAINING',
            X: X,
            y: y
        });
    });


})(jQuery);