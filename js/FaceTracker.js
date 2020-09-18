'use strict';

class FaceTracker {
    constructor(v2c, ctracker, faceCoordinate, stage) {
        this._v2c = v2c;
        this._ctracker = ctracker;
        this._faceCoordinate = faceCoordinate;
        this._stage = stage;
        this._parts = new Map();

        this._useFrontCamera = true;
        this._movable = true;
        this._isDebug = false;

        this._eyeLineType = '';
    }

    setUp(video) {
        this._startCtracker(video);
        this._stage.setUp(video.width, video.height);
    }

    start() {
        this._movable = true;

        this._parts.forEach(function (parts) {
            parts.dragDisabled();
        });

        this._v2c.start((canvas) => this._drawLoop(canvas, this._v2c.useFrontCamera()));
    }

    stop() {
        this._movable = false;

        this._parts.forEach(function (parts) {
            parts.draggable();
        });
    }

    _drawLoop(canvas, useFrontCamera) {
        const positionsFromCtracker = this._ctracker.getCurrentPosition();
        const positions = this._faceCoordinate.swapPosition(positionsFromCtracker, useFrontCamera);

        this.clear();

        if (positions === false) {
            return;
        }

        if (this._movable) {
            this.move(canvas, positions, useFrontCamera);
        } else {
            this.render(canvas, positions, useFrontCamera);
        }

        if (this._eyeLineType !== '') {
            this.eyeLine(positions, useFrontCamera, this._eyeLineType);
        }

        if (this._isDebug === true) {
            this._ctracker.draw(canvas);
            this._drawFacePosition(canvas.getContext('2d'), positions);
        }

        _stats();
    }

    add(name, parts) {
        if (this._movable === false) {
            parts.draggable();
        }
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
        parts.dragDisabled();
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
            const coordinatesOfParts = parts.calcRangeOfCoordinates(positions, useFrontCamera);
            parts.render(canvas, coordinatesOfParts, useFrontCamera);
        });
    }

    move(canvas, positions, useFrontCamera) {
        this._parts.forEach(function (parts) {
            const coordinatesOfParts = parts.calcRangeOfCoordinates(positions, useFrontCamera);
            parts.render(canvas, coordinatesOfParts, useFrontCamera);
            parts.move(canvas, coordinatesOfParts, useFrontCamera);
        });
    }

    eyeLine(positions, useFrontCamera, eyeLineType) {
        for(const parts of this._parts.values()) {
            if (! (parts instanceof Face) && ! (parts instanceof LeftEye) && ! (parts instanceof RightEye)) {
                continue;
            }
            parts.renderEyeLine(positions, useFrontCamera, eyeLineType);
        }
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

    addEyeLine(eyeLineType) {
        this._eyeLineType = eyeLineType;
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
        parts.setStyleOfPosition('absolute');

        if (v2c.useFrontCamera() === true) {
            parts.setStyleOfTransform('scaleX(-1)');
        } else {
            parts.setStyleOfTransform('scaleX(1)');
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
stats.domElement.style.top  = '2em';
stats.domElement.style.left = '1em';
body.appendChild(stats.domElement);

// Update stats on every iteration.
document.addEventListener('drawLoop', (e) => stats.update(), false);