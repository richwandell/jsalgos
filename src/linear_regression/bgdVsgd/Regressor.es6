class Regressor{


    static NUM_POINTS = 50;
    static TIME_INTERVAL = 10;
    static RANDOM_ALPHA = .5;
    static LEARNING_RATE = 0.001;
    static MAX_ITERATION = 1000;
    static PRECISION = 0.001;

    constructor(rn, m, batchNum, objectName){
        this.real_numbers = rn;
        this.measurements = m;
        this.batchNum = batchNum;
        this.object_name = objectName;
        this.costHistory = [];
        this.epocPost = 0;
        this.setup();
    }

    start(){
        this.epoch(this.training_examples);
    }

    line(x){
        return this.b + this.m * x;
    }

    cost(points) {
        let error = 0, i, x, y;
        for (i = 0; i < points.length; i++) {
            x = points[i][0];
            y = points[i][1];
            error += Math.pow((this.line(x) - y), 2);
        }
        return (1 / (2 *points.length)) * error;
    }

    getLineData(){
        return this.real_numbers.map((n, i) => {
            return this.line(i);
        });
    }

    drawCost(){
        postMessage({
            action: 'DRAW_COST',
            objectName: this.object_name,
            batchNum: this.batchNum,
            costHistory: this.costHistory,
            epocNum: this.ni
        });
    }

    drawLine(){
        if(this.epocPost % 10 == 0) {
            const lineData = this.getLineData();

            postMessage({
                action: 'DRAW_LINE',
                lineData: lineData,
                batchNum: this.batchNum,
                epocNum: this.ni
            });
        }
        this.epocPost++;
    }

    setup(){
        /**
         * Training examples is the [x, y] pairs that will be used for training
         */
        this.training_examples = this.measurements
            .map((n, i) => {
                return [i, n];
            });
        /**
         * Number of iterations
         * @type {number}
         */
        this.ni = 0;
        /**
         * Current Cost
         * @type {number}
         */
        this.c = 0;
        /**
         * Alpha - Learning rate
         * @type {number}
         */
        this.a = Regressor.LEARNING_RATE;
        /**
         * Best B - after convergence we choose the best B value
         * @type {number}
         */
        this.bestB = 0;
        /**
         * Bese M - after convergence we choose the best M value
         * @type {number}
         */
        this.bestM = 0;
        /**
         * Best Cost - keep track of the best cost we have reached so far
         * @type {Number}
         */
        this.bestC = Infinity;
        /**
         * The slope
         * @type {number}
         */
        this.m = 1;
        /**
         * The intercept
         * @type {number}
         */
        this.b = 1;
        /**
         * The timer
         * @type {null}
         */
        this.timer = null;
        /**
         * The HighCharts reference
         * @type {Highcharts.Chart}
         */
        this.hc = null;
        /**
         * Previous cost, used for measuring precision
         * @type {Number}
         */
        this.pc = Infinity;
    }
}

export default Regressor;