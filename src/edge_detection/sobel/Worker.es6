importScripts('../../scripts/math.js');

class Worker {

    constructor(type) {
        console.log("Worker.constructor");
        console.log(type);
        this.type = type;
        /**
         *
         * @type {DenseMatrix}
         */
        this.horizontalFilter = math.matrix([
            [1, 0, -1],
            [2, 0, -2],
            [1, 0, -1]
        ]);
        /**
         *
         * @type {DenseMatrix}
         */
        this.verticalFilter = math.matrix([
            [1, 2, 1],
            [0, 0, 0],
            [-1, -2, -1]
        ]);
    }

    process(imageData, canvasHeight, canvasWidth) {
        let ym3 = canvasHeight - 3;
        let xm3 = canvasWidth - 3;
        let rows = [];
        let squaredRows = [];

        imageData = Array.from(imageData.data);
        for(let y = 0; y < canvasHeight; y++) {
            let rowSize = 4 * canvasWidth;
            let begin = y * rowSize;
            let end = begin + rowSize;
            let row1 = imageData.slice(begin, end);
            let row2 = imageData.slice(begin + rowSize, end + rowSize);
            let row3 = imageData.slice(begin + rowSize + rowSize, end + rowSize + rowSize);
            /**
             * @type {DenseMatrix}
             */
            let M = math.matrix([row1, row2, row3]);
            M = math.reshape(M, [3, canvasWidth, 4]);
            rows.push([]);
            squaredRows.push([]);
            for(let x = 0; x < canvasWidth; x++) {
                /**
                 * @type {DenseMatrix}
                 */
                let m = math.subset(
                    M,
                    math.index(
                        math.range(0, 3),
                        math.range(x, x + 3),
                        0
                    )
                );
                m = math.reshape(m, [3, 3]);
                if(this.type === "horizontal") {
                    m = math.dotMultiply(m, this.horizontalFilter);
                } else {
                    m = math.dotMultiply(m, this.verticalFilter);
                }
                m = math.sum(m);
                rows[y].push([m, m, m, 255]);
                let squared = Math.pow(m, 2);
                squaredRows[y].push([squared, squared, squared, 255]);
                if(x === xm3) {
                    break;
                }
            }
            if(y === ym3) {
                break;
            }
        }
        let data = Uint8ClampedArray.from(math.flatten(rows));
        let id = new ImageData(data, rows[0].length, rows.length);
        postMessage({
            action: 'SEND_EDGE_IMAGE_DATA',
            data: id,
            type: this.type,
            squared: squaredRows
        });
    }
}

let worker = null;

onmessage = function(e) {

    switch(e.data.action){
        case 'START_WORKER':
            console.log("start worker");
            worker = new Worker(e.data.type);
            postMessage({
                action: 'WORKER_STARTED',
                type: e.data.type
            });
            break;

        case 'DETECT':
            worker.process(e.data.imageData, e.data.height, e.data.width);
            break;
    }
};