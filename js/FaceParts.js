class FaceParts {
    /**
     * 顔座標のindex
     * scaleX(-1) している場合(前面カメラ利用時)、座標が鏡のように左右入れ替わるので
     * それを補填する
     */
    static _faceCoordinateIndexForMapping = [
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

    static _coordinateIndexesOfLeftEyeLine = {
        'indexOfMinX': [19],
        'indexOfMinY': [24, 63, 64],
        'indexOfMaxX': [22],
        'indexOfMaxY': [26, 65, 66]
    };

    static _coordinateIndexesOfRightEyeLine = {
        'indexOfMinX': [30],
        'indexOfMinY': [29, 68, 67],
        'indexOfMaxX': [15],
        'indexOfMaxY': [31, 69, 70]
    };

    _canvas;
    _ctx;

    _scale = 0;
    _marginOfTopScale = 0;    // 該当パーツの何%分上にマージンを取るか(_marginOfBottomScaleとの調整が必要)
    _marginOfBottomScale = 0; // 該当パーツの何%分下にマージンを取るか(_marginOfTopScaleとの調整が必要)
    _marginOfLeftScale = 0;   // 該当パーツの何%分左にマージンを取るか(_marginOfRightScaleとの調整が必要)
    _marginOfRightScale = 0;  // 該当パーツの何%分右にマージンを取るか(_marginOfLeftScaleとの調整が必要)

    _indexOfMinX = [];
    _indexOfMinY = [];
    _indexOfMaxX = [];
    _indexOfMaxY = [];

    _distance = 0;
    _isLeave = true;
    _degree = 0;

    _isDebug = false;

    _referenceForDraggingFunction; // ドラッグ中関数参照用

    constructor(canvas) {
        this._canvas = canvas;
        this._ctx    = canvas.getContext('2d');
    }

    set isDebug(val) {
        this._isDebug = val;
    }

    get canvas() {
        return this._canvas;
    }

    static swapPosition(positions, useFrontCamera) {
        if (positions === false) {
            return false;
        }

        if (useFrontCamera === false) {
            return positions;
        }

        let afterSwappingPosition = [];
        for (let i=0; i < FaceParts._faceCoordinateIndexForMapping.length; i++) {
            afterSwappingPosition[FaceParts._faceCoordinateIndexForMapping[i].to]
                = positions[FaceParts._faceCoordinateIndexForMapping[i].from];
        }

        return afterSwappingPosition;
    }

    setStyleOfPosition(val) {
        this._canvas.style.position = val;
    }

    setStyleOfTransform(val) {
        this._canvas.style.transform = val;
    }

    calcRangeOfCoordinates(p, useFrontCamera) {
        return this._calcRangeOfCoordinates(
            p,
            this._indexOfMinX,
            this._indexOfMinY,
            this._indexOfMaxX,
            this._indexOfMaxY,
            useFrontCamera
        );
    }

    /**
     * 矩形座標を求める
     * @link http://blog.phalusamil.com/entry/2016/07/09/150751
     */
    _calcRangeOfCoordinates(p, indexOfMinX, indexOfMinY, indexOfMaxX, indexOfMaxY, useFrontCamera) {
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

    render(baseCanvas, coordinatesOfParts) {
        const partsW = coordinatesOfParts.maxX - coordinatesOfParts.minX;
        const partsH = coordinatesOfParts.maxY - coordinatesOfParts.minY;

        // 検出部分の面積調整(少し広めにしたりとか)
        let sx = coordinatesOfParts.minX - (partsW * this._marginOfLeftScale);
        let sy = coordinatesOfParts.minY - (partsH * this._marginOfTopScale);
        let sw = Math.round(partsW + (partsW * this._marginOfRightScale));
        let sh = Math.round(partsH + (partsH * this._marginOfBottomScale));

        this._canvas.width  = sw;
        this._canvas.height = sh;

        this._ctx.drawImage(
            baseCanvas,
            Math.round(sx),
            Math.round(sy),
            Math.round(sw),
            Math.round(sh),
            0,
            0,
            sw,
            sh
        );
    }

    move(baseCanvas, coordinatesOfParts, useFrontCamera) {
        const distance = this._calcDistance();
        const degree = this._calcDegree();

        const partsH = coordinatesOfParts.maxY - coordinatesOfParts.minY;
        const topPosition = coordinatesOfParts.minY - (partsH * this._marginOfTopScale);
        const y = distance * Math.sin(degree) + topPosition;
        this._canvas.style.top = Math.round(y) + 'px';

        const partsW = coordinatesOfParts.maxX - coordinatesOfParts.minX;
        const realWidthOfParts = partsW + (partsW * this._marginOfRightScale);
        const leftPosition = this._calcMeasureX(
            useFrontCamera,
            baseCanvas.width,
            coordinatesOfParts.minX,
            realWidthOfParts,
            partsW * this._marginOfLeftScale
        );
        const x = distance * Math.cos(degree) + leftPosition;
        this._canvas.style.left = Math.round(x) + 'px';
    }

    draggable() {
        this._canvas.onmousedown = function(e){
            this._dragStart(e);
        }.bind(this);
        this._canvas.ontouchstart = function(e){
            this._dragStart(e);
        }.bind(this);

        this._canvas.style.cursor = 'move';
    }

    dragDisabled() {
        this._canvas.onmousedown = null;
        this._canvas.ontouchstart = null;
    }

    _dragStart(e) {
        let _event;
        if(e.type === 'mousedown') {
            _event = e;
        } else {
            _event = e.changedTouches[0];
        }

        let x = _event.pageX - this._canvas.offsetLeft;
        let y = _event.pageY - this._canvas.offsetTop;

        document.body.onmousemove = function (e) {
            this._dragging(e, x, y);
        }.bind(this);

        // document.body.addEventListener('touchmove', this._dragging, { passive: false });
        // の形にすると、this._dragging内のthisがbodyになってしまいcanvas(対象のFaceParts)の取得が煩雑になるので
        // document.body.addEventListener('touchmove', function (e) {
        //     this._dragging(e, x, y);
        // }.bind(this), { passive: false });
        // このように無名関数で実行したかったが、無名関数だとremoveEventListenerが効かなくなるので
        // this._draggingへの参照を保持しておく関数を用意する
        this._referenceForDraggingFunction = function (e) {
            this._dragging(e, x, y);
        }.bind(this);
        document.body.addEventListener('touchmove', this._referenceForDraggingFunction, {passive: false});
    }

    _dragging(e, x, y) {
        let _event;
        if(e.type === 'mousemove') {
            _event = e;
        } else {
            _event = e.changedTouches[0];
        }

        if (e.cancelable) {
            e.preventDefault();
        }

        this._canvas.style.top = _event.pageY - y + 'px';
        this._canvas.style.left = _event.pageX - x + 'px';

        this._canvas.onmouseup = function(e){
            this._dragEnd();
        }.bind(this);
        this._canvas.ontouchend = function(e){
            this._dragEnd();
        }.bind(this);
        document.body.onmouseleave = function (e) {
            this._dragEnd();
        }.bind(this);
    }

    _dragEnd() {
        document.body.onmousemove = null;
        document.body.onmouseleave = null;
        document.body.ontouchmove = null;

        document.body.removeEventListener('touchmove', this._referenceForDraggingFunction, { passive: false });
        // this._referenceForDraggingFunctionが参照している_draggingもremoveしないとイベントが消えない
        document.body.removeEventListener('touchmove', this._dragging, { passive: false });
        this._referenceForDraggingFunction = null;

        this._canvas.onmouseup = null;
        this._canvas.ontouchend = null;

        this._canvas.style.cursor = 'default';
    }

    copy() {
        const canvas = document.createElement('canvas');
        const image = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height);
        canvas.getContext('2d').putImageData(image, 0, 0);
        return new this.constructor(canvas);
    }

    clear() {
        this._canvas.width  = 0;
        this._canvas.height = 0;
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    _calcDistance() {
        if (this._isDebug) {
            this._distance -= 5;
            if (this._distance <= 0) {
                return this._distance = 0;
            }
            return this._distance;
        }

        if (this._isLeave === true) {
            this._distance += Math.ceil(Math.random() * 5);
            if (this._distance >= 400) {
                this._isLeave = false;
            }
            return this._distance;
        }

        if (this._isLeave === false) {
            this._distance -= Math.ceil(Math.random() * 30) / 10;
            if (this._distance <= 0) {
                this._isLeave = true;
            }
            return this._distance;
        }
    }

    _calcDegree() {
        throw new Error('Not Implemented');
    }

    _calcMeasureX(useFrontCamera, baseCanvasWidth, xCoordinateOfTargetCanvas, realWidthOfParts, adjust) {
        if (useFrontCamera) {
            return baseCanvasWidth - (xCoordinateOfTargetCanvas + realWidthOfParts) + adjust;
        }
        return xCoordinateOfTargetCanvas - adjust;
    }

    renderEyeLine(positions, useFrontCamera, applyMosaic) {
        return;
    }

    _line(sx, sy, cw, ch) {
        const imageData = this._ctx.getImageData(sx, sy, cw, ch);
        const data = imageData.data;

        for(let i = 0; i < data.length; i += 4) {
            data[i]     = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
        }

        this._ctx.putImageData(imageData, sx, sy);
    }

    _mosaic(sx, sy, cw, ch) {
        const imageData = this._ctx.getImageData(sx, sy, cw, ch);
        const data = imageData.data;
        const size = 16;

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

        this._ctx.putImageData(imageData, sx, sy);
    }
}

class LeftEyeBlow extends FaceParts {
    constructor(canvas) {
        super(canvas);

        this._scale = 1 / 10;
        this._marginOfTopScale = 30 * this._scale;
        this._marginOfBottomScale = 44 * this._scale;
        this._marginOfLeftScale = 4 * this._scale;
        this._marginOfRightScale = 7 * this._scale;

        this._indexOfMinX = [19];
        this._indexOfMinY = [20, 21];
        this._indexOfMaxX = [22];
        this._indexOfMaxY = [19, 22];
    }

    _calcDegree() {
        const n = Math.ceil(Math.random() * 3);
        switch (n) {
            case 1:
                return this._degree += (Math.ceil(Math.random() * 5) / 10) * Math.PI / 180;
            default:
                return this._degree -= (Math.ceil(Math.random() * 10) / 10) * Math.PI / 180;
        }
    }
}

class LeftEye extends FaceParts {
    constructor(canvas) {
        super(canvas);

        this._scale = 1 / 15;
        this._marginOfTopScale = 18 * this._scale;
        this._marginOfBottomScale = 26 * this._scale;
        this._marginOfLeftScale = 8 * this._scale;
        this._marginOfRightScale = 16 * this._scale;

        this._indexOfMinX = [23];
        this._indexOfMinY = [24, 63, 64];
        this._indexOfMaxX = [25];
        this._indexOfMaxY = [26, 65, 66];
    }

    renderEyeLine(positions, useFrontCamera, applyMosaic) {
        const coordinatesOfParts = this._calcRangeOfCoordinates(
            positions,
            this._indexOfMinX,
            this._indexOfMinY,
            this._indexOfMaxX,
            this._indexOfMaxY,
            useFrontCamera
        );

        const partsH = coordinatesOfParts.maxY - coordinatesOfParts.minY;
        const topPosition = coordinatesOfParts.minY - (partsH * this._marginOfTopScale);

        const partsW = coordinatesOfParts.maxX - coordinatesOfParts.minX;
        const realWidthOfParts = partsW + (partsW * this._marginOfRightScale);

        const coordinatesOfEyeLine = this._calcRangeOfCoordinates(
            positions,
            FaceParts._coordinateIndexesOfLeftEyeLine.indexOfMinX,
            FaceParts._coordinateIndexesOfLeftEyeLine.indexOfMinY,
            FaceParts._coordinateIndexesOfLeftEyeLine.indexOfMaxX,
            FaceParts._coordinateIndexesOfLeftEyeLine.indexOfMaxY,
            useFrontCamera
        );

        const sx = (realWidthOfParts - (coordinatesOfEyeLine.maxX - coordinatesOfEyeLine.minX)) / 2;
        const sy = coordinatesOfEyeLine.minY - topPosition;
        const cw = coordinatesOfEyeLine.maxX - coordinatesOfEyeLine.minX;
        const ch = coordinatesOfEyeLine.maxY - coordinatesOfEyeLine.minY;

        if (applyMosaic) {
            this._mosaic(sx, sy, cw, ch);
        } else {
            this._line(sx, sy, cw, ch);
        }
    }

    _calcDegree() {
        const n = Math.ceil(Math.random() * 3);
        switch (n) {
            case 1:
                return this._degree -= (Math.ceil(Math.random() * 5) / 10) * Math.PI / 180;
            default:
                return this._degree += (Math.ceil(Math.random() * 10) / 10) * Math.PI / 180;
        }
    }
}

class RightEyeBlow extends FaceParts {
    constructor(canvas) {
        super(canvas);

        this._scale = 1 / 10;
        this._marginOfTopScale = 30 * this._scale;
        this._marginOfBottomScale = 44 * this._scale;
        this._marginOfLeftScale = 4 * this._scale;
        this._marginOfRightScale = 7 * this._scale;

        this._indexOfMinX = [18];
        this._indexOfMinY = [16, 17];
        this._indexOfMaxX = [15];
        this._indexOfMaxY = [15, 18];
    }

    _calcDegree() {
        const n = Math.ceil(Math.random() * 3);
        switch (n) {
            case 1:
                return this._degree -= (Math.ceil(Math.random() * 5) / 10) * Math.PI / 180;
            default:
                return this._degree += (Math.ceil(Math.random() * 10) / 10) * Math.PI / 180;
        }
    }
}

class RightEye extends FaceParts {
    constructor(canvas) {
        super(canvas);

        this._scale = 1 / 15;
        this._marginOfTopScale = 18 * this._scale;
        this._marginOfBottomScale = 26 * this._scale;
        this._marginOfLeftScale = 8 * this._scale;
        this._marginOfRightScale = 16 * this._scale;

        this._indexOfMinX = [30];
        this._indexOfMinY = [29, 67, 68];
        this._indexOfMaxX = [28];
        this._indexOfMaxY = [31, 69, 70];
    }

    renderEyeLine(positions, useFrontCamera, applyMosaic) {
        const coordinatesOfParts = this._calcRangeOfCoordinates(
            positions,
            this._indexOfMinX,
            this._indexOfMinY,
            this._indexOfMaxX,
            this._indexOfMaxY,
            useFrontCamera
        );

        const partsH = coordinatesOfParts.maxY - coordinatesOfParts.minY;
        const topPosition = coordinatesOfParts.minY - (partsH * this._marginOfTopScale);

        const partsW = coordinatesOfParts.maxX - coordinatesOfParts.minX;
        const realWidthOfParts = partsW + (partsW * this._marginOfRightScale);

        const coordinatesOfEyeLine = this._calcRangeOfCoordinates(
            positions,
            FaceParts._coordinateIndexesOfRightEyeLine.indexOfMinX,
            FaceParts._coordinateIndexesOfRightEyeLine.indexOfMinY,
            FaceParts._coordinateIndexesOfRightEyeLine.indexOfMaxX,
            FaceParts._coordinateIndexesOfRightEyeLine.indexOfMaxY,
            useFrontCamera
        );

        const sx = (realWidthOfParts - (coordinatesOfEyeLine.maxX - coordinatesOfEyeLine.minX)) / 2;
        const sy = coordinatesOfEyeLine.minY - topPosition;
        const cw = coordinatesOfEyeLine.maxX - coordinatesOfEyeLine.minX;
        const ch = coordinatesOfEyeLine.maxY - coordinatesOfEyeLine.minY;

        if (applyMosaic) {
            this._mosaic(sx, sy, cw, ch);
        } else {
            this._line(sx, sy, cw, ch);
        }
    }

    _calcDegree() {
        const n = Math.ceil(Math.random() * 3);
        switch (n) {
            case 1:
                return this._degree += (Math.ceil(Math.random() * 5) / 10) * Math.PI / 180;
            default:
                return this._degree -= (Math.ceil(Math.random() * 10) / 10) * Math.PI / 180;
        }
    }
}

class Nose extends FaceParts {
    constructor(canvas) {
        super(canvas);

        this._scale = 1 / 35;
        this._marginOfTopScale = 11 * this._scale;
        this._marginOfBottomScale = 18 * this._scale;
        this._marginOfLeftScale = 4 * this._scale;
        this._marginOfRightScale = 8 * this._scale;

        this._indexOfMinX = [34, 35, 36];
        this._indexOfMinY = [41];
        this._indexOfMaxX = [38, 39, 40];
        this._indexOfMaxY = [36, 37, 38];
    }

    _calcDegree() {
        const n = Math.ceil(Math.random() * 3);
        switch (n) {
            case 1:
                return this._degree -= (Math.ceil(Math.random() * 5) / 10) * Math.PI / 270;
            default:
                return this._degree += (Math.ceil(Math.random() * 10) / 10) * Math.PI / 270;
        }
    }
}

class Mouth extends FaceParts {
    constructor(canvas) {
        super(canvas);

        this._scale = 1 / 15;
        this._marginOfTopScale = 8 * this._scale;
        this._marginOfBottomScale = 17 * this._scale;
        this._marginOfLeftScale = 4 * this._scale;
        this._marginOfRightScale = 8 * this._scale;

        this._indexOfMinX = [44, 45, 55];
        this._indexOfMinY = [45, 46, 47, 48, 49];
        this._indexOfMaxX = [49, 50, 51];
        this._indexOfMaxY = [51, 52, 53, 54, 55];
    }

    _calcDegree() {
        const n = Math.ceil(Math.random() * 3);
        switch (n) {
            case 1:
                return this._degree += (Math.ceil(Math.random() * 5) / 10) * Math.PI / 270;
            default:
                return this._degree -= (Math.ceil(Math.random() * 10) / 10) * Math.PI / 270;
        }
    }
}