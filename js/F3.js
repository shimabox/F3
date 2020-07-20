document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const ctracker = new clm.tracker();

    const leftEyeCanvas = document.querySelector('#left-eye');
    const leftEyeCanvasCtx = leftEyeCanvas.getContext('2d');
    const leftEyeParts = document.querySelector('#left-eye-parts');
    let showLeftEyeParts = leftEyeParts.checked;
    leftEyeParts.addEventListener('change', (e) => {
        showLeftEyeParts = e.target.checked;
    });

    const rightEyeCanvas = document.querySelector('#right-eye');
    const rightEyeCanvasCtx = rightEyeCanvas.getContext('2d');
    const rightEyeParts = document.querySelector('#right-eye-parts');
    let showRightEyeParts = rightEyeParts.checked;
    rightEyeParts.addEventListener('change', (e) => {
        showRightEyeParts = e.target.checked;
    });

    const noseCanvas = document.querySelector('#nose');
    const noseCanvasCtx = noseCanvas.getContext('2d');
    const noseParts = document.querySelector('#nose-parts');
    let showNoseParts = noseParts.checked;;
    noseParts.addEventListener('change', (e) => {
        showNoseParts = e.target.checked;
    });

    const mouthCanvas = document.querySelector('#mouth');
    const mouthCanvasCtx = mouthCanvas.getContext('2d');
    const mouthParts = document.querySelector('#mouth-parts');
    let showMouthParts = mouthParts.checked;;
    mouthParts.addEventListener('change', (e) => {
        showMouthParts = e.target.checked;
    });

    const overlay = document.querySelector('#overlay');

    /**
     * debug
     */
    const forDebug = document.querySelector('#for-debug');
    let isDebug = forDebug.checked;
    forDebug.addEventListener('change', (e) => {
        if (e.target.checked) {
            isDebug = true;
            overlay.classList.remove('fadein');
            overlay.classList.add('fadeout');
        } else {
            isDebug = false;
            overlay.classList.remove('fadeout');
            overlay.classList.add('fadein');
        }
    });

    /**
     * privacy
     */
    const privacy = document.querySelector('#privacy');
    let isPrivate = privacy.checked;
    privacy.addEventListener('change', (e) => {
        if (e.target.checked) {
            isPrivate = true;
        } else {
            isPrivate = false;
        }
    });

    const switchCameraButton = document.querySelector('#switch-camera');
    switchCameraButton.addEventListener('click', (e) => {
        v2c.switchCamera();
        setUseFrontCamera(v2c.useFrontCamera());
    });

    let _useFrontCamera = false;
    const setUseFrontCamera = useFrontCamera => {
        _useFrontCamera = useFrontCamera;

        leftEyeCanvas.style.position = 'absolute';
        rightEyeCanvas.style.position = 'absolute';
        noseCanvas.style.position = 'absolute';
        mouthCanvas.style.position = 'absolute';

        if (_useFrontCamera === true) {
            leftEyeCanvas.style.transform = 'scaleX(-1)';
            rightEyeCanvas.style.transform = 'scaleX(-1)';
            noseCanvas.style.transform = 'scaleX(-1)';
            mouthCanvas.style.transform = 'scaleX(-1)';
        } else {
            leftEyeCanvas.style.transform = 'scaleX(1)';
            rightEyeCanvas.style.transform = 'scaleX(1)';
            noseCanvas.style.transform = 'scaleX(1)';
            mouthCanvas.style.transform = 'scaleX(1)';
        }
    }

    /**
     * 顔座標のindex
     * scaleX(-1) している場合(前面カメラ利用時)、座標が鏡のように左右入れ替わるので
     * それを補填する
     */
    const faceCoordinateIndexForMapping = [
        // 輪郭
        {'from': 0,  'to' : 14},
        {'from': 1,  'to' : 13},
        {'from': 2,  'to' : 12},
        {'from': 3,  'to' : 11},
        {'from': 4,  'to' : 10},
        {'from': 5,  'to' : 9},
        {'from': 6,  'to' : 8},
        {'from': 7,  'to' : 7},
        {'from': 8,  'to' : 6},
        {'from': 9,  'to' : 5},
        {'from': 10, 'to' : 4},
        {'from': 11, 'to' : 3},
        {'from': 12, 'to' : 2},
        {'from': 13, 'to' : 1},
        {'from': 14, 'to' : 0},
        // 左眉
        {'from': 19, 'to' : 15},
        {'from': 20, 'to' : 16},
        {'from': 21, 'to' : 17},
        {'from': 22, 'to' : 18},
        // 左目
        {'from': 24, 'to' : 29},
        {'from': 27, 'to' : 32},
        {'from': 26, 'to' : 31},
        {'from': 66, 'to' : 70},
        {'from': 23, 'to' : 28},
        {'from': 63, 'to' : 67},
        {'from': 64, 'to' : 68},
        {'from': 25, 'to' : 30},
        {'from': 65, 'to' : 69},
        // 右眉
        {'from': 18, 'to' : 22},
        {'from': 17, 'to' : 21},
        {'from': 16, 'to' : 20},
        {'from': 15, 'to' : 19},
        // 右目
        {'from': 29, 'to' : 24},
        {'from': 32, 'to' : 27},
        {'from': 31, 'to' : 26},
        {'from': 69, 'to' : 65},
        {'from': 30, 'to' : 25},
        {'from': 68, 'to' : 64},
        {'from': 67, 'to' : 63},
        {'from': 28, 'to' : 23},
        {'from': 70, 'to' : 66},
        // 鼻
        {'from': 33, 'to' : 33},
        {'from': 41, 'to' : 41},
        {'from': 62, 'to' : 62},
        {'from': 37, 'to' : 37},
        {'from': 34, 'to' : 40},
        {'from': 35, 'to' : 39},
        {'from': 36, 'to' : 38},
        {'from': 42, 'to' : 43},
        {'from': 43, 'to' : 42},
        {'from': 38, 'to' : 36},
        {'from': 39, 'to' : 35},
        {'from': 40, 'to' : 34},
        // 口
        {'from': 47, 'to' : 47},
        {'from': 46, 'to' : 48},
        {'from': 45, 'to' : 49},
        {'from': 44, 'to' : 50},
        {'from': 61, 'to' : 59},
        {'from': 60, 'to' : 60},
        {'from': 56, 'to' : 58},
        {'from': 57, 'to' : 57},
        {'from': 55, 'to' : 51},
        {'from': 54, 'to' : 52},
        {'from': 53, 'to' : 53},
        {'from': 52, 'to' : 54},
        {'from': 51, 'to' : 55},
        {'from': 50, 'to' : 44},
        {'from': 58, 'to' : 56},
        {'from': 59, 'to' : 61},
        {'from': 49, 'to' : 45},
        {'from': 48, 'to' : 46},
    ];

    const getMeasurementSize = () => {
        let _o = window.orientation;
        let _orientation = _o === undefined ? 90 : _o;
        if (_orientation === 0 || _orientation === 180) {
            return window.innerHeight;
        }
        return window.innerWidth;
    }
    const longSideSize = getMeasurementSize();

    const callbackOnLoadedmetadataVideo = video => {
        startCtracker(video);

        overlay.style.display = 'block';
        overlay.style.width   = (video.width + 2) + 'px';
        overlay.style.height  = (video.height + 2) + 'px';
    }

    const startCtracker = video => {
        ctracker.init();
        ctracker.start(video);
    }

    const callbackOnAfterVideoLoadError = err => {
        alert(err);
    }

    const option = {
        'longSideSize': longSideSize,
        'callbackOnLoadedmetadataVideo': callbackOnLoadedmetadataVideo,
        'callbackOnAfterVideoLoadError': callbackOnAfterVideoLoadError,
    };

    const v2c = new V2C('#wrapper', option);
    setUseFrontCamera(v2c.useFrontCamera());
    v2c.start((canvas) => drawLoop(canvas, v2c.useFrontCamera()));

    const drawLoop = (canvas, useFrontCamera) => {
        const positionsFromCtracker = ctracker.getCurrentPosition();
        const positions = swapPosition(useFrontCamera, positionsFromCtracker);
        if (positions !== false) {

            if (showLeftEyeParts) {
                renderFaceCanvas('leftEye', positions, canvas, leftEyeCanvas, leftEyeCanvasCtx, [19, 23], [20, 21], [22, 25], [26, 65, 66], useFrontCamera);
            } else if (!showLeftEyeParts) {
                clearFaceCanvas(leftEyeCanvas, leftEyeCanvasCtx);
            }

            if (showRightEyeParts) {
                renderFaceCanvas('rightEye', positions, canvas, rightEyeCanvas, rightEyeCanvasCtx, [18, 30], [16, 17], [15, 28], [31, 69, 70], useFrontCamera);
            } else if (!showRightEyeParts) {
                clearFaceCanvas(rightEyeCanvas, rightEyeCanvasCtx);
            }

            if (showNoseParts) {
                renderFaceCanvas('nose', positions, canvas, noseCanvas, noseCanvasCtx, [34, 35, 36], [33], [38, 39, 40], [36, 37, 38], useFrontCamera, true);
            } else if (!showNoseParts) {
                clearFaceCanvas(noseCanvas, noseCanvasCtx);
            }

            if (showMouthParts) {
                renderFaceCanvas('mouth', positions, canvas, mouthCanvas, mouthCanvasCtx, [44, 45, 55], [45, 46, 47, 48, 49], [49, 50, 51], [51, 52, 53, 54, 55], useFrontCamera);
            } else if (!showMouthParts) {
                clearFaceCanvas(mouthCanvas, mouthCanvasCtx);
            }

            if (isDebug === true) {
                ctracker.draw(canvas);
                drawFacePosition(canvas.getContext('2d'), positions);
            }

        } else {
            clearFaceCanvas(leftEyeCanvas, leftEyeCanvasCtx);
            clearFaceCanvas(rightEyeCanvas, rightEyeCanvasCtx);
            clearFaceCanvas(noseCanvas, noseCanvasCtx);
            clearFaceCanvas(mouthCanvas, mouthCanvasCtx);
        }

        _stats();
    }

    const swapPosition = (useFrontCamera, positions) => {
        if (positions === false) {
            return false;
        }

        if (useFrontCamera === false) {
            return positions;
        }

        let afterSwappingPosition = [];
        for (let i=0;i<faceCoordinateIndexForMapping.length;i++) {
            afterSwappingPosition[faceCoordinateIndexForMapping[i].to] = positions[faceCoordinateIndexForMapping[i].from];
        }

        return afterSwappingPosition;
    }

    const drawFacePosition = (ctx, p) => {
        for (let i=0;i<p.length;i++) {
            ctx.fillText(i, p[i][0], p[i][1]);
        }
    }

    const clearFaceCanvas = (canvas, ctx) => {
        canvas.width  = 0;
        canvas.height = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * render
     */
    const renderFaceCanvas = (
        partsName, p, canvas, targetCanvas, targetCanvasCtx,
        indexOfMinX, indexOfMinY, indexOfMaxX, indexOfMaxY,
        useFrontCamera, isNose = false
    ) => {
        // マージン設定
        let scale = isNose ? 1 / 35 : 1 / 15;
        let marginOfTopScale    = isNose ? 8 * scale : 8 * scale;  // 該当パーツの何%分上にマージンを取るか(marginOfBottomScaleとの調整が必要)
        let marginOfBottomScale = isNose ? 12 * scale : 17 * scale; // 該当パーツの何%分下にマージンを取るか(marginOfTopScaleとの調整が必要)
        let marginOfLeftScale   = 4 * scale;  // 該当パーツの何%分左にマージンを取るか(marginOfRightScaleとの調整が必要)
        let marginOfRightScale  = 8 * scale;  // 該当パーツの何%分右にマージンを取るか(marginOfLeftScaleとの調整が必要)

        const coordinatesOfParts = calcRangeOfCoordinates(p, indexOfMinX, indexOfMinY, indexOfMaxX, indexOfMaxY, useFrontCamera);
        const partsW = coordinatesOfParts.maxX - coordinatesOfParts.minX;
        const partsH = coordinatesOfParts.maxY - coordinatesOfParts.minY;

        // 顔検出部分の面積調整(少し広めにしたりとか)
        // transform: scaleX(-1); している場合sxとswの関係性が逆転します
        let sx = isNose ? coordinatesOfParts.minX : coordinatesOfParts.minX - (partsW * marginOfLeftScale);
        let sy = coordinatesOfParts.minY - (partsH * marginOfTopScale);
        let sw = isNose ? partsW : partsW + (partsW * marginOfRightScale);
        let sh = partsH + (partsH * marginOfBottomScale);

        const w = Math.round(sw);
        const h = Math.round(sh);

        targetCanvasCtx.clearRect(0, 0, w, h);

        targetCanvas.width  = w;
        targetCanvas.height = h;

        if (isPrivate) {
            addPrivacy(canvas, p, useFrontCamera);
        }

        targetCanvasCtx.drawImage(
            canvas,
            Math.round(sx),
            Math.round(sy),
            Math.round(sw),
            Math.round(sh),
            0,
            0,
            w,
            h
        );

        const _distance = distance(partsName);
        const _angle = angle(partsName);

        const topPosition = coordinatesOfParts.minY - (partsH * marginOfTopScale);
        const y = _distance * Math.sin(_angle) + topPosition;
        targetCanvas.style.top = Math.round(y) + 'px';

        const adjust = isNose ? 0 : (partsW * marginOfLeftScale);
        const leftPosition = calcMeasureX(useFrontCamera, canvas, coordinatesOfParts.minX + w) + adjust;
        const x = _distance * Math.cos(_angle) + leftPosition;
        targetCanvas.style.left = Math.round(x) + 'px';
    }

    let _angles = {
        'leftEye': 0,
        'rightEye': 0,
        'nose': 0,
        'mouth': 0,
    };
    const angle = (name) => {
        const n = Math.ceil(Math.random() * 2);
        if (name === 'rightEye') {
            switch (n) {
                case 1:
                    return _angles[name] -= (Math.ceil(Math.random() * 5)/10) * Math.PI / 180;
                default:
                    return _angles[name] += (Math.ceil(Math.random() * 10)/10) * Math.PI / 180;
            }
        }
        if (name === 'nose') {
            switch (n) {
                case 1:
                    return _angles[name] -= (Math.ceil(Math.random() * 5)/10) * Math.PI / 270;
                default:
                    return _angles[name] += (Math.ceil(Math.random() * 10)/10) * Math.PI / 270;
            }
        }
        if (name === 'mouth') {
            switch (n) {
                case 1:
                    return _angles[name] += (Math.ceil(Math.random() * 5)/10) * Math.PI / 270;
                default:
                    return _angles[name] -= (Math.ceil(Math.random() * 10)/10) * Math.PI / 270;
            }
        }
        switch (n) {
            case 1:
                return _angles[name] += (Math.ceil(Math.random() * 5)/10) * Math.PI / 180;
            default:
                return _angles[name] -= (Math.ceil(Math.random() * 10)/10) * Math.PI / 180;
        }
    }

    let _distance = 0;
    let _add = true;
    const distance = (name) => {
        if (name !== 'leftEye') {
            return _distance <= 0 ? 0 : _distance;
        }

        if (_add === true) {
            _distance += Math.ceil(Math.random() * 3);
            if (_distance >= 200) {
                _add = false;
            }
            return _distance;
        }

        if (_add === false) {
            _distance -= Math.ceil(Math.random() * 15) / 10;
            if (_distance <= -100) {
                _add = true;
                return _distance = 0;
            }
            if (_distance <= 0) {
                return 0;
            }
            return _distance;
        }
    }

    // let _distances = {
    //     'leftEye': {'distance': 0, 'add': true},
    //     'rightEye': {'distance': 0, 'add': true},
    //     'nose': {'distance': 0, 'add': true},
    //     'mouth': {'distance': 0, 'add': true},
    // };
    // const distance = (name) => {
    //     if (isDebug) {
    //         _distances[name].distance -= 5;
    //         if (_distances[name].distance <= 0) {
    //             return _distances[name].distance = 0;
    //         }
    //         return _distances[name].distance;
    //     }

    //     if (_distances[name].add === true) {
    //         _distances[name].distance += Math.ceil(Math.random() * 5);
    //         if (_distances[name].distance >= 200) {
    //             _distances[name].add = false;
    //         }
    //         return _distances[name].distance;
    //     }

    //     if (_distances[name].add === false) {
    //         _distances[name].distance -= Math.ceil(Math.random() * 15) / 10;
    //         if (_distances[name].distance <= 0) {
    //             _distances[name].add = true;
    //         }
    //         return _distances[name].distance;
    //     }
    // }

    /**
     * 矩形座標を求める
     * @link http://blog.phalusamil.com/entry/2016/07/09/150751
     */
    const calcRangeOfCoordinates = (p, indexOfMinX, indexOfMinY, indexOfMaxX, indexOfMaxY, useFrontCamera) => {
        let min = {'x': 100000, 'y': 100000};
        let max = {'x': 0, 'y': 0};

        let _indexOfMinX = indexOfMinX;
        let _indexOfMaxX = indexOfMaxX;

        if (useFrontCamera) {
            // swap
            _indexOfMinX = indexOfMaxX;
            _indexOfMaxX = indexOfMinX;
        }

        for (let i = 0; i < _indexOfMinX.length; i++) {
            let k = _indexOfMinX[i];
            min.x = min.x > p[k][0] ? p[k][0] : min.x;
        }
        for (let i = 0; i < indexOfMinY.length; i++) {
            let k = indexOfMinY[i];
            min.y = min.y > p[k][1] ? p[k][1] : min.y;
        }
        for (let i = 0; i < _indexOfMaxX.length; i++) {
            let k = _indexOfMaxX[i];
            max.x = max.x < p[k][0] ? p[k][0] : max.x;
        }
        for (let i = 0; i < indexOfMaxY.length; i++) {
            let k = indexOfMaxY[i];
            max.y = max.y < p[k][1] ? p[k][1] : max.y;
        }

        return {
            'minX': Math.round(min.x),
            'minY': Math.round(min.y),
            'maxX': Math.round(max.x),
            'maxY': Math.round(max.y)
        };
    }

    const calcMeasureX = (useFrontCamera, canvas, width) => {
        if (useFrontCamera) {
            return canvas.width - width;
        }
        return width;
    }

    const addPrivacy = (canvas, p, useFrontCamera) => {
        // 目領域の矩形座標を求める
        const indexOfMinEyeX = [19, 20, 23];
        const indexOfMinEyeY = [24, 29, 63, 64, 67, 68];
        const indexOfMaxEyeX = [15, 16, 28];
        const indexOfMaxEyeY = [23, 25, 26, 28, 30, 31, 65, 66, 69, 70];
        const coordinatesOfEyes = calcRangeOfCoordinates(p, indexOfMinEyeX, indexOfMinEyeY, indexOfMaxEyeX, indexOfMaxEyeY, useFrontCamera);

        const eyeW = coordinatesOfEyes.maxX - coordinatesOfEyes.minX;
        const eyeH = coordinatesOfEyes.maxY - coordinatesOfEyes.minY;

        // eyeLine(canvas, coordinatesOfEyes.minX - 10, coordinatesOfEyes.minY - 5, eyeW + 20, eyeH + 10);
        mosaic(canvas, coordinatesOfEyes.minX - 10, coordinatesOfEyes.minY - 5, eyeW + 20, eyeH + 10);
    }

    const eyeLine = (canvas, sx, sy, cw, ch) => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(sx, sy, cw, ch);
        const data = imageData.data;

        for(let i = 0; i < data.length; i += 4) {
            data[i]     = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
        }

        ctx.putImageData(imageData, sx, sy);
    }

    const mosaic = (canvas, sx, sy, cw, ch) => {
        const size = 16;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(sx, sy, cw, ch);
        const data = imageData.data;

        for (let x = 0; x < cw; x += size) {
            for (let y = 0; y < ch; y += size) {
                let index = (x + y * cw) * 4;
                let r = data[index + 0];
                let g = data[index + 1];
                let b = data[index + 2];

                for (let x2 = 0; x2 < size; x2++) {
                    for (let y2 = 0; y2 < size; y2++) {
                        let i = (cw * (y + y2) * 4) + ((x + x2) * 4)
                        data[i + 0] = r;
                        data[i + 1] = g;
                        data[i + 2] = b;
                    }
                }
            }
        }

        ctx.putImageData(imageData, sx, sy);
    }

    /**
     |--------------------------------------------------------------------------
     | stats
     |--------------------------------------------------------------------------
     */
    function _stats() {
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
});
