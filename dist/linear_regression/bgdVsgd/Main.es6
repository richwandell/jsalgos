import Regressor from './Regressor';

class Main{

    drawCost(objectName, batchNum, costHistory){
        new Highcharts.Chart({
            chart:{
                renderTo: 'hc_container_error' + batchNum
            },
            title: {
                text: objectName + "GD Cost Regression #" + (batchNum + 1)
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
                name: 'Cost',
                data: costHistory,
                lineWidth : 1,
                type: 'spline',
                color: 'palevioletred',
                marker : {
                    enabled : false
                }
            }],
            plotOptions:{
                series: {
                    animation: false
                }
            }
        });
    }

    drawLine(batchNum, lineData){
        let series = this.charts[batchNum].get('regression_line');
        if(series){
            series.remove();
        }
        this.charts[batchNum].addSeries({
            name: 'Regression Line',
            id: 'regression_line',
            data: lineData,
            lineWidth: 1,
            type: "spline",
            color: 'steelblue',
            marker: {
                enabled: false
            }
        });
    }

    createWorkers(num, measurements, workerTypes, realNumbers, startYs){
        this.charts = [];
        this.workers = [];
        for(let i = 0; i < num; i++) {
            this.charts.push(new Highcharts.Chart({
                chart: {
                    renderTo: 'hc_container' + i
                },
                title: {
                    text: ''
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
                    name: 'Measurement',
                    data: measurements[i],
                    lineWidth: 0,
                    type: 'spline',
                    color: 'palevioletred',
                    marker: {
                        enabled: true,
                        radius: 3
                    }
                }],
                plotOptions: {
                    series: {
                        animation: false
                    }
                }
            }));
            let w = new Worker("Worker.js");
            w.onmessage = (e) => {
                this.receivedWorkerMessage(e);
            };
            w.postMessage({
                action: 'SET_WORKER_VARS',
                batchNum: i,
                workerType: workerTypes[i],
                measurements: measurements[i],
                realNumbers: realNumbers[i],
                startY: startYs[i]
            });
            this.workers.push(w);
        }
    }

    receivedWorkerMessage(e){
        switch(e.data.action){
            case 'DRAW_LINE':
                this.drawLine(e.data.batchNum, e.data.lineData);
                $("#epoc_number" + e.data.batchNum).html("Epocs: " + e.data.epocNum);
                break;

            case 'DRAW_COST':
                this.drawCost(e.data.objectName, e.data.batchNum, e.data.costHistory);
                $("#epoc_number" + e.data.batchNum).html("Convergence in <b>" + e.data.epocNum + "</b> epocs!");
                break;
        }
    }

    realEq1(i){
        return i;
    }

    realEq2(i){
        return 50;
    }

    makeDatasets(){
        const rn1 = Array.apply(null, {length: Regressor.NUM_POINTS})
            .map( (item, index) => {
                return this.realEq1(index);
            });

        const rn2 = Array.apply(null, {length: Regressor.NUM_POINTS})
            .map( (item, index) => {
                return this.realEq2(index);
            });

        const m1 = rn1
            .map(function (item, i) {
                let min = item - item * Regressor.RANDOM_ALPHA;
                let max = item + item * Regressor.RANDOM_ALPHA;
                return Math.random() * (max - min) + min;
            });

        const m2 = rn2
            .map(function (item, i) {
                let min = item - item * Regressor.RANDOM_ALPHA;
                let max = item + item * Regressor.RANDOM_ALPHA;
                return Math.random() * (max - min) + min;
            });

        return [rn1, m1, rn2, m2];
    }

    constructor(){
        const [rn1, m1, rn2, m2] = this.makeDatasets();

        $(() => {
            window.gistAsync();
            const r1 = Math.round(Math.random() * (m1.length - 1));
            const r2 = Math.round(Math.random() * (m2.length - 1));
            const startY1 = m1[r1];
            const startY2 = m2[r2];
            this.createWorkers(4,
                [m1, m2, m1, m2],
                ["BATCH", "BATCH", "STOCHASTIC", "STOCHASTIC"],
                [rn1, rn2, rn1, rn2],
                [startY1, startY2, startY1, startY2]
            );
        });
    }
}

new Main();