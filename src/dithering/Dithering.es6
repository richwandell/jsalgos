new class Dithering {

    constructor() {
        /**
         *
         * @type {HTMLImageElement}
         */
        this.img = new Image();
        this.img.src = 'image1.jpg';
        this.img.onload = (e) => this.image1Loaded(e);
    }

    /**
     *
     * @param {Event} event
     */
    image1Loaded(event) {
        console.log(event)
    }
}

