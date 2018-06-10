import NearestNeighborInterpolation from "./NearestNeighborInterpolation";
import BilinearInterpolation from "./BilinearInterpolation";
import BicubicInterpolation from "./BicubicInterpolation";

new class ImageResizing {
    constructor() {
        console.log("ImageResizing.constructor");
        this.nnInterpolator = new NearestNeighborInterpolation(this);
        this.blInterpolator = new BilinearInterpolation(this);
        this.bcInterpolator = new BicubicInterpolation(this);
        let ims = ["1.png", "2.png", "3.png"];

        let odiv = document.getElementById("original_images");
        let nndiv = document.getElementById("nn_images");
        let bldiv = document.getElementById("bl_images");
        let bcdiv = document.getElementById("bc_images");
        let which = 1;
        for(let im of ims) {
            let ocan = document.createElement("canvas");
            ocan.height = 200;
            ocan.width = 200;
            ocan.id = "image_canvas" + which;
            odiv.appendChild(ocan);
            this["ocan" + which] = ocan;

            let nncan = document.createElement("canvas");
            nncan.height = 200;
            nncan.width = 200;
            nncan.id = "nn_canvas" + which;
            nndiv.appendChild(nncan);
            this["nncan" + which] = nncan;

            let blcan = document.createElement("canvas");
            blcan.height = 200;
            blcan.width = 200;
            blcan.id = "bl_canvas" + which;
            bldiv.appendChild(blcan);
            this["blcan" + which] = blcan;

            let bccan = document.createElement("canvas");
            bccan.height = 200;
            bccan.width = 200;
            bccan.id = "bc_canvas" + which;
            bcdiv.appendChild(bccan);
            this["bccan" + which] = bccan;

            let image = document.createElement("img");
            this["image"+which] = image;
            image.setAttribute("data-which", which);
            image.src = im;
            image.onload = (e) => this.imageLoaded(e);
            which++;
        }
    }

    imageLoaded(e) {
        console.log("ImageResizing.imageLoaded");
        let which = e.target.getAttribute("data-which");
        let can = this["ocan"+which];
        let ctx = can.getContext("2d");
        let img = this["image"+which];
        can.width = img.width;
        can.height = img.height;
        ctx.drawImage(img, 0, 0);
        this.nnInterpolator.run(img, this["ocan"+which], this["nncan"+which], 12);
        this.blInterpolator.run(img, this["ocan"+which], this["blcan"+which], 12);
        this.bcInterpolator.run(img, this["ocan"+which], this["bccan"+which], 12);
    }
};