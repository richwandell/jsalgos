import Interpolator from "./Interpolator";

export default class BilinearInterpolation extends Interpolator {

    getImageData(pix: Array, newPix: Array, scalingFactor: Number) {
        for(let r = 0; r < pix.length; r++) {

            let rstart = r * scalingFactor;
            let rend = rstart + scalingFactor;

            for(let row = rstart; row < rend; row++) {

                for(let c = 0; c <  pix[0].length; c++) {

                    let cstart = c * scalingFactor;
                    let cend = cstart + scalingFactor;

                    for(let col = cstart; col < cend; col++ ){

                        let leftPixel = pix[r][c];
                        let rightPixel = leftPixel;
                        if (typeof(pix[r][c + 1]) !== "undefined") {
                            rightPixel = pix[r][c + 1];
                        }

                        let xInt1 = this.interpolate(leftPixel, rightPixel, col, cstart, cend);
                        let xInt2 = xInt1;

                        if(typeof(pix[r+1]) !== "undefined"){
                            leftPixel = pix[r+1][c];
                            rightPixel = leftPixel;
                            if (typeof(pix[r+1][c + 1]) !== "undefined") {
                                rightPixel = pix[r+1][c+1];
                            }
                            xInt2 = this.interpolate(leftPixel, rightPixel, col, cstart, cend);
                        }

                        newPix[row][col] = this.interpolate(xInt1, xInt2, row, rstart, rend);

                    }
                }
            }
        }
        return newPix;
    }

    interpolate(p1, p2, x, x1, x2) {
        let y1r = p1[0];
        let y1g = p1[1];
        let y1b = p1[2];
        let y1a = p1[3];

        let y2r = p2[0];
        let y2g = p2[1];
        let y2b = p2[2];
        let y2a = p2[3];

        let x2mx = x2 - x;
        let x2mx1 = x2 - x1;
        let xmx1 = x - x1;

        let red = ((x2mx / x2mx1) * y1r) + ((xmx1 / x2mx1) * y2r);
        let green = ((x2mx / x2mx1) * y1g) + ((xmx1 / x2mx1) * y2g);
        let blue = ((x2mx / x2mx1) * y1b) + ((xmx1 / x2mx1) * y2b);
        let alpha = ((x2mx / x2mx1) * y1a) + ((xmx1 / x2mx1) * y2a);

        return [red, green, blue, alpha];
    }
}