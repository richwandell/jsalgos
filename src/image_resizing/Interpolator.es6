export default class Interpolator {
    constructor(container) {
        this.container = container;
    }

    /**
     * @param pix
     * @param newPix
     * @param {Number} scalingFactor
     * @return {Array}
     */
    getImageData(pix: Array, newPix: Array, scalingFactor: Number) {
       return newPix;
    }

    run(image: HTMLImageElement, can1: HTMLCanvasElement, can2: HTMLCanvasElement, scalingFactor: Number) {

        let iw = image.width;
        let ih = image.height;
        let ctx1 = can1.getContext("2d");
        let ctx2 = can2.getContext("2d");
        let oldImageData = ctx1.getImageData(0, 0, iw, ih);
        let newImageData = ctx2.getImageData(0, 0, iw * scalingFactor, ih * scalingFactor);

        //group pixels into row/col so that I can work with them easier
        let pix = [];
        let pixNum = 0;
        for(let i = 0; i < oldImageData.data.length; i += 4) {
            let r = oldImageData.data[i];
            let g = oldImageData.data[i + 1];
            let b = oldImageData.data[i + 2];
            let a = oldImageData.data[i + 3];

            if(pixNum % iw === 0) {
                pix.push([]);
            }

            pix[pix.length -1].push([r, g, b, a]);
            pixNum++;
        }

        //create the new array for new image
        let newPix = [];
        for(let r = 0; r < ih * scalingFactor; r ++) {
            let tmp = [];
            for(let c = 0; c < iw * scalingFactor; c++) {
                tmp.push([0, 0, 0, 0]);
            }
            newPix.push(tmp);
        }

        newPix = this.getImageData(pix, newPix, scalingFactor);

        let currentPixelColor = 0;
        for(let r = 0; r < newPix.length; r++) {
            for(let c = 0; c < newPix[0].length; c++) {
                for(let p = 0; p < newPix[0][0].length; p++) {
                    newImageData.data[currentPixelColor] = newPix[r][c][p];
                    currentPixelColor++;
                }
            }
        }
        can2.width = iw * scalingFactor;
        can2.height = ih * scalingFactor;
        ctx2.putImageData(newImageData, 0, 0);
    }
}