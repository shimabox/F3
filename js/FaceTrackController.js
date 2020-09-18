'use strict';

class FaceTrackController {
    constructor(faceTracker) {
        this._faceTracker = faceTracker;

        this._playButton = document.querySelector('#play');

        this._guiParameter = {
            face: false,
            leftEye: true,
            rightEye: true,
            nose: true,
            mouth: true,
            none: true,
            mosaic: false,
            line:false,
            autoPlace: false
        }
        this._gui = new dat.GUI(this._guiParameter);

        this.leftEye = new LeftEye(document.createElement('canvas'));
        this.leftEyeBlow = new LeftEyeBlow(document.createElement('canvas'));;
        this.rightEye = new RightEye(document.createElement('canvas'));;
        this.rightEyeBlow = new RightEyeBlow(document.createElement('canvas'));;
        this.nose = new Nose(document.createElement('canvas'));;
        this.mouth = new Mouth(document.createElement('canvas'));;

        this._setUp();
    }

    run() {
        this._faceTracker.start();
    }

    _setUp() {
        this._setUpPlayButton();
        this._setUpSwitchCamera();
        this._setUpDebug();
        this._setUpGuiDat();
    }

    _setUpPlayButton() {
        this._playButton.addEventListener('click', (e) => {
            if (e.target.checked) {
                this._faceTracker.start();
            } else {
                this._faceTracker.stop();
            }
        })
    }

    _setUpSwitchCamera() {
        const switchCameraButton = document.querySelector('#switch-camera');
        switchCameraButton.addEventListener('click', (e) => {
            this._faceTracker.switchCamera();
        })
    }

    _setUpDebug() {
        const forDebug = document.querySelector('#debug');
        forDebug.addEventListener('change', (e) => {
            if (e.target.checked) {
                this._faceTracker.startDebug();
            } else {
                this._faceTracker.stopDebug();
            }
        })
    }

    _setUpGuiDat() {
        this._gui.close();
        document.querySelector('#guiController').appendChild(this._gui.domElement);

        this._setUpFaceController();
        this._setUpFacePartsController();
        this._setUpEyeLineController();
    }

    _setUpFaceController() {
        const face = new Face(document.createElement('canvas'));
        this._gui.add(this._guiParameter, 'face')
            .name('Face Only')
            .listen()
            .onChange((checked) => setFaceOnly('face', checked));

        const setFaceOnly = (prop, checked) => {
            const partsParameter = {
                'leftEye': this.leftEye,
                'rightEye': this.rightEye,
                'nose': this.nose,
                'mouth': this.mouth
            }

            this._guiParameter[prop] = checked;

            if (checked) {
                for (const name of Object.keys(partsParameter)) {
                    this._guiParameter[name] = false;
                    this._faceTracker.remove(name);
                }
                this._faceTracker.remove('leftEyeBlow');
                this._faceTracker.remove('rightEyeBlow');
                this._faceTracker.add('face', face);
                this._addDragEventIfStopped(face);
                return;
            }

            for (const [name, parts] of Object.entries(partsParameter)) {
                this._guiParameter[name] = true;
                this._faceTracker.add(name, parts);
                this._addDragEventIfStopped(parts);
            }
            this._faceTracker.add('leftEyeBlow', this.leftEyeBlow);
            this._addDragEventIfStopped(this.leftEyeBlow);
            this._faceTracker.add('rightEyeBlow', this.rightEyeBlow);
            this._addDragEventIfStopped(this.rightEyeBlow);
            this._faceTracker.remove('face');
        }
    }

    _setUpFacePartsController() {
        const facePartsFolder = this._gui.addFolder('Face Parts');
        facePartsFolder.open();

        this._setUpLeftEyePartsController(facePartsFolder);
        this._setUpRightEyePartsController(facePartsFolder);
        this._setUpNosePartsController(facePartsFolder);
        this._setUpMouthEyePartsController(facePartsFolder);
    }

    _setUpLeftEyePartsController(folder) {
        const leftEyeController = folder.add(this._guiParameter, 'leftEye').name('Left Eye');

        if (leftEyeController.getValue() === true) {
            this._faceTracker.add('leftEye', this.leftEye);
            this._faceTracker.add('leftEyeBlow', this.leftEyeBlow);
        }

        leftEyeController.listen().onChange((checked) => {
            if (checked) {
                this._faceTracker.add('leftEye', this.leftEye);
                this._faceTracker.add('leftEyeBlow', this.leftEyeBlow);
                this._addDragEventIfStopped(this.leftEye);
                this._addDragEventIfStopped(this.leftEyeBlow);

                this._guiParameter['face'] = false;
                this._faceTracker.remove('face');
            } else {
                this._faceTracker.remove('leftEye');
                this._faceTracker.remove('leftEyeBlow');
            }
        });
    }

    _setUpRightEyePartsController(folder) {
        const rightEyeController = folder.add(this._guiParameter, 'rightEye').name('Right Eye');

        if (rightEyeController.getValue() === true) {
            this._faceTracker.add('rightEye', this.rightEye);
            this._faceTracker.add('rightEyeBlow', this.rightEyeBlow);
        }

        rightEyeController.listen().onChange((checked) => {
            if (checked) {
                this._faceTracker.add('rightEye', this.rightEye);
                this._faceTracker.add('rightEyeBlow', this.rightEyeBlow);
                this._addDragEventIfStopped(this.rightEye);
                this._addDragEventIfStopped(this.rightEyeBlow);

                this._guiParameter['face'] = false;
                this._faceTracker.remove('face');
            } else {
                this._faceTracker.remove('rightEye');
                this._faceTracker.remove('rightEyeBlow');
            }
        });
    }

    _setUpNosePartsController(folder) {
        const noseController = folder.add(this._guiParameter, 'nose').name('Nose');
        if (noseController.getValue() === true) {
            this._faceTracker.add('nose', this.nose);
        }
        noseController.listen().onChange((checked) => {
            if (checked) {
                this._faceTracker.add('nose', this.nose);
                this._addDragEventIfStopped(this.nose);

                this._guiParameter['face'] = false;
                this._faceTracker.remove('face');
            } else {
                this._faceTracker.remove('nose');
            }
        });
    }

    _setUpMouthEyePartsController(folder) {
        const mouthController = folder.add(this._guiParameter, 'mouth').name('Mouth');
        if (mouthController.getValue() === true) {
            this._faceTracker.add('mouth', this.mouth);
        }
        mouthController.listen().onChange((checked) => {
            if (checked) {
                this._faceTracker.add('mouth', this.mouth);
                this._addDragEventIfStopped(this.mouth);

                this._guiParameter['face'] = false;
                this._faceTracker.remove('face');
            } else {
                this._faceTracker.remove('mouth');
            }
        });
    }

    _setUpEyeLineController() {
        const eyeLine = this._gui.addFolder('Eye Line');
        eyeLine.open();

        const none = eyeLine.add(this._guiParameter, 'none')
            .listen()
            .onChange(() => setEyeLine('none'));
        const mosaic = eyeLine.add(this._guiParameter, 'mosaic')
            .listen()
            .onChange(() => setEyeLine('mosaic'));
        const line = eyeLine.add(this._guiParameter, 'line')
            .listen()
            .onChange(() => setEyeLine('line'));

        const setEyeLine = (prop) => {
            const eyeLineParameter = [
                'none',
                'mosaic',
                'line'
            ]
            for (const param of eyeLineParameter){
                this._guiParameter[param] = false;
            }
            this._guiParameter[prop] = true;

            if (prop !== 'none') {
                this._faceTracker.addEyeLine(prop);
                return;
            }
            this._faceTracker.addEyeLine('');
        }
    }

    _addDragEventIfStopped(parts) {
        if (this._playButton.checked) {
            return;
        }
        parts.draggable();
    }
}