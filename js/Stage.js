class Stage {
    _stage;

    constructor(selector) {
        this._stage = document.querySelector(selector);
        this.fadeIn();
    }

    setUp(width, height) {
        this._stage.style.display = 'block';
        this._stage.style.width   = (width + 2) + 'px';
        this._stage.style.height  = (height + 2) + 'px';
    }

    append(node) {
        this._stage.appendChild(node);
    }

    remove(node) {
        this._stage.removeChild(node);
    }

    fadeIn() {
        this._stage.classList.remove('fadeout');
        this._stage.classList.add('fadein');
    }

    fadeOut() {
        this._stage.classList.remove('fadein');
        this._stage.classList.add('fadeout');
    }
}