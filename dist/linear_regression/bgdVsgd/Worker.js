/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Regressor = function () {
    function Regressor(rn, m, batchNum, objectName) {
        _classCallCheck(this, Regressor);

        this.real_numbers = rn;
        this.measurements = m;
        this.batchNum = batchNum;
        this.object_name = objectName;
        this.costHistory = [];
        this.epocPost = 0;
        this.setup();
    }

    _createClass(Regressor, [{
        key: 'start',
        value: function start(y) {
            this.b = y;
            this.epoch(this.training_examples);
        }
    }, {
        key: 'line',
        value: function line(x) {
            return this.b + this.m * x;
        }
    }, {
        key: 'cost',
        value: function cost(points) {
            var error = 0,
                i = void 0,
                x = void 0,
                y = void 0;
            for (i = 0; i < points.length; i++) {
                x = points[i][0];
                y = points[i][1];
                error += Math.pow(y - this.line(x), 2);
            }
            return error / points.length;
        }
    }, {
        key: 'getLineData',
        value: function getLineData() {
            var _this = this;

            return this.real_numbers.map(function (n, i) {
                return _this.line(i);
            });
        }
    }, {
        key: 'drawCost',
        value: function drawCost() {
            postMessage({
                action: 'DRAW_COST',
                objectName: this.object_name,
                batchNum: this.batchNum,
                costHistory: this.costHistory,
                epocNum: this.ni
            });
        }
    }, {
        key: 'drawLine',
        value: function drawLine() {
            if (this.epocPost % 10 == 0) {
                var lineData = this.getLineData();

                postMessage({
                    action: 'DRAW_LINE',
                    lineData: lineData,
                    batchNum: this.batchNum,
                    epocNum: this.ni
                });
            }
            this.epocPost++;
        }
    }, {
        key: 'setup',
        value: function setup() {
            /**
             * Training examples is the [x, y] pairs that will be used for training
             */
            this.training_examples = this.measurements.map(function (n, i) {
                return [i, n];
            });
            /**
             * Number of iterations
             * @type {number}
             */
            this.ni = 0;
            /**
             * Current Cost
             * @type {number}
             */
            this.c = 0;
            /**
             * Alpha - Learning rate
             * @type {number}
             */
            this.a = Regressor.LEARNING_RATE;
            /**
             * Best B - after convergence we choose the best B value
             * @type {number}
             */
            this.bestB = 0;
            /**
             * Bese M - after convergence we choose the best M value
             * @type {number}
             */
            this.bestM = 0;
            /**
             * Best Cost - keep track of the best cost we have reached so far
             * @type {Number}
             */
            this.bestC = Infinity;
            /**
             * The slope
             * @type {number}
             */
            this.m = 0;
            /**
             * The timer
             * @type {null}
             */
            this.timer = null;
            /**
             * The HighCharts reference
             * @type {Highcharts.Chart}
             */
            this.hc = null;
            /**
             * Previous cost, used for measuring precision
             * @type {Number}
             */
            this.pc = Infinity;
        }
    }]);

    return Regressor;
}();

Regressor.NUM_POINTS = 50;
Regressor.TIME_INTERVAL = 10;
Regressor.RANDOM_ALPHA = .5;
Regressor.LEARNING_RATE = 0.001;
Regressor.MAX_ITERATION = 1000;
Regressor.PRECISION = 0.001;
exports.default = Regressor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9saW5lYXJfcmVncmVzc2lvbi9iZ2RWc2dkL1JlZ3Jlc3Nvci5lczYiXSwibmFtZXMiOlsiUmVncmVzc29yIiwicm4iLCJtIiwiYmF0Y2hOdW0iLCJvYmplY3ROYW1lIiwicmVhbF9udW1iZXJzIiwibWVhc3VyZW1lbnRzIiwib2JqZWN0X25hbWUiLCJjb3N0SGlzdG9yeSIsImVwb2NQb3N0Iiwic2V0dXAiLCJ5IiwiYiIsImVwb2NoIiwidHJhaW5pbmdfZXhhbXBsZXMiLCJ4IiwicG9pbnRzIiwiZXJyb3IiLCJpIiwibGVuZ3RoIiwiTWF0aCIsInBvdyIsImxpbmUiLCJtYXAiLCJuIiwicG9zdE1lc3NhZ2UiLCJhY3Rpb24iLCJlcG9jTnVtIiwibmkiLCJsaW5lRGF0YSIsImdldExpbmVEYXRhIiwiYyIsImEiLCJMRUFSTklOR19SQVRFIiwiYmVzdEIiLCJiZXN0TSIsImJlc3RDIiwiSW5maW5pdHkiLCJ0aW1lciIsImhjIiwicGMiLCJOVU1fUE9JTlRTIiwiVElNRV9JTlRFUlZBTCIsIlJBTkRPTV9BTFBIQSIsIk1BWF9JVEVSQVRJT04iLCJQUkVDSVNJT04iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsUztBQVVGLHVCQUFZQyxFQUFaLEVBQWdCQyxDQUFoQixFQUFtQkMsUUFBbkIsRUFBNkJDLFVBQTdCLEVBQXdDO0FBQUE7O0FBQ3BDLGFBQUtDLFlBQUwsR0FBb0JKLEVBQXBCO0FBQ0EsYUFBS0ssWUFBTCxHQUFvQkosQ0FBcEI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGFBQUtJLFdBQUwsR0FBbUJILFVBQW5CO0FBQ0EsYUFBS0ksV0FBTCxHQUFtQixFQUFuQjtBQUNBLGFBQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDQSxhQUFLQyxLQUFMO0FBQ0g7Ozs7OEJBRUtDLEMsRUFBRTtBQUNKLGlCQUFLQyxDQUFMLEdBQVNELENBQVQ7QUFDQSxpQkFBS0UsS0FBTCxDQUFXLEtBQUtDLGlCQUFoQjtBQUNIOzs7NkJBRUlDLEMsRUFBRTtBQUNILG1CQUFPLEtBQUtILENBQUwsR0FBUyxLQUFLVixDQUFMLEdBQVNhLENBQXpCO0FBQ0g7Ozs2QkFFSUMsTSxFQUFRO0FBQ1QsZ0JBQUlDLFFBQVEsQ0FBWjtBQUFBLGdCQUFlQyxVQUFmO0FBQUEsZ0JBQWtCSCxVQUFsQjtBQUFBLGdCQUFxQkosVUFBckI7QUFDQSxpQkFBS08sSUFBSSxDQUFULEVBQVlBLElBQUlGLE9BQU9HLE1BQXZCLEVBQStCRCxHQUEvQixFQUFvQztBQUNoQ0gsb0JBQUlDLE9BQU9FLENBQVAsRUFBVSxDQUFWLENBQUo7QUFDQVAsb0JBQUlLLE9BQU9FLENBQVAsRUFBVSxDQUFWLENBQUo7QUFDQUQseUJBQVNHLEtBQUtDLEdBQUwsQ0FBVVYsSUFBSSxLQUFLVyxJQUFMLENBQVVQLENBQVYsQ0FBZCxFQUE2QixDQUE3QixDQUFUO0FBQ0g7QUFDRCxtQkFBT0UsUUFBUUQsT0FBT0csTUFBdEI7QUFDSDs7O3NDQUVZO0FBQUE7O0FBQ1QsbUJBQU8sS0FBS2QsWUFBTCxDQUFrQmtCLEdBQWxCLENBQXNCLFVBQUNDLENBQUQsRUFBSU4sQ0FBSixFQUFVO0FBQ25DLHVCQUFPLE1BQUtJLElBQUwsQ0FBVUosQ0FBVixDQUFQO0FBQ0gsYUFGTSxDQUFQO0FBR0g7OzttQ0FFUztBQUNOTyx3QkFBWTtBQUNSQyx3QkFBUSxXQURBO0FBRVJ0Qiw0QkFBWSxLQUFLRyxXQUZUO0FBR1JKLDBCQUFVLEtBQUtBLFFBSFA7QUFJUkssNkJBQWEsS0FBS0EsV0FKVjtBQUtSbUIseUJBQVMsS0FBS0M7QUFMTixhQUFaO0FBT0g7OzttQ0FFUztBQUNOLGdCQUFHLEtBQUtuQixRQUFMLEdBQWdCLEVBQWhCLElBQXNCLENBQXpCLEVBQTRCO0FBQ3hCLG9CQUFNb0IsV0FBVyxLQUFLQyxXQUFMLEVBQWpCOztBQUVBTCw0QkFBWTtBQUNSQyw0QkFBUSxXQURBO0FBRVJHLDhCQUFVQSxRQUZGO0FBR1IxQiw4QkFBVSxLQUFLQSxRQUhQO0FBSVJ3Qiw2QkFBUyxLQUFLQztBQUpOLGlCQUFaO0FBTUg7QUFDRCxpQkFBS25CLFFBQUw7QUFDSDs7O2dDQUVNO0FBQ0g7OztBQUdBLGlCQUFLSyxpQkFBTCxHQUF5QixLQUFLUixZQUFMLENBQ3BCaUIsR0FEb0IsQ0FDaEIsVUFBQ0MsQ0FBRCxFQUFJTixDQUFKLEVBQVU7QUFDWCx1QkFBTyxDQUFDQSxDQUFELEVBQUlNLENBQUosQ0FBUDtBQUNILGFBSG9CLENBQXpCO0FBSUE7Ozs7QUFJQSxpQkFBS0ksRUFBTCxHQUFVLENBQVY7QUFDQTs7OztBQUlBLGlCQUFLRyxDQUFMLEdBQVMsQ0FBVDtBQUNBOzs7O0FBSUEsaUJBQUtDLENBQUwsR0FBU2hDLFVBQVVpQyxhQUFuQjtBQUNBOzs7O0FBSUEsaUJBQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0E7Ozs7QUFJQSxpQkFBS0MsS0FBTCxHQUFhLENBQWI7QUFDQTs7OztBQUlBLGlCQUFLQyxLQUFMLEdBQWFDLFFBQWI7QUFDQTs7OztBQUlBLGlCQUFLbkMsQ0FBTCxHQUFTLENBQVQ7QUFDQTs7OztBQUlBLGlCQUFLb0MsS0FBTCxHQUFhLElBQWI7QUFDQTs7OztBQUlBLGlCQUFLQyxFQUFMLEdBQVUsSUFBVjtBQUNBOzs7O0FBSUEsaUJBQUtDLEVBQUwsR0FBVUgsUUFBVjtBQUNIOzs7Ozs7QUEvSENyQyxTLENBR0t5QyxVLEdBQWEsRTtBQUhsQnpDLFMsQ0FJSzBDLGEsR0FBZ0IsRTtBQUpyQjFDLFMsQ0FLSzJDLFksR0FBZSxFO0FBTHBCM0MsUyxDQU1LaUMsYSxHQUFnQixLO0FBTnJCakMsUyxDQU9LNEMsYSxHQUFnQixJO0FBUHJCNUMsUyxDQVFLNkMsUyxHQUFZLEs7a0JBMEhSN0MsUyIsImZpbGUiOiJSZWdyZXNzb3IuZXM2Iiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yaWNod2FuZGVsbC9QaHBzdG9ybVByb2plY3RzL2pzYWxnb3MiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBSZWdyZXNzb3J7XG5cblxuICAgIHN0YXRpYyBOVU1fUE9JTlRTID0gNTA7XG4gICAgc3RhdGljIFRJTUVfSU5URVJWQUwgPSAxMDtcbiAgICBzdGF0aWMgUkFORE9NX0FMUEhBID0gLjU7XG4gICAgc3RhdGljIExFQVJOSU5HX1JBVEUgPSAwLjAwMTtcbiAgICBzdGF0aWMgTUFYX0lURVJBVElPTiA9IDEwMDA7XG4gICAgc3RhdGljIFBSRUNJU0lPTiA9IDAuMDAxO1xuXG4gICAgY29uc3RydWN0b3Iocm4sIG0sIGJhdGNoTnVtLCBvYmplY3ROYW1lKXtcbiAgICAgICAgdGhpcy5yZWFsX251bWJlcnMgPSBybjtcbiAgICAgICAgdGhpcy5tZWFzdXJlbWVudHMgPSBtO1xuICAgICAgICB0aGlzLmJhdGNoTnVtID0gYmF0Y2hOdW07XG4gICAgICAgIHRoaXMub2JqZWN0X25hbWUgPSBvYmplY3ROYW1lO1xuICAgICAgICB0aGlzLmNvc3RIaXN0b3J5ID0gW107XG4gICAgICAgIHRoaXMuZXBvY1Bvc3QgPSAwO1xuICAgICAgICB0aGlzLnNldHVwKCk7XG4gICAgfVxuXG4gICAgc3RhcnQoeSl7XG4gICAgICAgIHRoaXMuYiA9IHk7XG4gICAgICAgIHRoaXMuZXBvY2godGhpcy50cmFpbmluZ19leGFtcGxlcyk7XG4gICAgfVxuXG4gICAgbGluZSh4KXtcbiAgICAgICAgcmV0dXJuIHRoaXMuYiArIHRoaXMubSAqIHg7XG4gICAgfVxuXG4gICAgY29zdChwb2ludHMpIHtcbiAgICAgICAgbGV0IGVycm9yID0gMCwgaSwgeCwgeTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHBvaW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgeCA9IHBvaW50c1tpXVswXTtcbiAgICAgICAgICAgIHkgPSBwb2ludHNbaV1bMV07XG4gICAgICAgICAgICBlcnJvciArPSBNYXRoLnBvdygoeSAtIHRoaXMubGluZSh4KSksIDIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlcnJvciAvIHBvaW50cy5sZW5ndGg7XG4gICAgfVxuXG4gICAgZ2V0TGluZURhdGEoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhbF9udW1iZXJzLm1hcCgobiwgaSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZShpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZHJhd0Nvc3QoKXtcbiAgICAgICAgcG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgYWN0aW9uOiAnRFJBV19DT1NUJyxcbiAgICAgICAgICAgIG9iamVjdE5hbWU6IHRoaXMub2JqZWN0X25hbWUsXG4gICAgICAgICAgICBiYXRjaE51bTogdGhpcy5iYXRjaE51bSxcbiAgICAgICAgICAgIGNvc3RIaXN0b3J5OiB0aGlzLmNvc3RIaXN0b3J5LFxuICAgICAgICAgICAgZXBvY051bTogdGhpcy5uaVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBkcmF3TGluZSgpe1xuICAgICAgICBpZih0aGlzLmVwb2NQb3N0ICUgMTAgPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgbGluZURhdGEgPSB0aGlzLmdldExpbmVEYXRhKCk7XG5cbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICBhY3Rpb246ICdEUkFXX0xJTkUnLFxuICAgICAgICAgICAgICAgIGxpbmVEYXRhOiBsaW5lRGF0YSxcbiAgICAgICAgICAgICAgICBiYXRjaE51bTogdGhpcy5iYXRjaE51bSxcbiAgICAgICAgICAgICAgICBlcG9jTnVtOiB0aGlzLm5pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVwb2NQb3N0Kys7XG4gICAgfVxuXG4gICAgc2V0dXAoKXtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRyYWluaW5nIGV4YW1wbGVzIGlzIHRoZSBbeCwgeV0gcGFpcnMgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRyYWluaW5nXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRyYWluaW5nX2V4YW1wbGVzID0gdGhpcy5tZWFzdXJlbWVudHNcbiAgICAgICAgICAgIC5tYXAoKG4sIGkpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW2ksIG5dO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBOdW1iZXIgb2YgaXRlcmF0aW9uc1xuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5uaSA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDdXJyZW50IENvc3RcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYyA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBbHBoYSAtIExlYXJuaW5nIHJhdGVcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYSA9IFJlZ3Jlc3Nvci5MRUFSTklOR19SQVRFO1xuICAgICAgICAvKipcbiAgICAgICAgICogQmVzdCBCIC0gYWZ0ZXIgY29udmVyZ2VuY2Ugd2UgY2hvb3NlIHRoZSBiZXN0IEIgdmFsdWVcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYmVzdEIgPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogQmVzZSBNIC0gYWZ0ZXIgY29udmVyZ2VuY2Ugd2UgY2hvb3NlIHRoZSBiZXN0IE0gdmFsdWVcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYmVzdE0gPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogQmVzdCBDb3N0IC0ga2VlcCB0cmFjayBvZiB0aGUgYmVzdCBjb3N0IHdlIGhhdmUgcmVhY2hlZCBzbyBmYXJcbiAgICAgICAgICogQHR5cGUge051bWJlcn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuYmVzdEMgPSBJbmZpbml0eTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBzbG9wZVxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tID0gMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSB0aW1lclxuICAgICAgICAgKiBAdHlwZSB7bnVsbH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudGltZXIgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIEhpZ2hDaGFydHMgcmVmZXJlbmNlXG4gICAgICAgICAqIEB0eXBlIHtIaWdoY2hhcnRzLkNoYXJ0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5oYyA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBQcmV2aW91cyBjb3N0LCB1c2VkIGZvciBtZWFzdXJpbmcgcHJlY2lzaW9uXG4gICAgICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnBjID0gSW5maW5pdHk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdyZXNzb3I7Il19

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Batch = __webpack_require__(2);

var _Batch2 = _interopRequireDefault(_Batch);

var _Stochastic = __webpack_require__(3);

var _Stochastic2 = _interopRequireDefault(_Stochastic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Worker = function () {
    function Worker() {
        _classCallCheck(this, Worker);
    }

    _createClass(Worker, [{
        key: 'handleMessage',
        value: function handleMessage(e) {
            console.log('Message received from main script');
            console.log(e.data);
            switch (e.data.action) {
                case 'SET_WORKER_VARS':
                    switch (e.data.workerType) {
                        case "BATCH":
                            this.worker = new _Batch2.default(e.data.measurements, e.data.realNumbers, e.data.batchNum);
                            break;

                        case "STOCHASTIC":
                            this.worker = new _Stochastic2.default(e.data.measurements, e.data.realNumbers, e.data.batchNum);
                            break;
                    }
                    this.worker.start(e.data.startY);
                    break;
            }
        }
    }]);

    return Worker;
}();

var w = new Worker();

onmessage = function onmessage(e) {
    w.handleMessage(e);
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9saW5lYXJfcmVncmVzc2lvbi9iZ2RWc2dkL1dvcmtlci5lczYiXSwibmFtZXMiOlsiV29ya2VyIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJkYXRhIiwiYWN0aW9uIiwid29ya2VyVHlwZSIsIndvcmtlciIsIm1lYXN1cmVtZW50cyIsInJlYWxOdW1iZXJzIiwiYmF0Y2hOdW0iLCJzdGFydCIsInN0YXJ0WSIsInciLCJvbm1lc3NhZ2UiLCJoYW5kbGVNZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7SUFHTUEsTTs7Ozs7OztzQ0FFWUMsQyxFQUFFO0FBQ1pDLG9CQUFRQyxHQUFSLENBQVksbUNBQVo7QUFDQUQsb0JBQVFDLEdBQVIsQ0FBWUYsRUFBRUcsSUFBZDtBQUNBLG9CQUFPSCxFQUFFRyxJQUFGLENBQU9DLE1BQWQ7QUFDSSxxQkFBSyxpQkFBTDtBQUNJLDRCQUFPSixFQUFFRyxJQUFGLENBQU9FLFVBQWQ7QUFDSSw2QkFBSyxPQUFMO0FBQ0ksaUNBQUtDLE1BQUwsR0FBYyxvQkFBVU4sRUFBRUcsSUFBRixDQUFPSSxZQUFqQixFQUErQlAsRUFBRUcsSUFBRixDQUFPSyxXQUF0QyxFQUFtRFIsRUFBRUcsSUFBRixDQUFPTSxRQUExRCxDQUFkO0FBQ0E7O0FBRUosNkJBQUssWUFBTDtBQUNJLGlDQUFLSCxNQUFMLEdBQWMseUJBQWVOLEVBQUVHLElBQUYsQ0FBT0ksWUFBdEIsRUFBb0NQLEVBQUVHLElBQUYsQ0FBT0ssV0FBM0MsRUFBd0RSLEVBQUVHLElBQUYsQ0FBT00sUUFBL0QsQ0FBZDtBQUNBO0FBUFI7QUFTQSx5QkFBS0gsTUFBTCxDQUFZSSxLQUFaLENBQWtCVixFQUFFRyxJQUFGLENBQU9RLE1BQXpCO0FBQ0E7QUFaUjtBQWNIOzs7Ozs7QUFHTCxJQUFNQyxJQUFJLElBQUliLE1BQUosRUFBVjs7QUFFQWMsWUFBWSxtQkFBQ2IsQ0FBRCxFQUFPO0FBQ2ZZLE1BQUVFLGFBQUYsQ0FBZ0JkLENBQWhCO0FBQ0gsQ0FGRCIsImZpbGUiOiJXb3JrZXIuZXM2Iiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yaWNod2FuZGVsbC9QaHBzdG9ybVByb2plY3RzL2pzYWxnb3MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmF0Y2ggZnJvbSAnLi9CYXRjaCc7XG5pbXBvcnQgU3RvY2hhc3RpYyBmcm9tICcuL1N0b2NoYXN0aWMnO1xuXG5cbmNsYXNzIFdvcmtlcntcblxuICAgIGhhbmRsZU1lc3NhZ2UoZSl7XG4gICAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIHJlY2VpdmVkIGZyb20gbWFpbiBzY3JpcHQnKTtcbiAgICAgICAgY29uc29sZS5sb2coZS5kYXRhKTtcbiAgICAgICAgc3dpdGNoKGUuZGF0YS5hY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ1NFVF9XT1JLRVJfVkFSUyc6XG4gICAgICAgICAgICAgICAgc3dpdGNoKGUuZGF0YS53b3JrZXJUeXBlKXtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIkJBVENIXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLndvcmtlciA9IG5ldyBCYXRjaChlLmRhdGEubWVhc3VyZW1lbnRzLCBlLmRhdGEucmVhbE51bWJlcnMsIGUuZGF0YS5iYXRjaE51bSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiU1RPQ0hBU1RJQ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JrZXIgPSBuZXcgU3RvY2hhc3RpYyhlLmRhdGEubWVhc3VyZW1lbnRzLCBlLmRhdGEucmVhbE51bWJlcnMsIGUuZGF0YS5iYXRjaE51bSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy53b3JrZXIuc3RhcnQoZS5kYXRhLnN0YXJ0WSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNvbnN0IHcgPSBuZXcgV29ya2VyKCk7XG5cbm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgdy5oYW5kbGVNZXNzYWdlKGUpO1xufTtcbiJdfQ==

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Regressor2 = __webpack_require__(0);

var _Regressor3 = _interopRequireDefault(_Regressor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Batch = function (_Regressor) {
    _inherits(Batch, _Regressor);

    function Batch(rn, m, batchNum) {
        _classCallCheck(this, Batch);

        var _this = _possibleConstructorReturn(this, (Batch.__proto__ || Object.getPrototypeOf(Batch)).call(this, rn, m, batchNum, "Batch"));

        _this.a = 0.001;
        return _this;
    }

    _createClass(Batch, [{
        key: "epoch",
        value: function epoch(data) {
            var _this2 = this;

            //keep track of how many times we go through the dataset
            this.ni++;
            var N = data.length;
            var bGrad = 0;
            var mGrad = 0;
            for (var i = 0; i < N; i++) {
                var x = data[i][0];
                var y = data[i][1];
                var diff = y - this.line(x);

                //calculate the gradients
                bGrad += diff;
                mGrad += diff * x;
            }
            this.b = this.b + this.a * bGrad;
            this.m = this.m - -(2 / N) * (this.a * mGrad);
            this.pc = this.c;
            //compute the mean squared error
            this.c = this.cost(this.training_examples);
            this.costHistory.push(this.c);
            //keep track of the best possible answer
            if (this.c < this.bestC) {
                this.bestB = this.b;
                this.bestM = this.m;
                this.bestC = this.c;
            }
            //compute the change in cost
            var ccost = Math.abs(this.pc - this.c);
            this.drawLine();

            if (ccost < _Regressor3.default.PRECISION || this.ni >= _Regressor3.default.MAX_ITERATION) {
                clearTimeout(this.timer);
                this.b = this.bestB;
                this.m = this.bestM;
                this.drawCost();
            } else {
                this.timer = setTimeout(function () {
                    _this2.epoch(_this2.training_examples);
                }, _Regressor3.default.TIME_INTERVAL);
            }
        }
    }]);

    return Batch;
}(_Regressor3.default);

exports.default = Batch;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9saW5lYXJfcmVncmVzc2lvbi9iZ2RWc2dkL0JhdGNoLmVzNiJdLCJuYW1lcyI6WyJCYXRjaCIsInJuIiwibSIsImJhdGNoTnVtIiwiYSIsImRhdGEiLCJuaSIsIk4iLCJsZW5ndGgiLCJiR3JhZCIsIm1HcmFkIiwiaSIsIngiLCJ5IiwiZGlmZiIsImxpbmUiLCJiIiwicGMiLCJjIiwiY29zdCIsInRyYWluaW5nX2V4YW1wbGVzIiwiY29zdEhpc3RvcnkiLCJwdXNoIiwiYmVzdEMiLCJiZXN0QiIsImJlc3RNIiwiY2Nvc3QiLCJNYXRoIiwiYWJzIiwiZHJhd0xpbmUiLCJQUkVDSVNJT04iLCJNQVhfSVRFUkFUSU9OIiwiY2xlYXJUaW1lb3V0IiwidGltZXIiLCJkcmF3Q29zdCIsInNldFRpbWVvdXQiLCJlcG9jaCIsIlRJTUVfSU5URVJWQUwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUVNQSxLOzs7QUFFRixtQkFBWUMsRUFBWixFQUFnQkMsQ0FBaEIsRUFBbUJDLFFBQW5CLEVBQTRCO0FBQUE7O0FBQUEsa0hBQ2xCRixFQURrQixFQUNkQyxDQURjLEVBQ1hDLFFBRFcsRUFDRCxPQURDOztBQUV4QixjQUFLQyxDQUFMLEdBQVMsS0FBVDtBQUZ3QjtBQUczQjs7Ozs4QkFFS0MsSSxFQUFLO0FBQUE7O0FBQ1A7QUFDQSxpQkFBS0MsRUFBTDtBQUNBLGdCQUFNQyxJQUFJRixLQUFLRyxNQUFmO0FBQ0EsZ0JBQUlDLFFBQVEsQ0FBWjtBQUNBLGdCQUFJQyxRQUFRLENBQVo7QUFDQSxpQkFBSSxJQUFJQyxJQUFJLENBQVosRUFBZUEsSUFBSUosQ0FBbkIsRUFBc0JJLEdBQXRCLEVBQTJCO0FBQ3ZCLG9CQUFNQyxJQUFJUCxLQUFLTSxDQUFMLEVBQVEsQ0FBUixDQUFWO0FBQ0Esb0JBQU1FLElBQUlSLEtBQUtNLENBQUwsRUFBUSxDQUFSLENBQVY7QUFDQSxvQkFBTUcsT0FBUUQsSUFBSSxLQUFLRSxJQUFMLENBQVVILENBQVYsQ0FBbEI7O0FBRUE7QUFDQUgseUJBQVNLLElBQVQ7QUFDQUoseUJBQVNJLE9BQU9GLENBQWhCO0FBQ0g7QUFDRCxpQkFBS0ksQ0FBTCxHQUFTLEtBQUtBLENBQUwsR0FBVSxLQUFLWixDQUFMLEdBQVNLLEtBQTVCO0FBQ0EsaUJBQUtQLENBQUwsR0FBUyxLQUFLQSxDQUFMLEdBQVUsRUFBRSxJQUFFSyxDQUFKLEtBQVUsS0FBS0gsQ0FBTCxHQUFTTSxLQUFuQixDQUFuQjtBQUNBLGlCQUFLTyxFQUFMLEdBQVUsS0FBS0MsQ0FBZjtBQUNBO0FBQ0EsaUJBQUtBLENBQUwsR0FBUyxLQUFLQyxJQUFMLENBQVUsS0FBS0MsaUJBQWYsQ0FBVDtBQUNBLGlCQUFLQyxXQUFMLENBQWlCQyxJQUFqQixDQUFzQixLQUFLSixDQUEzQjtBQUNBO0FBQ0EsZ0JBQUcsS0FBS0EsQ0FBTCxHQUFTLEtBQUtLLEtBQWpCLEVBQXVCO0FBQ25CLHFCQUFLQyxLQUFMLEdBQWEsS0FBS1IsQ0FBbEI7QUFDQSxxQkFBS1MsS0FBTCxHQUFhLEtBQUt2QixDQUFsQjtBQUNBLHFCQUFLcUIsS0FBTCxHQUFhLEtBQUtMLENBQWxCO0FBQ0g7QUFDRDtBQUNBLGdCQUFJUSxRQUFRQyxLQUFLQyxHQUFMLENBQVMsS0FBS1gsRUFBTCxHQUFVLEtBQUtDLENBQXhCLENBQVo7QUFDQSxpQkFBS1csUUFBTDs7QUFFQSxnQkFBR0gsUUFBUSxvQkFBVUksU0FBbEIsSUFBK0IsS0FBS3hCLEVBQUwsSUFBVyxvQkFBVXlCLGFBQXZELEVBQXFFO0FBQ2pFQyw2QkFBYSxLQUFLQyxLQUFsQjtBQUNBLHFCQUFLakIsQ0FBTCxHQUFTLEtBQUtRLEtBQWQ7QUFDQSxxQkFBS3RCLENBQUwsR0FBUyxLQUFLdUIsS0FBZDtBQUNBLHFCQUFLUyxRQUFMO0FBQ0gsYUFMRCxNQUtPO0FBQ0gscUJBQUtELEtBQUwsR0FBYUUsV0FBVyxZQUFNO0FBQzFCLDJCQUFLQyxLQUFMLENBQVcsT0FBS2hCLGlCQUFoQjtBQUNILGlCQUZZLEVBRVYsb0JBQVVpQixhQUZBLENBQWI7QUFHSDtBQUNKOzs7Ozs7a0JBS1VyQyxLIiwiZmlsZSI6IkJhdGNoLmVzNiIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcmljaHdhbmRlbGwvUGhwc3Rvcm1Qcm9qZWN0cy9qc2FsZ29zIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlZ3Jlc3NvciBmcm9tICcuL1JlZ3Jlc3Nvcic7XG5cbmNsYXNzIEJhdGNoIGV4dGVuZHMgUmVncmVzc29yIHtcblxuICAgIGNvbnN0cnVjdG9yKHJuLCBtLCBiYXRjaE51bSl7XG4gICAgICAgIHN1cGVyKHJuLCBtLCBiYXRjaE51bSwgXCJCYXRjaFwiKTtcbiAgICAgICAgdGhpcy5hID0gMC4wMDE7XG4gICAgfVxuXG4gICAgZXBvY2goZGF0YSl7XG4gICAgICAgIC8va2VlcCB0cmFjayBvZiBob3cgbWFueSB0aW1lcyB3ZSBnbyB0aHJvdWdoIHRoZSBkYXRhc2V0XG4gICAgICAgIHRoaXMubmkrKztcbiAgICAgICAgY29uc3QgTiA9IGRhdGEubGVuZ3RoO1xuICAgICAgICBsZXQgYkdyYWQgPSAwO1xuICAgICAgICBsZXQgbUdyYWQgPSAwO1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgTjsgaSArKyl7XG4gICAgICAgICAgICBjb25zdCB4ID0gZGF0YVtpXVswXTtcbiAgICAgICAgICAgIGNvbnN0IHkgPSBkYXRhW2ldWzFdO1xuICAgICAgICAgICAgY29uc3QgZGlmZiA9ICh5IC0gdGhpcy5saW5lKHgpKTtcblxuICAgICAgICAgICAgLy9jYWxjdWxhdGUgdGhlIGdyYWRpZW50c1xuICAgICAgICAgICAgYkdyYWQgKz0gZGlmZjtcbiAgICAgICAgICAgIG1HcmFkICs9IGRpZmYgKiB4O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYiA9IHRoaXMuYiArICh0aGlzLmEgKiBiR3JhZCk7XG4gICAgICAgIHRoaXMubSA9IHRoaXMubSAtICgtKDIvTikgKiAodGhpcy5hICogbUdyYWQpKTtcbiAgICAgICAgdGhpcy5wYyA9IHRoaXMuYztcbiAgICAgICAgLy9jb21wdXRlIHRoZSBtZWFuIHNxdWFyZWQgZXJyb3JcbiAgICAgICAgdGhpcy5jID0gdGhpcy5jb3N0KHRoaXMudHJhaW5pbmdfZXhhbXBsZXMpO1xuICAgICAgICB0aGlzLmNvc3RIaXN0b3J5LnB1c2godGhpcy5jKTtcbiAgICAgICAgLy9rZWVwIHRyYWNrIG9mIHRoZSBiZXN0IHBvc3NpYmxlIGFuc3dlclxuICAgICAgICBpZih0aGlzLmMgPCB0aGlzLmJlc3RDKXtcbiAgICAgICAgICAgIHRoaXMuYmVzdEIgPSB0aGlzLmI7XG4gICAgICAgICAgICB0aGlzLmJlc3RNID0gdGhpcy5tO1xuICAgICAgICAgICAgdGhpcy5iZXN0QyA9IHRoaXMuYztcbiAgICAgICAgfVxuICAgICAgICAvL2NvbXB1dGUgdGhlIGNoYW5nZSBpbiBjb3N0XG4gICAgICAgIGxldCBjY29zdCA9IE1hdGguYWJzKHRoaXMucGMgLSB0aGlzLmMpO1xuICAgICAgICB0aGlzLmRyYXdMaW5lKCk7XG5cbiAgICAgICAgaWYoY2Nvc3QgPCBSZWdyZXNzb3IuUFJFQ0lTSU9OIHx8IHRoaXMubmkgPj0gUmVncmVzc29yLk1BWF9JVEVSQVRJT04pe1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgICAgICAgICAgdGhpcy5iID0gdGhpcy5iZXN0QjtcbiAgICAgICAgICAgIHRoaXMubSA9IHRoaXMuYmVzdE07XG4gICAgICAgICAgICB0aGlzLmRyYXdDb3N0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcG9jaCh0aGlzLnRyYWluaW5nX2V4YW1wbGVzKTtcbiAgICAgICAgICAgIH0sIFJlZ3Jlc3Nvci5USU1FX0lOVEVSVkFMKTtcbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5cbmV4cG9ydCBkZWZhdWx0IEJhdGNoO1xuXG4iXX0=

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Regressor2 = __webpack_require__(0);

var _Regressor3 = _interopRequireDefault(_Regressor2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stochastic = function (_Regressor) {
    _inherits(Stochastic, _Regressor);

    function Stochastic(rn, m, batchNum) {
        _classCallCheck(this, Stochastic);

        var _this = _possibleConstructorReturn(this, (Stochastic.__proto__ || Object.getPrototypeOf(Stochastic)).call(this, rn, m, batchNum, "Stochastic"));

        _this.a = 0.02;
        return _this;
    }

    _createClass(Stochastic, [{
        key: "shuffle",
        value: function shuffle(data) {
            var ret = [];
            var tmpData = data.slice(0);
            while (tmpData.length > 0) {
                var index = Math.round(Math.random() * tmpData.length);
                var item = tmpData.splice(index, 1)[0];
                if (typeof item != "undefined") {
                    ret.push(item);
                }
            }
            return ret;
        }
    }, {
        key: "epoch",
        value: function epoch(d) {
            var _this2 = this;

            //keep track of how many times we go through the dataset
            this.ni++;
            //Shuffle our data first
            var data = this.shuffle(d);
            var N = data.length;

            for (var i = 0; i < N; i++) {
                var x = data[i][0];
                var y = data[i][1];
                var diff = y - this.line(x);
                //calculate the gradients for a single sample
                var bGrad = diff;
                var mGrad = diff * x;
                //update Y intercept
                this.b = this.b + this.a * bGrad;
                //update slope
                this.m = this.m - -(2 / N) * (this.a * mGrad);
            }
            this.pc = this.c;
            //compute the mean squared error
            this.c = this.cost(this.training_examples);
            this.costHistory.push(this.c);
            //keep track of the best possible answer
            if (this.c < this.bestC) {
                this.bestB = this.b;
                this.bestM = this.m;
                this.bestC = this.c;
            }
            //compute the change in cost
            var ccost = Math.abs(this.pc - this.c);
            this.drawLine();

            if (ccost < _Regressor3.default.PRECISION || this.ni >= _Regressor3.default.MAX_ITERATION) {
                clearTimeout(this.timer);
                this.b = this.bestB;
                this.m = this.bestM;
                this.drawCost();
            } else {
                this.timer = setTimeout(function () {
                    _this2.epoch(_this2.training_examples);
                }, _Regressor3.default.TIME_INTERVAL);
            }
        }
    }]);

    return Stochastic;
}(_Regressor3.default);

exports.default = Stochastic;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9saW5lYXJfcmVncmVzc2lvbi9iZ2RWc2dkL1N0b2NoYXN0aWMuZXM2Il0sIm5hbWVzIjpbIlN0b2NoYXN0aWMiLCJybiIsIm0iLCJiYXRjaE51bSIsImEiLCJkYXRhIiwicmV0IiwidG1wRGF0YSIsInNsaWNlIiwibGVuZ3RoIiwiaW5kZXgiLCJNYXRoIiwicm91bmQiLCJyYW5kb20iLCJpdGVtIiwic3BsaWNlIiwicHVzaCIsImQiLCJuaSIsInNodWZmbGUiLCJOIiwiaSIsIngiLCJ5IiwiZGlmZiIsImxpbmUiLCJiR3JhZCIsIm1HcmFkIiwiYiIsInBjIiwiYyIsImNvc3QiLCJ0cmFpbmluZ19leGFtcGxlcyIsImNvc3RIaXN0b3J5IiwiYmVzdEMiLCJiZXN0QiIsImJlc3RNIiwiY2Nvc3QiLCJhYnMiLCJkcmF3TGluZSIsIlBSRUNJU0lPTiIsIk1BWF9JVEVSQVRJT04iLCJjbGVhclRpbWVvdXQiLCJ0aW1lciIsImRyYXdDb3N0Iiwic2V0VGltZW91dCIsImVwb2NoIiwiVElNRV9JTlRFUlZBTCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0lBRU1BLFU7OztBQUVGLHdCQUFZQyxFQUFaLEVBQWdCQyxDQUFoQixFQUFtQkMsUUFBbkIsRUFBNEI7QUFBQTs7QUFBQSw0SEFDbEJGLEVBRGtCLEVBQ2RDLENBRGMsRUFDWEMsUUFEVyxFQUNELFlBREM7O0FBRXhCLGNBQUtDLENBQUwsR0FBUyxJQUFUO0FBRndCO0FBRzNCOzs7O2dDQUVPQyxJLEVBQUs7QUFDVCxnQkFBSUMsTUFBTSxFQUFWO0FBQ0EsZ0JBQUlDLFVBQVVGLEtBQUtHLEtBQUwsQ0FBVyxDQUFYLENBQWQ7QUFDQSxtQkFBTUQsUUFBUUUsTUFBUixHQUFpQixDQUF2QixFQUF5QjtBQUNyQixvQkFBSUMsUUFBUUMsS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxNQUFMLEtBQWdCTixRQUFRRSxNQUFuQyxDQUFaO0FBQ0Esb0JBQUlLLE9BQU9QLFFBQVFRLE1BQVIsQ0FBZUwsS0FBZixFQUFzQixDQUF0QixFQUF5QixDQUF6QixDQUFYO0FBQ0Esb0JBQUcsT0FBT0ksSUFBUCxJQUFnQixXQUFuQixFQUFnQztBQUM1QlIsd0JBQUlVLElBQUosQ0FBU0YsSUFBVDtBQUNIO0FBQ0o7QUFDRCxtQkFBT1IsR0FBUDtBQUNIOzs7OEJBRUtXLEMsRUFBRTtBQUFBOztBQUNKO0FBQ0EsaUJBQUtDLEVBQUw7QUFDQTtBQUNBLGdCQUFJYixPQUFPLEtBQUtjLE9BQUwsQ0FBYUYsQ0FBYixDQUFYO0FBQ0EsZ0JBQU1HLElBQUlmLEtBQUtJLE1BQWY7O0FBRUEsaUJBQUksSUFBSVksSUFBSSxDQUFaLEVBQWVBLElBQUlELENBQW5CLEVBQXNCQyxHQUF0QixFQUEyQjtBQUN2QixvQkFBTUMsSUFBSWpCLEtBQUtnQixDQUFMLEVBQVEsQ0FBUixDQUFWO0FBQ0Esb0JBQU1FLElBQUlsQixLQUFLZ0IsQ0FBTCxFQUFRLENBQVIsQ0FBVjtBQUNBLG9CQUFNRyxPQUFRRCxJQUFJLEtBQUtFLElBQUwsQ0FBVUgsQ0FBVixDQUFsQjtBQUNBO0FBQ0Esb0JBQUlJLFFBQVFGLElBQVo7QUFDQSxvQkFBSUcsUUFBUUgsT0FBT0YsQ0FBbkI7QUFDQTtBQUNBLHFCQUFLTSxDQUFMLEdBQVMsS0FBS0EsQ0FBTCxHQUFVLEtBQUt4QixDQUFMLEdBQVNzQixLQUE1QjtBQUNBO0FBQ0EscUJBQUt4QixDQUFMLEdBQVMsS0FBS0EsQ0FBTCxHQUFVLEVBQUUsSUFBRWtCLENBQUosS0FBVSxLQUFLaEIsQ0FBTCxHQUFTdUIsS0FBbkIsQ0FBbkI7QUFDSDtBQUNELGlCQUFLRSxFQUFMLEdBQVUsS0FBS0MsQ0FBZjtBQUNBO0FBQ0EsaUJBQUtBLENBQUwsR0FBUyxLQUFLQyxJQUFMLENBQVUsS0FBS0MsaUJBQWYsQ0FBVDtBQUNBLGlCQUFLQyxXQUFMLENBQWlCakIsSUFBakIsQ0FBc0IsS0FBS2MsQ0FBM0I7QUFDQTtBQUNBLGdCQUFHLEtBQUtBLENBQUwsR0FBUyxLQUFLSSxLQUFqQixFQUF1QjtBQUNuQixxQkFBS0MsS0FBTCxHQUFhLEtBQUtQLENBQWxCO0FBQ0EscUJBQUtRLEtBQUwsR0FBYSxLQUFLbEMsQ0FBbEI7QUFDQSxxQkFBS2dDLEtBQUwsR0FBYSxLQUFLSixDQUFsQjtBQUNIO0FBQ0Q7QUFDQSxnQkFBSU8sUUFBUTFCLEtBQUsyQixHQUFMLENBQVMsS0FBS1QsRUFBTCxHQUFVLEtBQUtDLENBQXhCLENBQVo7QUFDQSxpQkFBS1MsUUFBTDs7QUFFQSxnQkFBR0YsUUFBUSxvQkFBVUcsU0FBbEIsSUFBK0IsS0FBS3RCLEVBQUwsSUFBVyxvQkFBVXVCLGFBQXZELEVBQXFFO0FBQ2pFQyw2QkFBYSxLQUFLQyxLQUFsQjtBQUNBLHFCQUFLZixDQUFMLEdBQVMsS0FBS08sS0FBZDtBQUNBLHFCQUFLakMsQ0FBTCxHQUFTLEtBQUtrQyxLQUFkO0FBQ0EscUJBQUtRLFFBQUw7QUFDSCxhQUxELE1BS087QUFDSCxxQkFBS0QsS0FBTCxHQUFhRSxXQUFXLFlBQU07QUFDMUIsMkJBQUtDLEtBQUwsQ0FBVyxPQUFLZCxpQkFBaEI7QUFDSCxpQkFGWSxFQUVWLG9CQUFVZSxhQUZBLENBQWI7QUFHSDtBQUNKOzs7Ozs7a0JBSVUvQyxVIiwiZmlsZSI6IlN0b2NoYXN0aWMuZXM2Iiwic291cmNlUm9vdCI6Ii9Vc2Vycy9yaWNod2FuZGVsbC9QaHBzdG9ybVByb2plY3RzL2pzYWxnb3MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVncmVzc29yIGZyb20gJy4vUmVncmVzc29yJztcblxuY2xhc3MgU3RvY2hhc3RpYyBleHRlbmRzIFJlZ3Jlc3NvciB7XG5cbiAgICBjb25zdHJ1Y3RvcihybiwgbSwgYmF0Y2hOdW0pe1xuICAgICAgICBzdXBlcihybiwgbSwgYmF0Y2hOdW0sIFwiU3RvY2hhc3RpY1wiKTtcbiAgICAgICAgdGhpcy5hID0gMC4wMjtcbiAgICB9XG5cbiAgICBzaHVmZmxlKGRhdGEpe1xuICAgICAgICBsZXQgcmV0ID0gW107XG4gICAgICAgIGxldCB0bXBEYXRhID0gZGF0YS5zbGljZSgwKTtcbiAgICAgICAgd2hpbGUodG1wRGF0YS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIHRtcERhdGEubGVuZ3RoKTtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdG1wRGF0YS5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgICAgICAgICAgaWYodHlwZW9mKGl0ZW0pICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXQucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIGVwb2NoKGQpe1xuICAgICAgICAvL2tlZXAgdHJhY2sgb2YgaG93IG1hbnkgdGltZXMgd2UgZ28gdGhyb3VnaCB0aGUgZGF0YXNldFxuICAgICAgICB0aGlzLm5pKys7XG4gICAgICAgIC8vU2h1ZmZsZSBvdXIgZGF0YSBmaXJzdFxuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuc2h1ZmZsZShkKTtcbiAgICAgICAgY29uc3QgTiA9IGRhdGEubGVuZ3RoO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBOOyBpICsrKXtcbiAgICAgICAgICAgIGNvbnN0IHggPSBkYXRhW2ldWzBdO1xuICAgICAgICAgICAgY29uc3QgeSA9IGRhdGFbaV1bMV07XG4gICAgICAgICAgICBjb25zdCBkaWZmID0gKHkgLSB0aGlzLmxpbmUoeCkpO1xuICAgICAgICAgICAgLy9jYWxjdWxhdGUgdGhlIGdyYWRpZW50cyBmb3IgYSBzaW5nbGUgc2FtcGxlXG4gICAgICAgICAgICBsZXQgYkdyYWQgPSBkaWZmO1xuICAgICAgICAgICAgbGV0IG1HcmFkID0gZGlmZiAqIHg7XG4gICAgICAgICAgICAvL3VwZGF0ZSBZIGludGVyY2VwdFxuICAgICAgICAgICAgdGhpcy5iID0gdGhpcy5iICsgKHRoaXMuYSAqIGJHcmFkKTtcbiAgICAgICAgICAgIC8vdXBkYXRlIHNsb3BlXG4gICAgICAgICAgICB0aGlzLm0gPSB0aGlzLm0gLSAoLSgyL04pICogKHRoaXMuYSAqIG1HcmFkKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYyA9IHRoaXMuYztcbiAgICAgICAgLy9jb21wdXRlIHRoZSBtZWFuIHNxdWFyZWQgZXJyb3JcbiAgICAgICAgdGhpcy5jID0gdGhpcy5jb3N0KHRoaXMudHJhaW5pbmdfZXhhbXBsZXMpO1xuICAgICAgICB0aGlzLmNvc3RIaXN0b3J5LnB1c2godGhpcy5jKTtcbiAgICAgICAgLy9rZWVwIHRyYWNrIG9mIHRoZSBiZXN0IHBvc3NpYmxlIGFuc3dlclxuICAgICAgICBpZih0aGlzLmMgPCB0aGlzLmJlc3RDKXtcbiAgICAgICAgICAgIHRoaXMuYmVzdEIgPSB0aGlzLmI7XG4gICAgICAgICAgICB0aGlzLmJlc3RNID0gdGhpcy5tO1xuICAgICAgICAgICAgdGhpcy5iZXN0QyA9IHRoaXMuYztcbiAgICAgICAgfVxuICAgICAgICAvL2NvbXB1dGUgdGhlIGNoYW5nZSBpbiBjb3N0XG4gICAgICAgIGxldCBjY29zdCA9IE1hdGguYWJzKHRoaXMucGMgLSB0aGlzLmMpO1xuICAgICAgICB0aGlzLmRyYXdMaW5lKCk7XG5cbiAgICAgICAgaWYoY2Nvc3QgPCBSZWdyZXNzb3IuUFJFQ0lTSU9OIHx8IHRoaXMubmkgPj0gUmVncmVzc29yLk1BWF9JVEVSQVRJT04pe1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpO1xuICAgICAgICAgICAgdGhpcy5iID0gdGhpcy5iZXN0QjtcbiAgICAgICAgICAgIHRoaXMubSA9IHRoaXMuYmVzdE07XG4gICAgICAgICAgICB0aGlzLmRyYXdDb3N0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcG9jaCh0aGlzLnRyYWluaW5nX2V4YW1wbGVzKTtcbiAgICAgICAgICAgIH0sIFJlZ3Jlc3Nvci5USU1FX0lOVEVSVkFMKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBTdG9jaGFzdGljO1xuXG4iXX0=

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);
//# sourceMappingURL=Worker.js.map