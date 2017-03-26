import Regressor from './Regressor';

class Stochastic extends Regressor {

    constructor(rn, m, batchNum){
        super(rn, m, batchNum, "Stochastic");
    }

    shuffle(data){
        let ret = [];
        let tmpData = data.slice(0);
        while(tmpData.length > 0){
            let index = Math.round(Math.random() * tmpData.length);
            let item = tmpData.splice(index, 1)[0];
            if(typeof(item) != "undefined") {
                ret.push(item);
            }
        }
        return ret;
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
            let mGrad = diff * x;
            //update Y intercept
            this.b = this.b + (this.a * bGrad);
            //update slope
            this.m = this.m - (-(2/N) * (this.a * mGrad));
        }
        this.pc = this.c;
        //compute the mean squared error
        this.c = this.cost(this.training_examples);
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
            this.drawCost();
        } else {
            this.timer = setTimeout(() => {
                this.epoch(this.training_examples);
            }, Regressor.TIME_INTERVAL);
        }
    }
}


export default Stochastic;

