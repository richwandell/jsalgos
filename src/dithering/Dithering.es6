new class Dithering {

    constructor() {
        /**
         *
         * @type {HTMLCanvasElement}
         */
        this.image1OriginalCanvas = document.querySelector("#original-image1");
        /**
         *
         * @type {HTMLCanvasElement}
         */
        this.image1DitheredCanvas = document.querySelector("#dithered-image1");
        /**
         *
         * @type {HTMLCanvasElement}
         */
        this.image1QuantizedCanvas = document.querySelector("#quantized-image1");
        /**
         *
         * @type {HTMLCanvasElement}
         */
        this.image2OriginalCanvas = document.querySelector("#original-image2");
        /**
         *
         * @type {HTMLCanvasElement}
         */
        this.image2DitheredCanvas = document.querySelector("#dithered-image2");
        /**
         *
         * @type {HTMLCanvasElement}
         */
        this.image2QuantizedCanvas = document.querySelector("#quantized-image2");
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx1Original = this.image1OriginalCanvas.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx1Dithered = this.image1DitheredCanvas.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx1Quantized = this.image1QuantizedCanvas.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx2Original = this.image2OriginalCanvas.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx2Dithered = this.image2DitheredCanvas.getContext('2d');
        /**
         *
         * @type {CanvasRenderingContext2D}
         */
        this.ctx2Quantized = this.image2QuantizedCanvas.getContext('2d');
        /**
         *
         * @type {HTMLImageElement}
         */
        this.img1 = new Image();
        this.img1.src = 'image1.jpg';
        this.img1.onload = (e) => this.imageLoaded(e, 1);
        /**
         *
         * @type {HTMLImageElement}
         */
        this.img2 = new Image();
        this.img2.src = 'image2.jpg';
        this.img2.onload = (e) => this.imageLoaded(e, 2);
        this.quantizationInput = document.querySelector("#quantization-factor");

        this.quantizationInput.addEventListener("change", (event) => {
            this.imageLoaded(null, 1);
            this.imageLoaded(null, 2);
        })
    }

    getContext(which) {
        return {
            img: this["img" + which],
            oCanvas: this["image" + which + "OriginalCanvas"],
            dCanvas: this["image" + which + "DitheredCanvas"],
            qCanvas: this["image" + which + "QuantizedCanvas"],
            oCtx: this["ctx" + which + "Original"],
            dCtx: this["ctx" + which + "Dithered"],
            qCtx: this["ctx" + which + "Quantized"]
        }
    }

    getImageData(which) {
        return this["ctx" + which + "Original"].getImageData(0, 0, this["img" + which].width, this["img" + which].height)
    }

    /**
     *
     * @param {number[]} data
     * @param {number} width
     * @param {number} height
     */
    dither(data, width, height) {
        let factor = this.quantizationInput.value;
        let ditheredData = new Array(data.length).fill(0);
        let quantizedData = new Array(data.length).fill(0);

        let rowSize = 4 * width;
        const index = (x, y) => (y * rowSize) + (x * 4)
        const change = (val) => Math.round(factor * val / 255) * Math.floor(255 / factor)
        const update = (x, y, amount) => {
            let i = index(x, y);
            let [r, g, b, a] = [
                change(data[i]),
                change(data[i+1]),
                change(data[i+2]),
                change(data[i+3]),
            ];
            let [eR, eG, eB, eA] = [
                data[i] - r,
                data[i+1] - g,
                data[i+2] - b,
                data[i+3] - a
            ];
            ditheredData[i] = r + eR * amount;
            ditheredData[i+1] = g + eG * amount;
            ditheredData[i+2] = b + eB * amount;
            ditheredData[i+3] = a + eA * amount;
        }
        for (let y = 0; y < height-1; y++) {
            for (let x = 1; x < width-1; x++) {
                update(x+1, y, 7/16);
                update(x-1, y+1, 3/16);
                update(x, y+1, 5/16);
                update(x+1, y+1, 1/16);
                quantizedData[index(x, y)] = change(data[index(x, y)])
                quantizedData[index(x, y)+1] = change(data[index(x, y)+1])
                quantizedData[index(x, y)+2] = change(data[index(x, y)+2])
                quantizedData[index(x, y)+3] = change(data[index(x, y)+3])
            }
        }
        return [ditheredData, quantizedData];
    }

    /**
     *
     * @param {Event} event
     * @param {number} which
     */
    imageLoaded(event, which) {
        let {img, oCanvas, dCanvas, qCanvas, oCtx, dCtx, qCtx} = this.getContext(which);
        let width = img.width;
        let height = img.height;
        oCanvas.width = width;
        oCanvas.height = height;
        dCanvas.width = width;
        dCanvas.height = height;
        qCanvas.width = width;
        qCanvas.height = height;
        oCtx.imageSmoothingEnabled = false;
        oCtx.drawImage(img, 0, 0);

        let [dithered, quantized] = this.dither(Array.from(this.getImageData(which).data), width, height);
        {
            let data = Uint8ClampedArray.from(dithered);
            let newImageData = new ImageData(data, width, height);
            dCtx.imageSmoothingEnabled = false;
            dCtx.clearRect(0, 0, width, height);
            dCtx.putImageData(newImageData, 0, 0);
        }
        {
            let data = Uint8ClampedArray.from(quantized);
            let newImageData = new ImageData(data, width, height);
            qCtx.imageSmoothingEnabled = false;
            qCtx.clearRect(0, 0, width, height);
            qCtx.putImageData(newImageData, 0, 0);
        }
    }
}

