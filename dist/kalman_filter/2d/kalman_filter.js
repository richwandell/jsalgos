!function(e){function r(n){if(a[n])return a[n].exports;var t=a[n]={i:n,l:!1,exports:{}};return e[n].call(t.exports,t,t.exports,r),t.l=!0,t.exports}var a={};r.m=e,r.c=a,r.i=function(e){return e},r.d=function(e,a,n){r.o(e,a)||Object.defineProperty(e,a,{configurable:!1,enumerable:!0,get:n})},r.n=function(e){var a=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(a,"a",a),a},r.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},r.p="",r(r.s=1)}([function(e,r,a){"use strict";function n(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}new function e(){n(this,e),this.realNumbers=[],this.dirtyNumbers=[],this.kalmanPrediction=null;math.ones(2),math.ones(2),math.ones(2)},function(e){function r(e){mea=e;var r=math.add(eest,emea);kg=math.dotDivide(eest,r);var a=math.subtract(mea,pest),n=math.dotMultiply(kg,a);cest=math.add(pest,n),pest=cest;var t=math.add(emea,eest),i=math.dotMultiply(emea,eest);return eest=math.dotDivide(i,t),cest.valueOf()}function a(e,r){var a=real_numbers[fake_which][r]-.8*real_numbers[fake_which][r],n=real_numbers[fake_which][r]+.8*real_numbers[fake_which][r];return Math.random()*(n-a)+a}function n(e,r){real_numbers[e]=Array.apply(null,{length:r}).map(function(r,a){return e}),fake_which=e,real_number_array.push(e),dirty_numbers[e]=real_numbers[e].map(a)}function t(a,t){n(a,50),n(t,50);var i=dirty_numbers[a].map(function(e,r){return[e,dirty_numbers[t][r]]});return pest=i[0],console.log(dirty_numbers,i),kalman_prediction=i.map(r),e("#real1").val(a),e("#real2").val(t),[{name:"Measurement: ",data:i,lineWidth:0,color:"rgba(119, 152, 191, .5)",marker:{enabled:!0,radius:3}},{name:"Kalman Prediction",data:kalman_prediction,color:"rgba(223, 83, 83, .5)",lineWidth:0,marker:{enabled:!0,radius:5}}]}e(function(){var n=t(50,25);e("#hc_container").highcharts({chart:{type:"scatter"},title:{text:"Kalman Filter"},yAxis:{plotLines:[{value:0,width:1,color:"#808080"}]},legend:{layout:"vertical",align:"right",verticalAlign:"middle",borderWidth:0},series:n}),e("#clear").click(function(){for(var r=e("#hc_container").highcharts();r.series.length>0;)r.series[0].remove();real_numbers=[],dirty_numbers=[]});var i;e("#measure").click(function(){if("number"==typeof i)return clearInterval(i),void(i=null);i=setInterval(function(){var n=Number(e("#real1").val()),i=Number(e("#real2").val());real_numbers[real_number_array[0]].push(n),real_numbers[real_number_array[1]].push(i),fake_which=real_number_array[0];var l=a(null,real_numbers.length-1);fake_which=real_number_array[1];var u=a(null,real_numbers.length-1),s=r([l,u]),o=e("#hc_container").highcharts();if(0==o.series.length){real_numbers=[real];var c=t(real_numbers[0],real_numbers.length);e(c).each(function(e,r){o.addSeries(r)})}var m=o.series[0],h=o.series[1],d=real_numbers[real_number_array[0]].length>50;m.addPoint([l,u],!1,d),h.addPoint(s,!1,d),o.redraw()},1e3)}),e("#real1, #real2").change(function(){eest=math.ones(2),emea=math.ones(2)})})}(jQuery)},function(e,r,a){e.exports=a(0)}]);
//# sourceMappingURL=kalman_filter.js.map