export default class Normalizer {

    constructor(dataSet) {
        this.dataSet = dataSet;
        this.max = math.max(this.dataSet);
        this.min = math.min(this.dataSet);
        this.n = this.normalize(this.dataSet);
    }

    getNormalizedDataset() {
        return this.n;
    }

    normalize(sample) {
        let xMinusMin = math.subtract(sample, this.min);
        let normalized = math.divide(xMinusMin, (this.max - this.min));
        return normalized;
    }

    denormalize(x) {
        let range = this.max - this.min;
        return (range * x) + range;
    }
}