importScripts('../scripts/math.js');

function NeuralNetwork(){
    this.inputLayerSize = 2;
    this.outputLayerSize = 1;
    this.hiddenLayerSize = 3;
    this.W1 = math.randomInt([this.inputLayerSize, this.hiddenLayerSize])
        .map(function(row){
            return row.map(function(el){  return Math.random(); });
        });
    this.W2 = math.randomInt([this.hiddenLayerSize, this.outputLayerSize])
        .map(function(row){
            return row.map(function(el){  return Math.random(); });
        });

    this.forward = function(X){
        this.Z2 = math.multiply(X, this.W1);
        this.A2 = this.sigmoid(this.Z2);
        this.Z3 = math.multiply(this.A2, this.W2);
        var yHat = this.sigmoid(this.Z3);
        return yHat;
    };

    this.sigmoid = function(z){
        var bottom = math.add(1, math.exp(math.multiply(-1, z)));
        return math.dotDivide(1, bottom);
    };

    this.sigmoidPrime = function(z){
        var top = math.exp(math.multiply(-1, z));
        var bottom = math.add(1, top);
        return math.dotDivide(top, bottom);
    };

    this.costFunction = function(X, y){
        this.yHat = this.forward(X);
        var ymyhat = math.subtract(y, this.yHat);
        var squared = math.square(ymyhat);
        if(squared.constructor != Array){
            squared = squared._data;
        }
        var summed = squared.reduce(function(a, b){
            return math.add(a, b);
        });

        var J = math.multiply(0.5, summed);
        return J;
    };

    this.costFunctionPrime = function(X, y){
        this.yHat = this.forward(X);
        var sigprime3 = this.sigmoidPrime(this.Z3);
        var ymyhat = math.subtract(y, this.yHat);
        var left1 = math.multiply(-1, ymyhat);

        var delta3 = math.dotMultiply(left1, sigprime3);

        var a2trans = math.transpose(this.A2);

        var dJdW2;
        if(math.size(a2trans).length == 1 && math.size(delta3).length == 1) {
            dJdW2 = math.dot(a2trans, delta3);
        }else{
            dJdW2 = math.multiply(a2trans, delta3);
        }

        var sigprime2 = this.sigmoidPrime(this.Z2);
        var w2trans = math.transpose(this.W2);
        var left2;
        if(math.size(delta3).length == 1 && math.size(w2trans).length == 1) {
            left2 = math.dot(delta3, w2trans);
        }else{
            left2 = math.multiply(delta3, w2trans);
        }

        var delta2 = math.dotMultiply(left2, sigprime2);

        var xtrans = math.transpose(X);

        var dJdW1;
        if(math.size(xtrans).length == 1 && math.size(delta2).length == 1) {
            dJdW1 = math.dot(xtrans, delta2);
        }else{
            dJdW1 = math.multiply(xtrans, delta2);
        }

        return [dJdW1, dJdW2];
    };

    this.setParams = function(params){
        //# Set W1 and W2 using single paramater vector.
        var W1_start = 0;

        var W1_end = this.hiddenLayerSize * this.inputLayerSize;

        var array = params.slice(W1_start, W1_end);
        var reshaped = this.reshape(array, this.inputLayerSize, this.hiddenLayerSize);
        this.W1 = math.matrix(reshaped);

        var W2_end = W1_end + (this.hiddenLayerSize * this.outputLayerSize);
        var array2 = params.slice(W1_end, W2_end);
        var reshaped2 = this.reshape(array2, this.hiddenLayerSize, this.outputLayerSize);
        this.W2 = math.matrix(reshaped2);
    };

    this.getParams = function(){
        var left = this.ravel(this.W1);
        var right = this.ravel(this.W2);
        return left.concat(right);
    };

    this.reshape = function(input, a, b){
        if(a * b != input.length) {
            throw "ValueError: cannot reshape array of size " + input.length + " into shape (" + a + "," + b + ")";
        }
        var out = [];
        for(var i = 0; i < a; i++){
            var c = [];
            for(var j = 0; j < b; j++){
                c.push(input.pop());
            }
            out.push(c.reverse());
        }

        return out.reverse();
    };

    this.ravel = function(input, r){
        if(input.constructor != Array) input = input._data;
        if(!r){ r = []}
        for(var i=0; i<input.length; i++){
            if(input[i].constructor == Array){
                this.ravel(input[i], r);
            }else{
                r.push(input[i]);
            }
        }
        return r;
    };

    this.computeGradients = function(X, y){
        var djdwa = this.costFunctionPrime(X, y);
        var left = this.ravel(djdwa[0]);
        var right = this.ravel(djdwa[1]);

        return left.concat(right);
    };
}

function Trainer(N){
    this.N = N;

    this.costFunctionWrapper = function(params, X, y){
        this.N.setParams(params);
        var cost = this.N.costFunction(X, y);
        var grad = this.N.computeGradients(X, y);
        return [cost, grad];
    };

    this.train = function(X, y){
        this.X = X;
        this.y = y;

        var params0 = this.N.getParams();
        var cg = this.costFunctionWrapper(params0, this.X, this.y);

        var cost = cg[0], grad = cg[1], params = params0;

        var maxdiff = 0.001;
        var same = 0;
        var lastparams = params;
        var iteration = 0;
        var all_cost = [];
        var learning_rate = 4;
        var going_up = 0;
        var rate_changes = [[1, learning_rate]];
        while(cost[0] > maxdiff){
            cg = this.costFunctionWrapper(params, this.X, this.y);

            grad = cg[1];
            var right = math.dotMultiply(learning_rate, grad);
            params = math.subtract(params, right).map(function(el){
                return isNaN(el) ? 0 : el;
            });

            lastparams = params;
            var newcost = cg[0];
            if(newcost[0] == cost[0]) {
                same++;
            }else if(newcost[0] > cost[0]){
                going_up++;
                same = 0;
            }else{
                going_up = 0;
                same = 0;
            }
            if(same >= 100 && learning_rate != 0.5){
                rate_changes.push([iteration, 0.5]);
                learning_rate = 0.5;
            }
            if(going_up > 30 && learning_rate != 4){
                rate_changes.push([iteration, 4]);
                learning_rate = 4;
                going_up = 0;
            }
            cost = cg[0];
            all_cost.push([iteration, cost[0]]);
            iteration++;
        }
        this.allCost = all_cost;
        this.iterations = iteration;
        this.rateChanges = rate_changes;
    };

    this.getAllCost = function(){
        return this.allCost;
    };

    this.getIterations = function(){
        return this.iterations;
    };

    this.getRateChanges = function(){
        return this.rateChanges;
    };
}

var network = new NeuralNetwork();
var trainer = new Trainer(network);

onmessage = function(e) {
    console.log('Message received from main script');
    console.log(e.data);
    switch(e.data.action){
        case 'START_TRAINING':
            var X = e.data.X,
                y = e.data.y;

            trainer.train(X, y);
            postMessage({
                action: 'DONE_TRAINING',
                params: network.getParams(),
                cost: trainer.getAllCost(),
                iterations: trainer.getIterations(),
                inputLayerSize: network.inputLayerSize,
                hiddenLayerSize: network.hiddenLayerSize,
                rateChanges: trainer.getRateChanges()
            });
            break;

        case 'FORWARD':
            var yHat = network.forward(e.data.row);
            postMessage({action: 'FORWARD_RESULT', result: yHat._data[0]});
            break;

        case 'GET_REGRESSION':
            var series = [];


            for(var i = 0; i < 24; i++){
                var s;
                if(series.length <= i){
                    s = [];
                }else{
                    s = series[i];
                }
                for(var j = 0; j < 24; j++){
                    var yHat = network.forward([e.data.x[j], e.data.y[i]]);
                    s.push(yHat._data[0]);
                }
                series.push(s);
            }

            postMessage({
                action: 'REGRESSION_RESULT',
                result: series
            });
            break;
    }
};