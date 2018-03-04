let $ = jQuery;

class Edge {

    constructor() {
        this.horizontalWorker = new Worker('worker.js');
        this.verticalWorker = new Worker('worker.js');
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas1 = $("#canvas1")[0];
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas2 = $("#canvas2")[0];
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas3 = $("#canvas3")[0];
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas4 = $("#canvas4")[0];
        /**
         * @type {HTMLCanvasElement}
         */
        this.canvas5 = $("#canvas5")[0];
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx1 = this.canvas1.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx2 = this.canvas2.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx3 = this.canvas3.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx4 = this.canvas4.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx5 = this.canvas5.getContext('2d');
        this.mousePosition = {x: 0, y: 100};
        /**
         *
         * @type {HTMLImageElement}
         */
        this.img = new Image();
        this.img.src = 'Picture1.jpg';
        this.img.onload = (e) => this.imageLoaded(e);
    }

    imageLoaded(e) {
        let width = this.img.width;
        let height = this.img.height;
        this.canvas1.width = width;
        this.canvas1.height = height;
        this.canvas2.width = width;
        this.canvas2.height = height;
        this.canvas3.width = width;
        this.canvas3.height = height;
        this.canvas4.width = width;
        this.canvas4.height = height;
        this.canvas5.width = width;
        this.canvas5.height = height;
        this.ctx1.drawImage(this.img, 0, 0);
        this.ctx2.strokeText('Running Vertical', this.canvas1.width / 2, this.canvas1.height / 2);
        this.ctx2.strokeText('Sobel Edge Detection',
            this.canvas1.width / 2,
            (this.canvas1.height / 2) + 15);
        this.ctx3.strokeText('Running Horizontal', this.canvas1.width / 2, this.canvas1.height / 2);
        this.ctx3.strokeText('Sobel Edge Detection',
            this.canvas1.width / 2,
            (this.canvas1.height / 2) + 15);
        this.ctx4.strokeText('Combined', this.canvas1.width / 2, this.canvas1.height / 2);
        this.ctx4.strokeText('Sobel Edge Detection',
            this.canvas1.width / 2,
            (this.canvas1.height / 2) + 15);
        this.ctx5.strokeText('Threshold >= 100', this.canvas1.width / 2, this.canvas1.height / 2);
        this.ctx5.strokeText('Sobel Edge Detection',
            this.canvas1.width / 2,
            (this.canvas1.height / 2) + 15);
        /**
         *
         * @type {ImageData}
         */
        this.imageData = this.ctx1.getImageData(0, 0, this.canvas1.width, this.canvas1.height);
        this.startWorkers();
        this.bindEvents();
        this.drawIntensityProfile();
    }

    onMessage(e) {
        switch(e.data.action) {
            case 'SEND_EDGE_IMAGE_DATA':
                if(e.data.type === 'vertical') {
                    this.ctx2.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
                    this.ctx2.putImageData(e.data.data, 0, 0);
                    this.hasVerticalData = true;
                    this.verticalData = e.data.squared;
                } else {
                    this.ctx3.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
                    this.ctx3.putImageData(e.data.data, 0, 0);
                    this.hasHorizontalData = true;
                    this.horizontalData = e.data.squared;
                }
                if(this.hasHorizontalData && this.hasVerticalData) {
                    let added = math.add(this.horizontalData, this.verticalData);
                    let squareRoot = math.matrix(math.sqrt(added));
                    let threshold = [];
                    for(let y = 0; y < squareRoot._data.length; y++){
                        for(let x = 0; x < squareRoot._data[y].length; x++){
                            squareRoot._data[y][x][3] = 255;
                            let t = squareRoot._data[y][x].slice();
                            if(t[0] >= 50) {
                                t[0] = 255;
                                t[1] = 255;
                                t[2] = 255;
                            }
                            threshold.push(t);
                        }
                    }
                    let data = Uint8ClampedArray.from(math.flatten(squareRoot._data));
                    let id = new ImageData(data, squareRoot._data[0].length, squareRoot._data.length);
                    this.ctx4.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
                    this.ctx4.putImageData(id, 0, 0);

                    let datat = Uint8ClampedArray.from(math.flatten(threshold));
                    let idt = new ImageData(datat, squareRoot._data[0].length, squareRoot._data.length);
                    this.ctx5.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
                    this.ctx5.putImageData(idt, 0, 0);
                }
                break;

            case 'WORKER_STARTED':
                if(e.data.type === 'vertical') {
                    this.verticalWorker.postMessage({
                        action: 'DETECT',
                        imageData: this.imageData,
                        height: this.canvas1.height,
                        width: this.canvas1.width
                    });
                } else {
                    this.horizontalWorker.postMessage({
                        action: 'DETECT',
                        imageData: this.imageData,
                        height: this.canvas1.height,
                        width: this.canvas1.width
                    });
                }
                break;
        }
    }

    startWorkers(){
        this.horizontalWorker.postMessage({
            action: 'START_WORKER',
            type: 'horizontal'
        });

        this.verticalWorker.postMessage({
            action: 'START_WORKER',
            type: 'vertical'
        });

        this.horizontalWorker.onmessage = (e) => this.onMessage(e);
        this.verticalWorker.onmessage = (e) => this.onMessage(e);
    }

    redrawImage() {
        this.ctx1.clearRect(0, 0, this.canvas1.width, this.canvas1.height);
        this.ctx1.drawImage(this.img, 0, 0);
        this.ctx1.beginPath();
        this.ctx1.moveTo(0, this.mousePosition.y);
        this.ctx1.lineTo(this.canvas1.width, this.mousePosition.y);
        this.ctx1.strokeStyle = 'green';
        this.ctx1.stroke();
    }

    bindEvents() {
        $("#canvas1").on("mousemove", (e) => this.mouseMoved(e));
    }

    mouseMoved(e) {
        this.mousePosition = this.getMousePos(this.canvas1, e);
        this.drawIntensityProfile();
    }

    drawIntensityProfile() {
        /**
         *
         * @type {ImageData}
         */
        let imageRow = this.ctx1.getImageData(0, this.mousePosition.y, this.canvas1.width, 1);
        /**
         *
         * @type {DenseMatrix}
         */
        let row = math.matrix(math.reshape(Array.from(imageRow.data), [1, imageRow.width, 4]));
        row = math.subset(row, math.index(0, math.range(0, row.size()[1]), math.range(0, 3)));

        let data = [];
        for(let column of row._data[0]) {
            data.push(math.sum(column) / 3);
        }

        if(typeof(this.chart) === "undefined") {
            this.chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'hc_container1'
                },
                title: {
                    text: "Row Intensity Profile"
                },
                yAxis: {
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    enabled: false
                },
                series: {
                    id: 'the-measurement',
                    name: 'Measurement',
                    data: data,
                    lineWidth : 1,
                    marker : {
                        enabled : false
                    }
                }
            });
        } else {
            let series = this.chart.get('the-measurement');
            if(series){
                series.remove();
            }
            this.chart.addSeries({
                id: 'the-measurement',
                name: 'Measurement',
                data: data,
                lineWidth : 1,
                marker : {
                    enabled : false
                }
            });
        }
        this.redrawImage();
    }

    getMousePos(canvas, evt) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
}

$(() => new Edge());