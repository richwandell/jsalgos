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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Regressor = __webpack_require__(1);

var _Regressor2 = _interopRequireDefault(_Regressor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Main = function () {
    _createClass(Main, [{
        key: 'drawCost',
        value: function drawCost(objectName, batchNum, costHistory) {
            new Highcharts.Chart({
                chart: {
                    renderTo: 'hc_container_error' + batchNum
                },
                title: {
                    text: objectName + "GD Cost Regression #" + (batchNum + 1)
                },
                yAxis: {
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Cost',
                    data: costHistory,
                    lineWidth: 1,
                    type: 'spline',
                    color: 'palevioletred',
                    marker: {
                        enabled: false
                    }
                }],
                plotOptions: {
                    series: {
                        animation: false
                    }
                }
            });
        }
    }, {
        key: 'drawLine',
        value: function drawLine(batchNum, lineData) {
            var series = this.charts[batchNum].get('regression_line');
            if (series) {
                series.remove();
            }
            this.charts[batchNum].addSeries({
                name: 'Regression Line',
                id: 'regression_line',
                data: lineData,
                lineWidth: 1,
                type: "spline",
                color: 'steelblue',
                marker: {
                    enabled: false
                }
            });
        }
    }, {
        key: 'createWorkers',
        value: function createWorkers(num, measurements, workerTypes, realNumbers, startYs) {
            var _this = this;

            this.charts = [];
            for (var i = 0; i < num; i++) {
                this.charts.push(new Highcharts.Chart({
                    chart: {
                        renderTo: 'hc_container' + i
                    },
                    title: {
                        text: ''
                    },
                    yAxis: {
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series: [{
                        name: 'Measurement',
                        data: measurements[i],
                        lineWidth: 0,
                        type: 'spline',
                        color: 'palevioletred',
                        marker: {
                            enabled: true,
                            radius: 3
                        }
                    }],
                    plotOptions: {
                        series: {
                            animation: false
                        }
                    }
                }));

                this.workers = [];
                var w = new Worker("Worker.js");
                w.postMessage({
                    action: 'SET_WORKER_VARS',
                    batchNum: i,
                    workerType: workerTypes[i],
                    measurements: measurements[i],
                    realNumbers: realNumbers[i],
                    startY: startYs[i]
                });
                w.onmessage = function (e) {
                    _this.receivedWorkerMessage(e);
                };
                this.workers.push(w);
            }
        }
    }, {
        key: 'receivedWorkerMessage',
        value: function receivedWorkerMessage(e) {
            switch (e.data.action) {
                case 'DRAW_LINE':
                    this.drawLine(e.data.batchNum, e.data.lineData);
                    $("#epoc_number" + e.data.batchNum).html("Epocs: " + e.data.epocNum);
                    break;

                case 'DRAW_COST':
                    this.drawCost(e.data.objectName, e.data.batchNum, e.data.costHistory);
                    $("#epoc_number" + e.data.batchNum).html("Convergence in " + e.data.epocNum + " epocs!");
                    break;
            }
        }
    }, {
        key: 'realEq1',
        value: function realEq1(i) {
            return i;
        }
    }, {
        key: 'realEq2',
        value: function realEq2(i) {
            return 50;
        }
    }, {
        key: 'makeDatasets',
        value: function makeDatasets() {
            var _this2 = this;

            var rn1 = Array.apply(null, { length: _Regressor2.default.NUM_POINTS }).map(function (item, index) {
                return _this2.realEq1(index);
            });

            var rn2 = Array.apply(null, { length: _Regressor2.default.NUM_POINTS }).map(function (item, index) {
                return _this2.realEq2(index);
            });

            var m1 = rn1.map(function (item, i) {
                var min = item - item * _Regressor2.default.RANDOM_ALPHA;
                var max = item + item * _Regressor2.default.RANDOM_ALPHA;
                return Math.random() * (max - min) + min;
            });

            var m2 = rn2.map(function (item, i) {
                var min = item - item * _Regressor2.default.RANDOM_ALPHA;
                var max = item + item * _Regressor2.default.RANDOM_ALPHA;
                return Math.random() * (max - min) + min;
            });

            return [rn1, m1, rn2, m2];
        }
    }]);

    function Main() {
        var _this3 = this;

        _classCallCheck(this, Main);

        var _makeDatasets = this.makeDatasets(),
            _makeDatasets2 = _slicedToArray(_makeDatasets, 4),
            rn1 = _makeDatasets2[0],
            m1 = _makeDatasets2[1],
            rn2 = _makeDatasets2[2],
            m2 = _makeDatasets2[3];

        $(function () {
            var r1 = Math.round(Math.random() * (m1.length - 1));
            var r2 = Math.round(Math.random() * (m2.length - 1));
            var startY1 = m1[r1];
            var startY2 = m2[r2];
            _this3.createWorkers(4, [m1, m2, m1, m2], ["BATCH", "BATCH", "STOCHASTIC", "STOCHASTIC"], [rn1, rn2, rn1, rn2], [startY1, startY2, startY1, startY2]);
        });
    }

    return Main;
}();

new Main();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9saW5lYXJfcmVncmVzc2lvbi9iZ2RWc2dkL01haW4uZXM2Il0sIm5hbWVzIjpbIk1haW4iLCJvYmplY3ROYW1lIiwiYmF0Y2hOdW0iLCJjb3N0SGlzdG9yeSIsIkhpZ2hjaGFydHMiLCJDaGFydCIsImNoYXJ0IiwicmVuZGVyVG8iLCJ0aXRsZSIsInRleHQiLCJ5QXhpcyIsInBsb3RMaW5lcyIsInZhbHVlIiwid2lkdGgiLCJjb2xvciIsImxlZ2VuZCIsImxheW91dCIsImFsaWduIiwidmVydGljYWxBbGlnbiIsImJvcmRlcldpZHRoIiwic2VyaWVzIiwibmFtZSIsImRhdGEiLCJsaW5lV2lkdGgiLCJ0eXBlIiwibWFya2VyIiwiZW5hYmxlZCIsInBsb3RPcHRpb25zIiwiYW5pbWF0aW9uIiwibGluZURhdGEiLCJjaGFydHMiLCJnZXQiLCJyZW1vdmUiLCJhZGRTZXJpZXMiLCJpZCIsIm51bSIsIm1lYXN1cmVtZW50cyIsIndvcmtlclR5cGVzIiwicmVhbE51bWJlcnMiLCJzdGFydFlzIiwiaSIsInB1c2giLCJyYWRpdXMiLCJ3b3JrZXJzIiwidyIsIldvcmtlciIsInBvc3RNZXNzYWdlIiwiYWN0aW9uIiwid29ya2VyVHlwZSIsInN0YXJ0WSIsIm9ubWVzc2FnZSIsImUiLCJyZWNlaXZlZFdvcmtlck1lc3NhZ2UiLCJkcmF3TGluZSIsIiQiLCJodG1sIiwiZXBvY051bSIsImRyYXdDb3N0Iiwicm4xIiwiQXJyYXkiLCJhcHBseSIsImxlbmd0aCIsIk5VTV9QT0lOVFMiLCJtYXAiLCJpdGVtIiwiaW5kZXgiLCJyZWFsRXExIiwicm4yIiwicmVhbEVxMiIsIm0xIiwibWluIiwiUkFORE9NX0FMUEhBIiwibWF4IiwiTWF0aCIsInJhbmRvbSIsIm0yIiwibWFrZURhdGFzZXRzIiwicjEiLCJyb3VuZCIsInIyIiwic3RhcnRZMSIsInN0YXJ0WTIiLCJjcmVhdGVXb3JrZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7SUFFTUEsSTs7O2lD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QUNPRixHQURQO0FBQUEsWUFDWVEsRUFEWjs7QUFHVHJCLFVBQUUsWUFBTTtBQUNKLGdCQUFNdUIsS0FBS0osS0FBS0ssS0FBTCxDQUFXTCxLQUFLQyxNQUFMLE1BQWlCTCxHQUFHUixNQUFILEdBQVksQ0FBN0IsQ0FBWCxDQUFYO0FBQ0EsZ0JBQU1rQixLQUFLTixLQUFLSyxLQUFMLENBQVdMLEtBQUtDLE1BQUwsTUFBaUJDLEdBQUdkLE1BQUgsR0FBWSxDQUE3QixDQUFYLENBQVg7QUFDQSxnQkFBTW1CLFVBQVVYLEdBQUdRLEVBQUgsQ0FBaEI7QUFDQSxnQkFBTUksVUFBVU4sR0FBR0ksRUFBSCxDQUFoQjtBQUNBLG1CQUFLRyxhQUFMLENBQW1CLENBQW5CLEVBQ0ksQ0FBQ2IsRUFBRCxFQUFLTSxFQUFMLEVBQVNOLEVBQVQsRUFBYU0sRUFBYixDQURKLEVBRUksQ0FBQyxPQUFELEVBQVUsT0FBVixFQUFtQixZQUFuQixFQUFpQyxZQUFqQyxDQUZKLEVBR0ksQ0FBQ2pCLEdBQUQsRUFBTVMsR0FBTixFQUFXVCxHQUFYLEVBQWdCUyxHQUFoQixDQUhKLEVBSUksQ0FBQ2EsT0FBRCxFQUFVQyxPQUFWLEVBQW1CRCxPQUFuQixFQUE0QkMsT0FBNUIsQ0FKSjtBQU1ILFNBWEQ7QUFZSDs7Ozs7QUFHTCxJQUFJakYsSUFBSiIsImZpbGUiOiJNYWluLmVzNiIsInNvdXJjZVJvb3QiOiIvVXNlcnMvcmljaHdhbmRlbGwvUGhwc3Rvcm1Qcm9qZWN0cy9qc2FsZ29zIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlZ3Jlc3NvciBmcm9tICcuL1JlZ3Jlc3Nvcic7XG5cbmNsYXNzIE1haW57XG5cbiAgICBkcmF3Q29zdChvYmplY3ROYW1lLCBiYXRjaE51bSwgY29zdEhpc3Rvcnkpe1xuICAgICAgICBuZXcgSGlnaGNoYXJ0cy5DaGFydCh7XG4gICAgICAgICAgICBjaGFydDp7XG4gICAgICAgICAgICAgICAgcmVuZGVyVG86ICdoY19jb250YWluZXJfZXJyb3InICsgYmF0Y2hOdW1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgIHRleHQ6IG9iamVjdE5hbWUgKyBcIkdEIENvc3QgUmVncmVzc2lvbiAjXCIgKyAoYmF0Y2hOdW0gKyAxKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHlBeGlzOiB7XG4gICAgICAgICAgICAgICAgcGxvdExpbmVzOiBbe1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzgwODA4MCdcbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgIGxheW91dDogJ3ZlcnRpY2FsJyxcbiAgICAgICAgICAgICAgICBhbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgICBib3JkZXJXaWR0aDogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlcmllczogW3tcbiAgICAgICAgICAgICAgICBuYW1lOiAnQ29zdCcsXG4gICAgICAgICAgICAgICAgZGF0YTogY29zdEhpc3RvcnksXG4gICAgICAgICAgICAgICAgbGluZVdpZHRoIDogMSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnc3BsaW5lJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogJ3BhbGV2aW9sZXRyZWQnLFxuICAgICAgICAgICAgICAgIG1hcmtlciA6IHtcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlZCA6IGZhbHNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICBwbG90T3B0aW9uczp7XG4gICAgICAgICAgICAgICAgc2VyaWVzOiB7XG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZmFsc2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRyYXdMaW5lKGJhdGNoTnVtLCBsaW5lRGF0YSl7XG4gICAgICAgIGxldCBzZXJpZXMgPSB0aGlzLmNoYXJ0c1tiYXRjaE51bV0uZ2V0KCdyZWdyZXNzaW9uX2xpbmUnKTtcbiAgICAgICAgaWYoc2VyaWVzKXtcbiAgICAgICAgICAgIHNlcmllcy5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNoYXJ0c1tiYXRjaE51bV0uYWRkU2VyaWVzKHtcbiAgICAgICAgICAgIG5hbWU6ICdSZWdyZXNzaW9uIExpbmUnLFxuICAgICAgICAgICAgaWQ6ICdyZWdyZXNzaW9uX2xpbmUnLFxuICAgICAgICAgICAgZGF0YTogbGluZURhdGEsXG4gICAgICAgICAgICBsaW5lV2lkdGg6IDEsXG4gICAgICAgICAgICB0eXBlOiBcInNwbGluZVwiLFxuICAgICAgICAgICAgY29sb3I6ICdzdGVlbGJsdWUnLFxuICAgICAgICAgICAgbWFya2VyOiB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY3JlYXRlV29ya2VycyhudW0sIG1lYXN1cmVtZW50cywgd29ya2VyVHlwZXMsIHJlYWxOdW1iZXJzLCBzdGFydFlzKXtcbiAgICAgICAgdGhpcy5jaGFydHMgPSBbXTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmNoYXJ0cy5wdXNoKG5ldyBIaWdoY2hhcnRzLkNoYXJ0KHtcbiAgICAgICAgICAgICAgICBjaGFydDoge1xuICAgICAgICAgICAgICAgICAgICByZW5kZXJUbzogJ2hjX2NvbnRhaW5lcicgKyBpXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgcGxvdExpbmVzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzgwODA4MCdcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICBsYXlvdXQ6ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyV2lkdGg6IDBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNlcmllczogW3tcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJ01lYXN1cmVtZW50JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogbWVhc3VyZW1lbnRzW2ldLFxuICAgICAgICAgICAgICAgICAgICBsaW5lV2lkdGg6IDAsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzcGxpbmUnLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJ3BhbGV2aW9sZXRyZWQnLFxuICAgICAgICAgICAgICAgICAgICBtYXJrZXI6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDNcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICAgIHBsb3RPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgIHNlcmllczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICB0aGlzLndvcmtlcnMgPSBbXTtcbiAgICAgICAgICAgIGxldCB3ID0gbmV3IFdvcmtlcihcIldvcmtlci5qc1wiKTtcbiAgICAgICAgICAgIHcucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIGFjdGlvbjogJ1NFVF9XT1JLRVJfVkFSUycsXG4gICAgICAgICAgICAgICAgYmF0Y2hOdW06IGksXG4gICAgICAgICAgICAgICAgd29ya2VyVHlwZTogd29ya2VyVHlwZXNbaV0sXG4gICAgICAgICAgICAgICAgbWVhc3VyZW1lbnRzOiBtZWFzdXJlbWVudHNbaV0sXG4gICAgICAgICAgICAgICAgcmVhbE51bWJlcnM6IHJlYWxOdW1iZXJzW2ldLFxuICAgICAgICAgICAgICAgIHN0YXJ0WTogc3RhcnRZc1tpXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB3Lm9ubWVzc2FnZSA9IChlKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWNlaXZlZFdvcmtlck1lc3NhZ2UoZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy53b3JrZXJzLnB1c2godyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZWNlaXZlZFdvcmtlck1lc3NhZ2UoZSl7XG4gICAgICAgIHN3aXRjaChlLmRhdGEuYWN0aW9uKXtcbiAgICAgICAgICAgIGNhc2UgJ0RSQVdfTElORSc6XG4gICAgICAgICAgICAgICAgdGhpcy5kcmF3TGluZShlLmRhdGEuYmF0Y2hOdW0sIGUuZGF0YS5saW5lRGF0YSk7XG4gICAgICAgICAgICAgICAgJChcIiNlcG9jX251bWJlclwiICsgZS5kYXRhLmJhdGNoTnVtKS5odG1sKFwiRXBvY3M6IFwiICsgZS5kYXRhLmVwb2NOdW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdEUkFXX0NPU1QnOlxuICAgICAgICAgICAgICAgIHRoaXMuZHJhd0Nvc3QoZS5kYXRhLm9iamVjdE5hbWUsIGUuZGF0YS5iYXRjaE51bSwgZS5kYXRhLmNvc3RIaXN0b3J5KTtcbiAgICAgICAgICAgICAgICAkKFwiI2Vwb2NfbnVtYmVyXCIgKyBlLmRhdGEuYmF0Y2hOdW0pLmh0bWwoXCJDb252ZXJnZW5jZSBpbiBcIiArIGUuZGF0YS5lcG9jTnVtICsgXCIgZXBvY3MhXCIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVhbEVxMShpKXtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgfVxuXG4gICAgcmVhbEVxMihpKXtcbiAgICAgICAgcmV0dXJuIDUwO1xuICAgIH1cblxuICAgIG1ha2VEYXRhc2V0cygpe1xuICAgICAgICBjb25zdCBybjEgPSBBcnJheS5hcHBseShudWxsLCB7bGVuZ3RoOiBSZWdyZXNzb3IuTlVNX1BPSU5UU30pXG4gICAgICAgICAgICAubWFwKCAoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFsRXExKGluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IHJuMiA9IEFycmF5LmFwcGx5KG51bGwsIHtsZW5ndGg6IFJlZ3Jlc3Nvci5OVU1fUE9JTlRTfSlcbiAgICAgICAgICAgIC5tYXAoIChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWxFcTIoaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbTEgPSBybjFcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0sIGkpIHtcbiAgICAgICAgICAgICAgICBsZXQgbWluID0gaXRlbSAtIGl0ZW0gKiBSZWdyZXNzb3IuUkFORE9NX0FMUEhBO1xuICAgICAgICAgICAgICAgIGxldCBtYXggPSBpdGVtICsgaXRlbSAqIFJlZ3Jlc3Nvci5SQU5ET01fQUxQSEE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSArIG1pbjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG0yID0gcm4yXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtLCBpKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1pbiA9IGl0ZW0gLSBpdGVtICogUmVncmVzc29yLlJBTkRPTV9BTFBIQTtcbiAgICAgICAgICAgICAgICBsZXQgbWF4ID0gaXRlbSArIGl0ZW0gKiBSZWdyZXNzb3IuUkFORE9NX0FMUEhBO1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gW3JuMSwgbTEsIHJuMiwgbTJdO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIGNvbnN0IFtybjEsIG0xLCBybjIsIG0yXSA9IHRoaXMubWFrZURhdGFzZXRzKCk7XG5cbiAgICAgICAgJCgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByMSA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIChtMS5sZW5ndGggLSAxKSk7XG4gICAgICAgICAgICBjb25zdCByMiA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIChtMi5sZW5ndGggLSAxKSk7XG4gICAgICAgICAgICBjb25zdCBzdGFydFkxID0gbTFbcjFdO1xuICAgICAgICAgICAgY29uc3Qgc3RhcnRZMiA9IG0yW3IyXTtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlV29ya2Vycyg0LFxuICAgICAgICAgICAgICAgIFttMSwgbTIsIG0xLCBtMl0sXG4gICAgICAgICAgICAgICAgW1wiQkFUQ0hcIiwgXCJCQVRDSFwiLCBcIlNUT0NIQVNUSUNcIiwgXCJTVE9DSEFTVElDXCJdLFxuICAgICAgICAgICAgICAgIFtybjEsIHJuMiwgcm4xLCBybjJdLFxuICAgICAgICAgICAgICAgIFtzdGFydFkxLCBzdGFydFkyLCBzdGFydFkxLCBzdGFydFkyXVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5uZXcgTWFpbigpOyJdfQ==

/***/ }),
/* 1 */
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map