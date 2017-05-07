import Regressor from '../linear_regression/bgdVsgd/Regressor';
import Stochastic from '../linear_regression/bgdVsgd/Stochastic';

export default class Trainer extends Stochastic {

    constructor(main, real_numbers, measurements) {
        super(real_numbers, measurements, 0);
        this.x = measurements;
        this.y = real_numbers;
        this.main = main;
        this.a = 0.02;
        Regressor.MAX_ITERATION = 300;
        Regressor.TIME_INTERVAL = 5;
        Regressor.PRECISION = 0.00001;
        this.b = 1;
        this.m = 10;
    }

    setup() {
        super.setup();
        this.training_examples = this.real_numbers
            .map((n, i) => {
                return [this.measurements[i], n];
            });
    }

    drawLine(){
        if (this.ni % 2 === 0) {
            this.main.drawLine();
        }
    }

    drawCost(){
        this.main.drawCost(this.costHistory);
    }

    line(x) {
        return this.main.sigmoid(x, this.b, this.m);
    }

    cost(X) {
        this.main.c1 = this.b;
        this.main.c2 = this.m;
        let dx = math.flatten(math.subset(X, math.index(math.range(0, X.length), 0)));
        let dy = math.flatten(math.subset(X, math.index(math.range(0, X.length), 1)));
        return this.main.cost(dx, dy);
    }

    epoch(d){
        //keep track of how many times we go through the dataset
        this.ni++;
        //Shuffle our data first
        let data = this.shuffle(d);
        const N = data.length;

        for(let i = 0; i < N; i ++){
            const x = data[i][0];
            const y = data[i][1];
            const diff = (y - this.line(x));
            //calculate the gradients for a single sample
            let bGrad = diff;
            let mGrad = diff * 2;
            //update Y intercept
            this.b = this.b + (this.a * bGrad);
            //update slope
            this.m = this.m - (-(2/N) * this.a * mGrad);
            this.main.c1 = this.b;
            this.main.c2 = this.m;
        }
        this.pc = this.c;
        //compute the mean squared error
        this.c = this.cost(data);
        this.costHistory.push(this.c);
        //keep track of the best possible answer
        if(this.c < this.bestC){
            this.bestB = this.b;
            this.bestM = this.m;
            this.bestC = this.c;
        }
        //compute the change in cost
        let ccost = Math.abs(this.pc - this.c);

        this.drawLine();

        if(ccost < Regressor.PRECISION || this.ni >= Regressor.MAX_ITERATION){
            clearTimeout(this.timer);
            this.b = this.bestB;
            this.m = this.bestM;
            this.main.c1 = this.b;
            this.main.c2 = this.m;
            this.drawCost();
        } else {
            this.timer = setTimeout(() => {
                this.epoch(this.training_examples);
            }, Regressor.TIME_INTERVAL);
        }
    }
}