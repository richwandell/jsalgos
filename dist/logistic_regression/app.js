!function(t){function e(n){if(i[n])return i[n].exports;var r=i[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var i={};e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=5)}([function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),a=function(){function t(e,i,r,a){n(this,t),this.real_numbers=e,this.measurements=i,this.batchNum=r,this.object_name=a,this.costHistory=[],this.epocPost=0,this.setup()}return r(t,[{key:"start",value:function(t){this.b=t,this.epoch(this.training_examples)}},{key:"line",value:function(t){return this.b+this.m*t}},{key:"cost",value:function(t){var e=0,i=void 0,n=void 0,r=void 0;for(i=0;i<t.length;i++)n=t[i][0],r=t[i][1],e+=Math.pow(r-this.line(n),2);return e/t.length}},{key:"getLineData",value:function(){var t=this;return this.real_numbers.map(function(e,i){return t.line(i)})}},{key:"drawCost",value:function(){postMessage({action:"DRAW_COST",objectName:this.object_name,batchNum:this.batchNum,costHistory:this.costHistory,epocNum:this.ni})}},{key:"drawLine",value:function(){if(this.epocPost%10==0){var t=this.getLineData();postMessage({action:"DRAW_LINE",lineData:t,batchNum:this.batchNum,epocNum:this.ni})}this.epocPost++}},{key:"setup",value:function(){this.training_examples=this.measurements.map(function(t,e){return[e,t]}),this.ni=0,this.c=0,this.a=t.LEARNING_RATE,this.bestB=0,this.bestM=0,this.bestC=1/0,this.m=0,this.timer=null,this.hc=null,this.pc=1/0}}]),t}();a.NUM_POINTS=50,a.TIME_INTERVAL=10,a.RANDOM_ALPHA=.5,a.LEARNING_RATE=.001,a.MAX_ITERATION=1e3,a.PRECISION=.001,e.default=a},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var a=function(){function t(t,e){var i=[],n=!0,r=!1,a=void 0;try{for(var o,s=t[Symbol.iterator]();!(n=(o=s.next()).done)&&(i.push(o.value),!e||i.length!==e);n=!0);}catch(t){r=!0,a=t}finally{try{!n&&s.return&&s.return()}finally{if(r)throw a}}return i}return function(e,i){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return t(e,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),o=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),s=i(3),u=n(s),h=i(4),c=n(h),l=function(){function t(){r(this,t),window.gistAsync();this.c1=1,this.c2=0;var e=this.makeDataset(50),i=a(e,4),n=i[0],o=i[1],s=i[2];i[3];this.X=n,this.y=o,this.xNormalizer=new u.default(s),this.nX=this.xNormalizer.getNormalizedDataset(),this.t=new c.default(this,o,this.nX),this.draw(),this.t.start(1)}return o(t,[{key:"drawLine",value:function(){var t=this,e=this.test.map(function(e,i){return{x:i,y:t.sigmoid(e,t.c1,t.c2)}}),i=this,n={id:"regression-line",name:"Regression Line",data:e,lineWidth:1,type:"spline",color:"steelblue",marker:{enabled:!0,radius:2},tooltip:{pointFormatter:function(){return'<span style="color:{point.color}"></span> \n                        Credit Score: <b>'+i.creditScoreDisplay(this.y)+"</b>\n                        <br/>\n                        Approved: <b>"+(this.y>.5?"yes":"no")+"</b>\n                    "}}},r=this.hc.get("regression-line");r&&r.remove(),this.hc.addSeries(n)}},{key:"creditScoreDisplay",value:function(t){return 550*t+300}},{key:"drawCost",value:function(t){this.drawLine(),new Highcharts.Chart({chart:{renderTo:"hc_container_error"},title:{text:"SGD Cost"},yAxis:{plotLines:[{value:0,width:1,color:"#808080"}]},legend:{layout:"vertical",align:"right",verticalAlign:"middle",borderWidth:0},series:[{name:"Cost",data:t,lineWidth:1,type:"spline",color:"palevioletred",marker:{enabled:!1}}],plotOptions:{series:{animation:!1}}})}},{key:"sigmoid",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return 1/(1+Math.pow(Math.E,-(e*t-i)))}},{key:"derivative",value:function(t){var e=this.sigmoid(t);return e*(1-e)}},{key:"cost",value:function(t,e){var i=this,n=t.map(function(t){return i.sigmoid(t,i.c1,i.c2)}),r=math.subtract(e,n);return math.sum(math.dotPow(r,2))/t.length}},{key:"makeDataset",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;this.testNormalizer=new u.default(Array.apply(null,{length:e}).map(Number.call,Number)),this.test=this.testNormalizer.getNormalizedDataset();var i=this.test.map(function(i,n){return t.sigmoid(n,1,e/2)}),n=this.test.map(function(i,n){return t.sigmoid(n,1,e/3)}),r=this.test.map(function(i,n){return t.sigmoid(n,1,e/3*2)}),a=math.concat(i,n,r),o=Array.apply(null,{length:a.length}).map(function(t,i){var n=a[i],r=n-.5,o=n+.5;return[i%e,Math.random()*(o-r)+r,Math.round(n)]});o=o.sort(function(t,e){return t[0]>e[0]?1:t[0]===e[0]?0:-1}),console.log(o);var s=math.subset(o,math.index(math.range(0,o.length),math.range(0,o[0].length-1)));return[s,math.flatten(math.subset(o,math.index(math.range(0,o.length),o[0].length-1))),math.flatten(math.subset(s,math.index(math.range(0,s.length),s[0].length-1))),a]}},{key:"draw",value:function(){var t=this,e=this.nX.map(function(e,i){return{x:t.X[i][0],y:e,approved:t.y[i]}}),i=[{name:"Credit Score",data:e,lineWidth:0,type:"spline",color:"palevioletred",marker:{enabled:!0,radius:3},tooltip:{pointFormatter:function(){return'<span style="color:{point.color}"></span> \n                        Credit Score: <b>'+n.creditScoreDisplay(this.y)+"</b>\n                        <br/>\n                        Approved: <b>"+(1===this.approved?"Yes":"No")+"</b>\n                    "}}},{name:"Approved",data:this.y.map(function(e,i){return[t.X[i][0],e]}),lineWidth:0,type:"spline",color:"darkseagreen",marker:{enabled:!0,radius:3},tooltip:{pointFormatter:function(){return 1===this.y?"Yes":"No"}}}],n=this;this.hc=new Highcharts.Chart({chart:{renderTo:"hc_container"},title:{text:"Logistic Regression"},yAxis:{plotLines:[{value:0,width:1,color:"#808080"}],max:1,min:0,labels:{formatter:function(){return n.creditScoreDisplay(this.value)}},title:{text:"Credit Score"}},legend:{layout:"vertical",align:"right",verticalAlign:"middle",borderWidth:0},series:i,plotOptions:{series:{animation:!1}}})}}]),t}();e.default=l,$(function(){return new l})},function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function r(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),s=i(0),u=function(t){return t&&t.__esModule?t:{default:t}}(s),h=function(t){function e(t,i,a){n(this,e);var o=r(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,t,i,a,"Stochastic"));return o.a=.02,o}return a(e,t),o(e,[{key:"shuffle",value:function(t){for(var e=[],i=t.slice(0);i.length>0;){var n=Math.round(Math.random()*i.length),r=i.splice(n,1)[0];void 0!==r&&e.push(r)}return e}},{key:"epoch",value:function(t){var e=this;this.ni++;for(var i=this.shuffle(t),n=i.length,r=0;r<n;r++){var a=i[r][0],o=i[r][1],s=o-this.line(a),h=s,c=s*a;this.b=this.b+this.a*h,this.m=this.m- -2/n*(this.a*c)}this.pc=this.c,this.c=this.cost(this.training_examples),this.costHistory.push(this.c),this.c<this.bestC&&(this.bestB=this.b,this.bestM=this.m,this.bestC=this.c);var l=Math.abs(this.pc-this.c);this.drawLine(),l<u.default.PRECISION||this.ni>=u.default.MAX_ITERATION?(clearTimeout(this.timer),this.b=this.bestB,this.m=this.bestM,this.drawCost()):this.timer=setTimeout(function(){e.epoch(e.training_examples)},u.default.TIME_INTERVAL)}}]),e}(u.default);e.default=h},function(t,e,i){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),a=function(){function t(e){n(this,t),this.dataSet=e,this.max=math.max(this.dataSet),this.min=math.min(this.dataSet),this.n=this.normalize(this.dataSet)}return r(t,[{key:"getNormalizedDataset",value:function(){return this.n}},{key:"normalize",value:function(t){var e=math.subtract(t,this.min);return math.divide(e,this.max-this.min)}},{key:"denormalize",value:function(t){var e=this.max-this.min;return e*t+e}}]),t}();e.default=a},function(t,e,i){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function o(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var s=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),u=function t(e,i,n){null===e&&(e=Function.prototype);var r=Object.getOwnPropertyDescriptor(e,i);if(void 0===r){var a=Object.getPrototypeOf(e);return null===a?void 0:t(a,i,n)}if("value"in r)return r.value;var o=r.get;if(void 0!==o)return o.call(n)},h=i(0),c=n(h),l=i(2),f=n(l),p=function(t){function e(t,i,n){r(this,e);var o=a(this,(e.__proto__||Object.getPrototypeOf(e)).call(this,i,n,0));return o.x=n,o.y=i,o.main=t,o.a=.02,c.default.MAX_ITERATION=300,c.default.TIME_INTERVAL=5,c.default.PRECISION=1e-5,o.b=1,o.m=10,o}return o(e,t),s(e,[{key:"setup",value:function(){var t=this;u(e.prototype.__proto__||Object.getPrototypeOf(e.prototype),"setup",this).call(this),this.training_examples=this.real_numbers.map(function(e,i){return[t.measurements[i],e]})}},{key:"drawLine",value:function(){this.ni%2==0&&this.main.drawLine()}},{key:"drawCost",value:function(){this.main.drawCost(this.costHistory)}},{key:"line",value:function(t){return this.main.sigmoid(t,this.b,this.m)}},{key:"cost",value:function(t){this.main.c1=this.b,this.main.c2=this.m;var e=math.flatten(math.subset(t,math.index(math.range(0,t.length),0))),i=math.flatten(math.subset(t,math.index(math.range(0,t.length),1)));return this.main.cost(e,i)}},{key:"epoch",value:function(t){var e=this;this.ni++;for(var i=this.shuffle(t),n=i.length,r=0;r<n;r++){var a=i[r][0],o=i[r][1],s=o-this.line(a),u=s,h=2*s;this.b=this.b+this.a*u,this.m=this.m- -2/n*this.a*h,this.main.c1=this.b,this.main.c2=this.m}this.pc=this.c,this.c=this.cost(i),this.costHistory.push(this.c),this.c<this.bestC&&(this.bestB=this.b,this.bestM=this.m,this.bestC=this.c);var l=Math.abs(this.pc-this.c);this.drawLine(),l<c.default.PRECISION||this.ni>=c.default.MAX_ITERATION?(clearTimeout(this.timer),this.b=this.bestB,this.m=this.bestM,this.main.c1=this.b,this.main.c2=this.m,this.drawCost()):this.timer=setTimeout(function(){e.epoch(e.training_examples)},c.default.TIME_INTERVAL)}}]),e}(f.default);e.default=p},function(t,e,i){t.exports=i(1)}]);
//# sourceMappingURL=app.js.map