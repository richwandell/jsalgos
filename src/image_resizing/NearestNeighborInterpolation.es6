import Interpolator from "./Interpolator";

export default class NearestNeighborInterpolation extends Interpolator {

    getImageData(pix, newPix, scalingFactor) {
        let ih = pix.length;
        let iw = pix[0].length;
        for(let r = 0; r < ih; r++) {
            let rstart = r * scalingFactor;
            let rend = rstart + scalingFactor;
            for(let row = rstart; row < rend; row++) {
                for(let c = 0; c < iw; c++) {
                    let cstart = c * scalingFactor;
                    let cend = cstart + scalingFactor;
                    for(let col = cstart; col < cend; col++ ){
                        newPix[row][col] = pix[r][c];
                    }
                }
            }
        }

        return newPix;
    }
}