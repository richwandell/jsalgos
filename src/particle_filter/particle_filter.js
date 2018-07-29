;(function($){

    var canvas, ctx, particle_number = 150, mouse_x = 0, mouse_y = 0,
        ap_image = false, p_ax = 0, p_ay = 0, ap_height = 0,
        mark_width, animate = true, mouse_move = false, particles = [], airplane_position = 0;

    /**
     * A super simple Kalman filter is used to filter noise in the remaining particles in order to derive a true
     * prediction. The true prediction is displayed as a green circle
     *
     * @returns {Function}
     * @constructor
     */
    function Kalman(){
        var cest, pest = 0, mea, kg, eest = 1, emea = 1;

        return function(m) {
            mea = m;
            kg = eest / (eest + emea);
            cest = pest + kg * (mea - pest);
            pest = cest;
            eest = (emea * eest) / (emea + eest);
            return cest;
        }
    }

    function init(){
        canvas = $("#a_canvas")[0];
        ctx = canvas.getContext('2d');

        canvas.width = $(window).width() - 20;
        canvas.height = $(window).height() - 30;

        //mark width is the distance between each particle
        mark_width = canvas.width / particle_number;

        //Airplane is flying at canvas.height / 3 altitude
        ap_height = canvas.height / 3;

        createParticles(particle_number);
        drawTickMarks();

        mouse_x = 0;
        function tick(){
            mouse_x = mouse_x + 1;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            drawAirplane(mouse_x, ap_height);
            drawParticles();
            drawTickMarks();
            if(animate) {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);

        $(canvas).on({
            "contextmenu": function(event){
                animate = !animate;
                mouse_move = !mouse_move;
                createParticles(particle_number);
                requestAnimationFrame(tick);
                return false;
            },
            "mousemove": function(event){
                if(mouse_move) {
                    mouse_x = event.originalEvent.clientX;
                    mouse_y = event.originalEvent.clientY;
                    ctx.fillStyle = "white";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    drawAirplane(mouse_x, ap_height);
                    drawParticles();
                    drawTickMarks();
                }
            },
            "click": function(){
                animate = !animate;
                requestAnimationFrame(tick);
            }
        });

        $("#reset_particles").click(function(e){
            createParticles(particle_number);
            return false;
        });
    }

    /**
     * Populates the particles array
     * x is the particle number 0-n
     * w is the particle weight that will be assigned in the draw particles function
     * h is the height of the particle or our Y coordinate. H is our known land height
     * @param n
     */
    function createParticles(n){
        particles = [];
        for(var x = 0; x < n; x++){
            particles.push({
                x: x,
                w: 0,
                h: getY(mark_width * x)
            });
        }
    }

    /**
     * This emulates a radar reading to determine ground distance which is the difference between the
     * airplanes altitude (ap_height) and the ground height (getY(mouse_x))
     *
     * Both the airplanes altitude and the ground
     *
     * @param x
     * @returns {number}
     */
    function getGroundDistance(x){
        return Math.abs(ap_height - getY(mouse_x));
    }


    function drawParticles(){
        var c_p, diff, x_c, y_c, weight,
            gd = getGroundDistance();

        //draws a green line at the currently measured ground height
        ctx.strokeStyle = "green";
        ctx.moveTo(0, ap_height + gd);
        ctx.lineTo(canvas.width, ap_height + gd);
        ctx.stroke();

        y_c = ap_height + 50;
        for(var x = 0; x < particle_number; x++){
            c_p = particles[x];

            x_c = c_p.x * mark_width;

            // calculate the weight for this particle

            // diff is the difference between the airplanes measured ground height
            // (airplanes height - distance to the ground) or upside down (ap_height + gd)
            // and the actual ground height for the current particle (c_p)

            // ap_height is the Y distance from upper Y to where the airplane is flying

            // gd is the distance from the airplane to the ground, assuming this would use a radio altimeter or radar

            // ap_height + gd is the Y position of the ground (upside down because of pixels in upper left)

            // c_p.h is the height of the current particle which is the actual height of the ground position
            // that this particle represents
            diff = Math.abs((ap_height + gd) - c_p.h);
            weight = Math.max(0, 10 - (diff / 10));
            c_p.w = Math.floor(weight);


            ctx.beginPath();
            ctx.arc(x_c, y_c, weight, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'black';
            ctx.fill();
        }
        resample();

        ctx.beginPath();
        ctx.arc(airplane_position * mark_width, y_c, 10, 0, 2*Math.PI, false);
        ctx.fillStyle = "green";
        ctx.fill();
    }

    function resample(){
        var good_x = [];
        particles = particles.sort(function(a, b){
            if(a.w >= b.w){
                return -1;
            }else{
                return 1;
            }
        });

        var maxWeight = particles[0].w;
        var minWeight = particles[particles.length - 1].w;
        if(minWeight === maxWeight) {
            minWeight = 0;
        }

        function particleNorm(w) {
            return (w - minWeight) / (maxWeight - minWeight);
        }

        var k = new Kalman();
        var est = 0;
        var ps = [];

        for(var i = 0; i < particles.length; i++) {
            var particle = particles[i];

            var numKeep = Math.round(particleNorm(particle.w) * 100);

            for(var j = 0; j < numKeep; j++) {
                ps.push(particle.x);
                ps.push(Math.max(0, particle.x - 1));
                ps.push(particle.x + 1);
            }
            est = k(particle.x);
        }

        var new_particles = [];

        while(new_particles.length < particles.length) {
            var c_x = ps[Math.floor(Math.random() * ps.length)];
            new_particles.push({
                x: c_x,
                w: 0,
                h: getY(c_x * mark_width)
            });
        }
        airplane_position = est;
        particles = new_particles;
    }

    function drawAirplane(x, y){
        if(!ap_image){
            ap_image = document.createElement("img");
            ap_image.src = "ap.png";
            ap_image.onload = function(event){
                ctx.drawImage(ap_image, x - 10, y, 20, 20);
            }
        }else{
            ctx.drawImage(ap_image, x - 10, y, 20, 20);
        }
        p_ax = x;
        p_ay = y;
        if(x > canvas.width){
            airplane_position = 0;
            mouse_x = 0;
            createParticles(particle_number);
        }
    }

    function drawTickMarks(){
        var x_c, y_c;
        ctx.strokeStyle = "black";
        for(var x = 0; x < particle_number; x++){
            x_c = mark_width * x;
            y_c = getY(x_c);
            ctx.moveTo(x_c, canvas.height);
            ctx.lineTo(x_c, y_c);
            ctx.stroke();
        }
    }

    function getY(x){
        var particle_number = Math.floor((x / canvas.width) * 100);

        return canvas.height - Math.abs(particle_number + Math.sin(.2 * particle_number) * 40);
    }

    $(function(){
        init()
    });

})(jQuery);