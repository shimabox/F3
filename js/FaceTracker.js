class FaceTracker {
    _v2c;
    _ctracker;
    _stage;
    _parts;

    _useFrontCamera = true;
    _isDebug = false;
    _addEyeLine = false;

    constructor(v2c, ctracker, stage) {
        this._v2c = v2c;
        this._ctracker = ctracker;
        this._stage = stage;
        this._parts = new Map();
    }

    setUp(video) {
        this._startCtracker(video);
        this._stage.setUp(video.width, video.height);
    }

    start() {
        this._v2c.start((canvas) => this._drawLoop(canvas, this._v2c.useFrontCamera()));
    }

    _drawLoop(canvas, useFrontCamera) {
        const positionsFromCtracker = this._ctracker.getCurrentPosition();
        const positions = FaceParts.swapPosition(positionsFromCtracker, useFrontCamera);

        this.clear();

        if (positions === false) {
            return;
        }

        if (this._addEyeLine) {
            this.mosaic();
        }

        this.move(canvas, positions, useFrontCamera);

        if (this._isDebug === true) {
            this._ctracker.draw(canvas);
            this._drawFacePosition(canvas.getContext('2d'), positions);
        }

        _stats();
    }

    add(name, parts) {
        parts.isDebug = this._isDebug;
        this._parts.set(name, parts);
        this._initParts(this._v2c, parts);
        this._stage.append(parts.canvas);
    }

    remove(name) {
        if(! this._parts.has(name)){
            return;
        }

        const parts = this._parts.get(name);

        this._stage.remove(parts.canvas);
        parts.isDebug = this._isDebug;
        parts.clear();
        this._parts.delete(name);
    }

    switchCamera() {
        this._v2c.switchCamera();
        this._init(this._v2c);
    }

    setPosition(val) {
        this._parts.forEach(function (parts) {
            parts.setStyleOfPosition(val);
        });
    }

    setTransform(val) {
        this._parts.forEach(function (parts) {
            parts.setStyleOfTransform(val);
        });
    }

    render(canvas, positions, useFrontCamera) {
        this._parts.forEach(function (parts) {
            let coordinatesOfParts = parts.calcRangeOfCoordinates(positions, useFrontCamera);
            parts.render(canvas, coordinatesOfParts, useFrontCamera);
        });
    }

    move(canvas, positions, useFrontCamera) {
        this._parts.forEach(function (parts) {
            let coordinatesOfParts = parts.calcRangeOfCoordinates(positions, useFrontCamera);
            parts.render(canvas, coordinatesOfParts, useFrontCamera);
            //parts.addPrivacy(coordinatesOfParts, useFrontCamera);
            parts.move(canvas, coordinatesOfParts, useFrontCamera);
        });
    }

    mosaic() {
        this._parts.forEach(function (parts) {
        });
    }

    clear() {
        this._parts.forEach(function (parts) {
            parts.clear();
        });
    }

    getParts(name) {
        if(! this._parts.has(name)){
          return null;
        }

        this._parts.get(name);
    }

    addEyeLine() {
        this._addEyeLine = true;
    }

    removeEyeLine() {
        this._addEyeLine = false;
    }

    startDebug() {
        this._isDebug = true;
        this._parts.forEach(function (parts) {
            parts.isDebug = true;
        });
        this._stage.fadeOut();
    }

    stopDebug() {
        this._isDebug = false;
        this._parts.forEach(function (parts) {
            parts.isDebug = false;
        });
        this._stage.fadeIn();
    }

    _init(v2c) {
        this.setPosition('absolute');

        if (v2c.useFrontCamera() === true) {
            this.setTransform('scaleX(-1)');
        } else {
            this.setTransform('scaleX(1)');
        }
    }

    _initParts(v2c, parts) {
        parts.setPosition('absolute');

        if (v2c.useFrontCamera() === true) {
            parts.setTransform('scaleX(-1)');
        } else {
            parts.setTransform('scaleX(1)');
        }
    }

    _startCtracker(video) {
        this._ctracker.init();
        this._ctracker.start(video);
    }

    _drawFacePosition(ctx, p) {
        for (let i=0;i<p.length;i++) {
            ctx.fillText(i, p[i][0], p[i][1]);
        }
    }
}

/**
 |--------------------------------------------------------------------------
 | stats
 |--------------------------------------------------------------------------
 */
const _stats = () => {
    body.dispatchEvent(event);
}
const body = document.querySelector('body');
// Create the event.
const event = document.createEvent('Event');
// Define that the event name is 'build'.
event.initEvent('drawLoop', true, true);

const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top  = '1em';
stats.domElement.style.left = '1.5em';
body.appendChild(stats.domElement);

// Update stats on every iteration.
document.addEventListener('drawLoop', (e) => stats.update(), false);