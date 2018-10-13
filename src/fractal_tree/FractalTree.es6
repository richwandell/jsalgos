new class FractalTree {
    constructor() {
        this.canvas = document.getElementById("the_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.slider = document.getElementById("range_slider");
        this.height = 1000;
        this.width = 1000;
        this.angle = this.slider.value;

        this.canvas.height = this.height;
        this.canvas.width = this.width;

        this.slider.addEventListener("input", () => {
            this.angle = this.slider.value
        });

        window.requestAnimationFrame(() => {
            this.draw()
        });
    }

    draw() {
        this.ctx.fillStyle = "white";
        this.ctx.clearRect(0.0, 0.0, this.width, this.height);

        let len = 300.0;
        let start = [0.0, this.height / 2];
        let end = [start[0] + len, start[1]];

        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.moveTo(start[0], start[1]);
        this.ctx.lineTo(end[0], end[1]);
        this.ctx.stroke();

        this.branch(end, len * 0.67, 1);
        this.branch(end, len * 0.67, -1)

        window.requestAnimationFrame(() => this.draw())
    }

    branch(start, len, depth) {
        let end = [
            start[0] + (len * Math.cos(this.angle * depth)),
            start[1] + (len * Math.sin(this.angle * depth))
        ];

        this.ctx.beginPath();
        this.ctx.strokeStyle = "black";
        this.ctx.moveTo(start[0], start[1]);

        this.ctx.lineTo(end[0], end[1]);
        this.ctx.stroke();

        if(len > 4) {
            this.branch(end, len * 0.67, depth + 1);
            this.branch(end, len * 0.67, depth - 1);
        }
    }
}