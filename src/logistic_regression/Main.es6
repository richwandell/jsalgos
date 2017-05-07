import Normalizer from './Normalizer';
import Trainer from './Trainer';

export default class Main  {

    constructor(){
        window.gistAsync();
        const dataLength = 50;
        this.c1 = 1;
        this.c2 = 0;
        let [X, y, dx, dy] = this.makeDataset(dataLength);
        this.X = X;
        this.y = y;

        this.xNormalizer = new Normalizer(dx);
        this.nX = this.xNormalizer.getNormalizedDataset();

        this.t = new Trainer(this, y, this.nX);

        this.draw();

        this.t.start(1);
    }

    drawLine() {
        let data = this.test
            .map((n, i) => {
                return {
                    x: i,
                    y: this.sigmoid(n, this.c1, this.c2)
                };
            });
        let that = this;
        let series = {
            id: 'regression-line',
            name: 'Regression Line',
            data: data,
            lineWidth: 1,
            type: "spline",
            color: 'steelblue',
            marker: {
                enabled: true,
                radius: 2
            },
            tooltip: {
                pointFormatter: function () {
                    let y = that.creditScoreDisplay(this.y);
                    let approved = this.y > 0.5 ? 'yes' : 'no';
                    return `<span style="color:{point.color}"></span> 
                        Credit Score: <b>${y}</b>
                        <br/>
                        Approved: <b>${approved}</b>
                    `;
                }
            }
        };
        let s1 = this.hc.get('regression-line');
        if(s1){
            s1.remove();
        }
        this.hc.addSeries(series);
    }

    creditScoreDisplay(val) {
        let range = 850 - 300;
        return (range * val) + 300;
    }

    drawCost(costHistory) {
        this.drawLine();
        new Highcharts.Chart({
            chart:{
                renderTo: 'hc_container_error'
            },
            title: {
                text: "SGD Cost"
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

    sigmoid(x, c1 = 1, c2 = 0) {
        return 1 / (1 + Math.pow(Math.E, -((c1 * x) - c2)));
    }

    derivative(x) {
        let sig = this.sigmoid(x);
        return sig * (1 - sig);
    }

    cost(X, y) {
        let yhat = X.map((x) => this.sigmoid(x, this.c1, this.c2));
        let ymyhat = math.subtract(y, yhat);
        return math.sum(math.dotPow(ymyhat, 2)) / X.length;
    }

    makeDataset(dataLength = 10){
        this.testNormalizer = new Normalizer(Array.apply(null, {length: dataLength}).map(Number.call, Number));
        this.test = this.testNormalizer.getNormalizedDataset();

        let y1 = this.test
            .map((i, current) => {
                return this.sigmoid(current, 1, dataLength / 2);
            });

        let y2 = this.test
            .map((i, current) => {
                return this.sigmoid(current, 1, dataLength / 3);
            });

        let y3 = this.test
            .map((i, current) => {
                return this.sigmoid(current, 1, (dataLength / 3) * 2);
            });

        let dy = math.concat(y1, y2, y3);

        let data = Array.apply(null, {length: dy.length})
            .map(function (i, index){
                const yindex = dy[index];
                const min = yindex - .2;
                const max = yindex + .2;

                //Return a data row that represents the [input]
                return [index % dataLength, Math.random() * (max - min) + min, Math.round(yindex)];
            });

        data = data.sort((a, b) => {
            if ( a[0] > b[0] ){
                return 1;
            } else if (a[0] === b[0]) {
                return 0;
            }
            return -1;
        });

        console.log(data);

        let X = math.subset(data,
                math.index(
                    math.range(0, data.length),
                    math.range(0, data[0].length -1)
                )
            );


        let y = math.flatten(
            math.subset(data,
                math.index(math.range(0, data.length), data[0].length -1)
            )
        );

        let dx = math.flatten(math.subset(X, math.index(math.range(0, X.length), X[0].length -1)));
        return [X, y, dx, dy];
    }

    draw() {
        let creditScore = this.nX.map((n, i) => {
            return [this.X[i][0], n]
        });
        let series = [{
            name: 'Credit Score',
            data: creditScore,
            lineWidth : 0,
            type: 'spline',
            color: 'palevioletred',
            marker : {
                enabled : true,
                radius : 3
            },
            tooltip: {
                formatter: function () {
                    return false;
                }
            }
        },{
            name: 'Approved',
            data: this.y.map((n, i) => {
                return [this.X[i][0], n]
            }),
            lineWidth : 0,
            type: 'spline',
            color: 'darkseagreen',
            marker : {
                enabled : true,
                radius : 3
            },
            tooltip: {
                pointFormatter: function () {
                    if (this.y === 1) {
                        return "Yes";
                    }
                    return "No";
                }
            }
        }];
        let that = this;
        this.hc = new Highcharts.Chart({
            chart:{
                renderTo: 'hc_container'
            },
            title: {
                text: "Logistic Regression"
            },
            yAxis: {
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }],
                max: 1,
                min: 0
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: series,
            plotOptions:{
                series: {
                    animation: false
                }
            }
        });
    }

}

$(() => new Main());