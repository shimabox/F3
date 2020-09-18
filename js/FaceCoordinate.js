'use strict';

class FaceCoordinate {
    constructor() {
        /**
         * 顔座標のindex
         * scaleX(-1) している場合(前面カメラ利用時)、座標が鏡のように左右入れ替わるので
         * それを補填する
         */
        this._indexForMapping = [
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
    }

    swapPosition(positions, useFrontCamera) {
        if (positions === false) {
            return false;
        }

        if (useFrontCamera === false) {
            return positions;
        }

        let afterSwappingPosition = [];
        for (let i=0; i < this._indexForMapping.length; i++) {
            afterSwappingPosition[this._indexForMapping[i].to]
                = positions[this._indexForMapping[i].from];
        }

        return afterSwappingPosition;
    }
}