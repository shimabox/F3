class FaceTrackController {
    _faceTracker;

    constructor(faceTracker) {
        this._faceTracker = faceTracker;
        this._setup();
    }

    run() {
        this._faceTracker.start();
    }

    _setup() {
        this._setupDebug();
        this._setupEyeLine();
        this._setUpSwitchCamera();
    }

    _setupDebug() {
        const forDebug = document.querySelector('#for-debug');
        forDebug.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.faceTracker.startDebug();
            } else {
                this.faceTracker.stopDebug();
            }
        });
    }

    _setupEyeLine() {
        const eyeLine = document.querySelector('#eyeLine');
        eyeLine.addEventListener('change', (e) => {
            if (e.target.checked) {
                this.faceTracker.addEyeLine();
            } else {
                this.faceTracker.removeEyeLine();
            }
        });
    }

    _setUpSwitchCamera() {
        const switchCameraButton = document.querySelector('#switch-camera');
        switchCameraButton.addEventListener('click', (e) => {
            this.faceTracker.switchCamera();
        });
    }
}