new class Mandelbrot {
    constructor() {
        this.canvas = document.getElementById("the_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.slider = document.getElementById("range_slider");
        this.slider1 = document.getElementById("range_slider1");
        this.height = 500;
        this.width = 500;
        this.depth = Number(this.slider.value);
        this.depth1 = Number(this.slider1.value);

        this.canvas.height = this.height;
        this.canvas.width = this.width;

        this.slider.addEventListener("input", () => {
            this.depth = Number(this.slider.value);
        });

        this.slider1.addEventListener("input", () => {
            this.depth1 = Number(this.slider1.value);
        });

        window.requestAnimationFrame(() => {
            this.draw()
        });
    }

    map (num, in_min, in_max, out_min, out_max) {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }

    draw() {
        let imageData = this.ctx.getImageData(0, 0, this.width, this.height);

        let max = 100;
        for(let x = 0; x < this.width; x++){
            for(let y = 0; y < this.height; y++){
                let a = this.map(x, 0, this.width, this.depth, this.depth1);
                let b = this.map(y, 0, this.height, this.depth, this.depth1);

                let start = ((y * (imageData.width * 4)) + (x * 4));


                let n = 0;
                let ca = a;
                let cb = b;

                while(n < max) {
                    let aa = a*a - b*b;
                    let bb = 2 * a * b;

                    a = aa + ca;
                    b = bb + cb;

                    if(Math.abs(aa + bb) > 16) {
                        break;
                    }
                    n++;
                }

                let bright = this.map(n, 0, max, 0, 1);
                bright = this.map(Math.sqrt(bright), 0, 1, 0, 255);

                if(n === max){
                    bright = 0;
                }
                imageData.data[start] = bright;
                imageData.data[start + 1] = bright;
                imageData.data[start + 2] = bright;
                imageData.data[start + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
        window.requestAnimationFrame(() => this.draw())
    }
};