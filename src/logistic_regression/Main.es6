export default class Main {

    constructor(){
        this.dataSet = this.makeDataset();
        this.normalized = this.normalizeDataset(this.dataSet);
        console.log(this.dataSet, this.normalized);
    }

    sigmoid(x) {
        return 1 + Math.pow(Math.E, -x);
    }

    makeDataset(dataLength = 10){
        const outArray = Array.apply(null, {length: dataLength})
            .map(function(i, current){
                return Math.random() * 100;
            });

        const dataset = Array.apply(null, {length: dataLength})
            .map(function (i, index){
                const min = outArray[index] - outArray[index] * .2;
                const max = outArray[index] + outArray[index] * .2;

                //Return a data row that represents the [input, input, output]
                return [
                    Math.random() * (max - min) + min,
                    Math.random() * (max - min) + min,
                    outArray[index]
                ];
            });
        return dataset;
    }

    normalizeDataset(d) {
        let max_X = -Infinity;
        let min_X = Infinity;

        let max_y = -Infinity;
        let min_y = Infinity;

        let n = Array.apply(null, {length: d.length})
            .map(function(i, index){
                return [0,0,0];
            });

        let i;
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
    }
}

new Main();