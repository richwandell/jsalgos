import Interpolator from "./Interpolator";

export default class BicubicInterpolation extends Interpolator {

    getClosestFourRows(pix, r, c) {
        if(typeof(pix[r-2]) !== "undefined" && typeof(pix[r+1]) !== "undefined") {
            return [
                this.getClosestFourCols(pix[r-2], c),
                this.getClosestFourCols(pix[r-1], c),
                this.getClosestFourCols(pix[r], c),
                this.getClosestFourCols(pix[r+1], c)
            ];
        }

        if(typeof(pix[r-1]) !== "undefined" && typeof(pix[r+2]) !== "undefined") {
            return [
                this.getClosestFourCols(pix[r-1], c),
                this.getClosestFourCols(pix[r], c),
                this.getClosestFourCols(pix[r+1], c),
                this.getClosestFourCols(pix[r+2], c)
            ];
        }

        if(typeof(pix[r+3]) !== "undefined"){
            return [
                this.getClosestFourCols(pix[r], c),
                this.getClosestFourCols(pix[r+1], c),
                this.getClosestFourCols(pix[r+2], c),
                this.getClosestFourCols(pix[r+3], c)
            ];
        }

        return [
            this.getClosestFourCols(pix[r], c),
            this.getClosestFourCols(pix[r], c),
            this.getClosestFourCols(pix[r], c),
            this.getClosestFourCols(pix[r], c)
        ];
    }

    getClosestFourCols(pixCol, c) {
        if(typeof(pixCol[c-2]) !== "undefined" && typeof(pixCol[c+1]) !== "undefined") {
            return [pixCol[c-2], pixCol[c-1], pixCol[c], pixCol[c+1]];
        }

        if(typeof(pixCol[c-1]) !== "undefined" && typeof(pixCol[c+2]) !== "undefined"){
            return [pixCol[c-1], pixCol[c], pixCol[c+1], pixCol[c+2]];
        }

        if(typeof(pixCol[c+3]) !== "undefined"){
            return [pixCol[c], pixCol[c+1], pixCol[c+2], pixCol[c+3]];
        }

        return [pixCol[c], pixCol[c], pixCol[c], pixCol[c]];
    }

    getImageData(pix: Array, newPix: Array, scalingFactor: Number) {
        for(let r = 0; r < pix.length; r++) {

            let rstart = r * scalingFactor;
            let rend = rstart + scalingFactor;

            for (let row = rstart; row < rend; row++) {

                for (let c = 0; c < pix[0].length; c++) {

                    let cstart = c * scalingFactor;
                    let cend = cstart + scalingFactor;

                    for (let col = cstart; col < cend; col++) {
                        let pixels = this.getClosestFourRows(pix, r, c);

                        newPix[row][col] = this.interpolate(pixels, 0, 0);
                    }
                }
            }
        }

        return newPix;
    }

    interpolate(pixels, x, y) {
        let xInt = [];
        for(let row of pixels) {
            let rInt = this.singleInterpolate([row[0][0], row[1][0], row[2][0], row[3][0]], x);
            let gInt = this.singleInterpolate([row[0][1], row[1][1], row[2][1], row[3][1]], x);
            let bInt = this.singleInterpolate([row[0][2], row[1][2], row[2][2], row[3][2]], x);
            let aInt = this.singleInterpolate([row[0][3], row[1][3], row[2][3], row[3][3]], x);

            xInt.push([rInt, gInt, bInt, aInt]);
        }

        let ryInt = this.singleInterpolate([xInt[0][0], xInt[1][0], xInt[2][0], xInt[3][0]], y);
        let gyInt = this.singleInterpolate([xInt[0][1], xInt[1][1], xInt[2][1], xInt[3][1]], y);
        let byInt = this.singleInterpolate([xInt[0][2], xInt[1][2], xInt[2][2], xInt[3][2]], y);
        let ayInt = this.singleInterpolate([xInt[0][3], xInt[1][3], xInt[2][3], xInt[3][3]], y);

        return [ryInt, gyInt, byInt, ayInt];
    }

    i1(p, x) {
        return p[1] + 0.5 * x*(p[2] - p[0] + x*(2.0*p[0] - 5.0*p[1] + 4.0*p[2] - p[3] + x*(3.0*(p[1] - p[2]) + p[3] - p[0])));
    }

    singleInterpolate(pix, mu) {
        let [y0, y1, y2, y3] = pix;
        let mu2 = mu * mu;

        let a0 = y3 - y2 - y0 + y1;
        let a1 = y0 - y1 - a0;
        let a2 = y2 - y0;
        let a3 = y1;

        return a0 * mu * mu2 + a1 * mu2 + a2 * mu + a3;
    }
}