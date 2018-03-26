new class Project {

    constructor() {
        $(() => {
            this.can = $("#geometry_canvas")[0];
            this.ctx = this.can.getContext('2d', {alpha: false});
            this.can.width = window.innerWidth;
            this.can.height = window.innerHeight;
            this.rotationX = Number($("#rotationx").val());
            this.rotationY = Number($("#rotationy").val());
            this.rotationZ = Number($("#rotationz").val());
            this.projection = $("#projection").val();
            this.boxZ = Number($("#boxz").val());
            this.mouseX = this.can.width / 2;
            this.mouseY = this.can.height / 2;
            this.camera = {
                x: 0,
                y: 0,
                z: Number($("#focallength").val()),
                rx: 0,
                ry: 0,
                rz: 0,
                width: this.can.width,
                height: this.can.height,
                center: {
                    x: this.can.width / 2,
                    y: this.can.height / 2
                }
            };
            this.bindEvents();
            requestAnimationFrame(() => this.draw());
        });
    }

    bindEvents() {
        $("#boxz").change(() => {
            this.boxZ = Number($("#boxz").val());
        });
        $("#focallength").change(() => {
            this.camera.z = Number($("#focallength").val());
        });
        $("#projection").change(() => {
            this.projection = $("#projection").val();
        });
        $("#rotationx").change(() => {
            this.rotationX = Number($("#rotationx").val());
        });
        $("#rotationy").change(() => {
            this.rotationY = Number($("#rotationy").val());
        });
        $("#rotationz").change(() => {
            this.rotationZ = Number($("#rotationz").val());
        });
        $(this.can).on({
            "wheel": (e) => {
                this.boxZ += e.originalEvent.deltaY;
            },
            "mouseup": (e) => {
                this.mouseDown = false;
            },
            "mousedown": (e) => {
                this.mouseDown = true;
                this.mouseStartX = e.originalEvent.clientX;
                this.mouseStartY = e.originalEvent.clientY;
                this.mouseStartRotationX = this.rotationX;
                this.mouseStartRotationY = this.rotationY;
            },
            "mousemove": (e) => {
                this.mouseX = e.originalEvent.clientX;
                this.mouseY = e.originalEvent.clientY;

                if(this.mouseDown) {
                    this.rotationX = this.mouseStartRotationX + (this.mouseStartX - this.mouseX);
                    this.rotationY = this.mouseStartRotationY + (this.mouseStartY - this.mouseY);
                    $("#rotationx").val(this.rotationX);
                    $("#rotationy").val(this.rotationY);
                }
            },
            "touchstart": (e) => {
                this.mouseStartX = e.originalEvent.changedTouches[0].clientX;
                this.mouseStartY = e.originalEvent.changedTouches[0].clientY;
                this.mouseStartRotationX = this.rotationX;
                this.mouseStartRotationY = this.rotationY;
                if(e.originalEvent.changedTouches.length > 1) {
                    this.pinching = true;
                    this.pinchingX = e.originalEvent.changedTouches[1].clientX;
                    this.pinchingY = e.originalEvent.changedTouches[1].clientY;
                    this.pinchDistance = this.distance([this.mouseStartX, this.mouseStartY], [this.poinchingX, this.pinchingY]);
                } else {
                    this.pinching = false;
                }
            },
            "touchmove": (e) => {
                this.mouseX = e.originalEvent.changedTouches[0].clientX;
                this.mouseY = e.originalEvent.changedTouches[0].clientY;

                if(e.originalEvent.changedTouches.length > 1) {
                    this.rotationX = this.mouseStartRotationX + (this.mouseStartX - this.mouseX);
                    this.rotationY = this.mouseStartRotationY + (this.mouseStartY - this.mouseY);
                    $("#rotationx").val(this.rotationX);
                    $("#rotationy").val(this.rotationY);
                    let currentDistance = this.distance([
                        e.originalEvent.changedTouches[0].clientX,
                        e.originalEvent.changedTouches[0].clientY
                    ], [
                        e.originalEvent.changedTouches[1].clientX,
                        e.originalEvent.changedTouches[1].clientY
                    ]);
                    this.boxZ += (this.pinchDistance - currentDistance);
                }
            },
            "touchend": (e) => {
                this.mouseX = e.originalEvent.changedTouches[0].clientX;
                this.mouseY = e.originalEvent.changedTouches[0].clientY;
            }
        });
    }

    distance(point1, point2) {
        return Math.sqrt(
            Math.pow(
                Math.abs(point1[0] - point2[0])
            ) + Math.pow(
                Math.abs(point1[1] - point2[1])
            )
        );
    }

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.can.width, this.can.height);

        this.drawSquare();
        this.drawBox();

        requestAnimationFrame(() => this.draw());
    }

    drawBox() {
        let size = 200;
        let x = this.mouseX;
        let y = this.mouseY;
        if(this.projection === "p") {
            x = (this.can.width / 2) - this.mouseX;
            y = (this.can.height / 2) - this.mouseY;
        }
        let z = this.boxZ;

        let c = math.matrix([
            [x - size, y - size, z - size],
            [x + size, y - size, z - size],
            [x + size, y + size, z - size],
            [x - size, y + size, z - size],

            [x - size, y - size, z + size],
            [x + size, y - size, z + size],
            [x + size, y + size, z + size],
            [x - size, y + size, z + size]
        ]);

        c = this.makeHomogeneous(c);
        //find our centroid for the translation matrix
        let center = this.getCentroid3d(c).toArray();

        c = this.rotate3d(c, center, this.rotationX, this.rotationY, this.rotationZ);

        let v;
        switch(this.projection) {
            case "o":
                v = this.projectOrthographic(c);
                break;

            case "p":
                v = this.projectPerspective(c, center);
                break;
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(255, 0, 0)";
        this.ctx.moveTo(v[0][0], v[0][1]);
        this.ctx.lineTo(v[1][0], v[1][1]);
        this.ctx.lineTo(v[2][0], v[2][1]);
        this.ctx.lineTo(v[3][0], v[3][1]);
        this.ctx.lineTo(v[0][0], v[0][1]);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(0, 255, 0)";
        this.ctx.moveTo(v[4][0], v[4][1]);
        this.ctx.lineTo(v[5][0], v[5][1]);
        this.ctx.lineTo(v[6][0], v[6][1]);
        this.ctx.lineTo(v[7][0], v[7][1]);
        this.ctx.lineTo(v[4][0], v[4][1]);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(0, 0, 255)";
        this.ctx.moveTo(v[0][0], v[0][1]);
        this.ctx.lineTo(v[4][0], v[4][1]);
        this.ctx.lineTo(v[7][0], v[7][1]);
        this.ctx.lineTo(v[3][0], v[3][1]);
        this.ctx.lineTo(v[0][0], v[0][1]);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(255, 255, 255)";
        this.ctx.moveTo(v[1][0], v[1][1]);
        this.ctx.lineTo(v[5][0], v[5][1]);
        this.ctx.lineTo(v[6][0], v[6][1]);
        this.ctx.lineTo(v[2][0], v[2][1]);
        this.ctx.lineTo(v[1][0], v[1][1]);
        this.ctx.stroke();

    }

    rotate3d(c, center, xRotation, yRotation, zRotation) {
        //change theta into radians
        xRotation = xRotation * (Math.PI / 180);
        yRotation = yRotation * (Math.PI / 180);
        zRotation = zRotation * (Math.PI / 180);

        let translateCenterMatrix = math.matrix([
            [1, 0, 0, -center[0]],
            [0, 1, 0, -center[1]],
            [0, 0, 1, -center[2]],
            [0, 0, 0, 1]
        ]);

        let translateBackMatrix = math.matrix([
            [1, 0, 0, center[0]],
            [0, 1, 0, center[1]],
            [0, 0, 1, center[2]],
            [0, 0, 0, 1]
        ]);

        let xRotationMatrix = math.matrix([
            [1, 0, 0, 0],
            [0, Math.cos(xRotation), -Math.sin(xRotation), 0],
            [0, Math.sin(xRotation), Math.cos(xRotation), 0],
            [0, 0, 0, 1]
        ]);

        let yRotationMatrix = math.matrix([
            [Math.cos(yRotation), 0, -Math.sin(yRotation), 0],
            [0, 1, 0, 0],
            [Math.sin(yRotation), 0, Math.cos(yRotation), 0],
            [0, 0, 0, 1]
        ]);

        let zRotationMatrix = math.matrix([
            [Math.cos(zRotation), -Math.sin(zRotation), 0, 0],
            [Math.sin(zRotation), Math.cos(zRotation), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);

        let newc = [];
        for(let row of c._data) {
            row = math.multiply(translateCenterMatrix, row);
            row = math.multiply(xRotationMatrix, row);
            row = math.multiply(yRotationMatrix, row);
            row = math.multiply(zRotationMatrix, row);
            row = math.multiply(translateBackMatrix, row);
            newc.push(row);
        }
        return math.matrix(newc);
    }

    projectPerspective(vertexes) {
        let d = this.camera.z;

        let translateBackMatrix = math.matrix([
            [1, 0, this.can.width / 2],
            [0, 1, this.can.height / 2],
            [0, 0, 1]
        ]);

        let vs = [];
        for(let row of vertexes._data) {
            let x = d * (row[0] / row[2]);
            let y = d * (row[1] / row[2]);
            row = math.matrix([x, y, 1]);
            row = math.multiply(translateBackMatrix, row);
            vs.push([row._data[0], row._data[1]]);
        }
        return vs;
    }

    projectOrthographic(vertexes) {
        let vs = [];
        for(let v of vertexes._data) {
            vs.push([v[0], v[1]]);
        }
        return vs;
    }

    drawSquare() {
        let size = 200;
        let x = this.mouseX - size / 2;
        let y = this.mouseY - size / 2;

        let c = math.matrix([
            [x, y],
            [x + size, y],
            [x + size, y + size],
            [x, y + size]
        ]);

        c = this.makeHomogeneous(c);


        c = this.rotate2d(c, this.rotationX).toArray();

        this.ctx.fillStyle = "rgb(255, 255, 255)";
        this.ctx.beginPath();
        this.ctx.moveTo(c[0][0], c[0][1]);
        this.ctx.lineTo(c[1][0], c[1][1]);
        this.ctx.lineTo(c[2][0], c[2][1]);
        this.ctx.lineTo(c[3][0], c[3][1]);
        this.ctx.closePath();
        this.ctx.fill();
    }

    makeHomogeneous(c) {
        //Transform coordinate into homogeneous coordinate
        c.resize([c.size()[0], c.size()[1]+1], 1);
        return c;
    }

    /**
     *
     * @param {DenseMatrix} c
     * @param theta
     * @returns {DenseMatrix}
     */
    rotate2d(c, theta) {
        //change theta into radians
        theta = theta * (Math.PI / 180);
        //find our centroid for the translation matrix
        let center = this.getCentroid2d(c).toArray();

        let rotationMatrix = math.matrix([
            [Math.cos(theta), -Math.sin(theta), 0],
            [Math.sin(theta), Math.cos(theta), 0],
            [0, 0, 1]
        ]);
        let translateCenterMatrix = math.matrix([
            [1, 0, -center[0]],
            [0, 1, -center[1]],
            [0, 0, 1]
        ]);
        let translateBackMatrix = math.matrix([
            [1, 0, center[0]],
            [0, 1, center[1]],
            [0, 0, 1]
        ]);

        let newc = [];
        for(let row of c._data) {
            let tcm = math.multiply(translateCenterMatrix, row);
            let rm = math.multiply(rotationMatrix, tcm);
            let tbm = math.multiply(translateBackMatrix, rm);
            newc.push(tbm);
        }
        return math.matrix(newc);
    }

    getCentroid2d(points){
        let x = 0, y = 0;
        for(let p of points._data) {
            x += p[0];
            y += p[1];
        }
        return math.matrix([x / points._data.length, y / points._data.length]);
    }

    getCentroid3d(points){
        let x = 0, y = 0, z = 0;
        for(let p of points._data) {
            x += p[0];
            y += p[1];
            z += p[2];
        }
        return math.matrix([
            x / points._data.length,
            y / points._data.length,
            z / points._data.length
        ]);
    }
};