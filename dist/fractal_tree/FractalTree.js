!function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=1)}([function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();new(function(){function t(){var e=this;i(this,t),this.canvas=document.getElementById("the_canvas"),this.ctx=this.canvas.getContext("2d"),this.slider=document.getElementById("range_slider"),this.height=1e3,this.width=1e3,this.angle=this.slider.value,this.canvas.height=this.height,this.canvas.width=this.width,this.slider.addEventListener("input",function(){e.angle=e.slider.value}),window.requestAnimationFrame(function(){e.draw()})}return r(t,[{key:"draw",value:function(){var t=this;this.ctx.fillStyle="white",this.ctx.clearRect(0,0,this.width,this.height);var e=[0,this.height/2],n=[e[0]+300,e[1]];this.ctx.beginPath(),this.ctx.strokeStyle="black",this.ctx.moveTo(e[0],e[1]),this.ctx.lineTo(n[0],n[1]),this.ctx.stroke(),this.branch(n,201,1),this.branch(n,201,-1),window.requestAnimationFrame(function(){return t.draw()})}},{key:"branch",value:function(t,e,n){var i=[t[0]+e*Math.cos(this.angle*n),t[1]+e*Math.sin(this.angle*n)];this.ctx.beginPath(),this.ctx.strokeStyle="black",this.ctx.moveTo(t[0],t[1]),this.ctx.lineTo(i[0],i[1]),this.ctx.stroke(),e>4&&(this.branch(i,.67*e,n+1),this.branch(i,.67*e,n-1))}}]),t}())},function(t,e,n){t.exports=n(0)}]);
//# sourceMappingURL=FractalTree.js.map