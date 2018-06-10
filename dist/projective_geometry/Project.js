!function(t){function n(o){if(i[o])return i[o].exports;var e=i[o]={i:o,l:!1,exports:{}};return t[o].call(e.exports,e,e.exports,n),e.l=!0,e.exports}var i={};n.m=t,n.c=i,n.i=function(t){return t},n.d=function(t,i,o){n.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:o})},n.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(i,"a",i),i},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=1)}([function(t,n,i){"use strict";function o(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}var e=function(){function t(t,n){for(var i=0;i<n.length;i++){var o=n[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(n,i,o){return i&&t(n.prototype,i),o&&t(n,o),n}}();new(function(){function t(){var n=this;o(this,t),$(function(){n.can=$("#geometry_canvas")[0],n.ctx=n.can.getContext("2d",{alpha:!1}),n.can.width=window.innerWidth,n.can.height=window.innerHeight,n.rotationX=Number($("#rotationx").val()),n.rotationY=Number($("#rotationy").val()),n.rotationZ=Number($("#rotationz").val()),n.projection=$("#projection").val(),n.boxZ=Number($("#boxz").val()),n.mouseX=n.can.width/2,n.mouseY=n.can.height/2,n.camera={x:0,y:0,z:Number($("#focallength").val()),rx:0,ry:0,rz:0,width:n.can.width,height:n.can.height,center:{x:n.can.width/2,y:n.can.height/2}},n.bindEvents(),requestAnimationFrame(function(){return n.draw()})})}return e(t,[{key:"bindEvents",value:function(){var t=this;$("#boxz").change(function(){t.boxZ=Number($("#boxz").val())}),$("#focallength").change(function(){t.camera.z=Number($("#focallength").val())}),$("#projection").change(function(){t.projection=$("#projection").val()}),$("#rotationx").change(function(){t.rotationX=Number($("#rotationx").val())}),$("#rotationy").change(function(){t.rotationY=Number($("#rotationy").val())}),$("#rotationz").change(function(){t.rotationZ=Number($("#rotationz").val())}),$(this.can).on({wheel:function(n){t.boxZ+=n.originalEvent.deltaY},mouseup:function(n){t.mouseDown=!1},mousedown:function(n){t.mouseDown=!0,t.mouseStartX=n.originalEvent.clientX,t.mouseStartY=n.originalEvent.clientY,t.mouseStartRotationX=t.rotationX,t.mouseStartRotationY=t.rotationY},mousemove:function(n){t.mouseX=n.originalEvent.clientX,t.mouseY=n.originalEvent.clientY,t.mouseDown&&(t.rotationX=t.mouseStartRotationX+(t.mouseStartX-t.mouseX),t.rotationY=t.mouseStartRotationY+(t.mouseStartY-t.mouseY),$("#rotationx").val(t.rotationX),$("#rotationy").val(t.rotationY))},touchstart:function(n){t.mouseStartX=n.originalEvent.changedTouches[0].clientX,t.mouseStartY=n.originalEvent.changedTouches[0].clientY,t.mouseStartRotationX=t.rotationX,t.mouseStartRotationY=t.rotationY,n.originalEvent.changedTouches.length>1&&(t.pinchingX=n.originalEvent.changedTouches[1].clientX,t.pinchingY=n.originalEvent.changedTouches[1].clientY,t.pinchDistance=t.distance([t.mouseStartX,t.mouseStartY],[t.pinchingX,t.pinchingY]))},touchmove:function(n){if(t.mouseX=n.originalEvent.changedTouches[0].clientX,t.mouseY=n.originalEvent.changedTouches[0].clientY,n.originalEvent.changedTouches.length>1){t.rotationX=t.mouseStartRotationX+(t.mouseStartX-t.mouseX),t.rotationY=t.mouseStartRotationY+(t.mouseStartY-t.mouseY),$("#rotationx").val(t.rotationX),$("#rotationy").val(t.rotationY);var i=t.distance([n.originalEvent.changedTouches[0].clientX,n.originalEvent.changedTouches[0].clientY],[n.originalEvent.changedTouches[1].clientX,n.originalEvent.changedTouches[1].clientY]),o=t.pinchDistance-i;$("#boxz").val(t.boxZ+o),t.boxZ+=o}},touchend:function(n){t.mouseX=n.originalEvent.changedTouches[0].clientX,t.mouseY=n.originalEvent.changedTouches[0].clientY}})}},{key:"distance",value:function(t,n){return Math.sqrt(Math.pow(Math.abs(t[0]-n[0]),2)+Math.pow(Math.abs(t[1]-n[1]),2))}},{key:"draw",value:function(){var t=this;this.ctx.fillStyle="black",this.ctx.fillRect(0,0,this.can.width,this.can.height),this.drawSquare(),this.drawBox(),requestAnimationFrame(function(){return t.draw()})}},{key:"drawBox",value:function(){var t=this.mouseX,n=this.mouseY;"p"===this.projection&&(t=this.can.width/2-this.mouseX,n=this.can.height/2-this.mouseY);var i=this.boxZ,o=math.matrix([[t-200,n-200,i-200],[t+200,n-200,i-200],[t+200,n+200,i-200],[t-200,n+200,i-200],[t-200,n-200,i+200],[t+200,n-200,i+200],[t+200,n+200,i+200],[t-200,n+200,i+200]]);o=this.makeHomogeneous(o);var e=this.getCentroid3d(o).toArray();o=this.rotate3d(o,e,this.rotationX,this.rotationY,this.rotationZ);var a=void 0;switch(this.projection){case"o":a=this.projectOrthographic(o);break;case"p":a=this.projectPerspective(o,e)}this.ctx.beginPath(),this.ctx.strokeStyle="rgb(255, 0, 0)",this.ctx.moveTo(a[0][0],a[0][1]),this.ctx.lineTo(a[1][0],a[1][1]),this.ctx.lineTo(a[2][0],a[2][1]),this.ctx.lineTo(a[3][0],a[3][1]),this.ctx.lineTo(a[0][0],a[0][1]),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.strokeStyle="rgb(0, 255, 0)",this.ctx.moveTo(a[4][0],a[4][1]),this.ctx.lineTo(a[5][0],a[5][1]),this.ctx.lineTo(a[6][0],a[6][1]),this.ctx.lineTo(a[7][0],a[7][1]),this.ctx.lineTo(a[4][0],a[4][1]),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.strokeStyle="rgb(0, 0, 255)",this.ctx.moveTo(a[0][0],a[0][1]),this.ctx.lineTo(a[4][0],a[4][1]),this.ctx.lineTo(a[7][0],a[7][1]),this.ctx.lineTo(a[3][0],a[3][1]),this.ctx.lineTo(a[0][0],a[0][1]),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.strokeStyle="rgb(255, 255, 255)",this.ctx.moveTo(a[1][0],a[1][1]),this.ctx.lineTo(a[5][0],a[5][1]),this.ctx.lineTo(a[6][0],a[6][1]),this.ctx.lineTo(a[2][0],a[2][1]),this.ctx.lineTo(a[1][0],a[1][1]),this.ctx.stroke()}},{key:"rotate3d",value:function(t,n,i,o,e){i*=Math.PI/180,o*=Math.PI/180,e*=Math.PI/180;var a=math.matrix([[1,0,0,-n[0]],[0,1,0,-n[1]],[0,0,1,-n[2]],[0,0,0,1]]),r=math.matrix([[1,0,0,n[0]],[0,1,0,n[1]],[0,0,1,n[2]],[0,0,0,1]]),h=math.matrix([[1,0,0,0],[0,Math.cos(i),-Math.sin(i),0],[0,Math.sin(i),Math.cos(i),0],[0,0,0,1]]),c=math.matrix([[Math.cos(o),0,-Math.sin(o),0],[0,1,0,0],[Math.sin(o),0,Math.cos(o),0],[0,0,0,1]]),s=math.matrix([[Math.cos(e),-Math.sin(e),0,0],[Math.sin(e),Math.cos(e),0,0],[0,0,1,0],[0,0,0,1]]),u=[],l=!0,m=!1,v=void 0;try{for(var x,g=t._data[Symbol.iterator]();!(l=(x=g.next()).done);l=!0){var f=x.value;f=math.multiply(a,f),f=math.multiply(h,f),f=math.multiply(c,f),f=math.multiply(s,f),f=math.multiply(r,f),u.push(f)}}catch(t){m=!0,v=t}finally{try{!l&&g.return&&g.return()}finally{if(m)throw v}}return math.matrix(u)}},{key:"projectPerspective",value:function(t){var n=this.camera.z,i=math.matrix([[1,0,this.can.width/2],[0,1,this.can.height/2],[0,0,1]]),o=[],e=!0,a=!1,r=void 0;try{for(var h,c=t._data[Symbol.iterator]();!(e=(h=c.next()).done);e=!0){var s=h.value,u=n*(s[0]/s[2]),l=n*(s[1]/s[2]);s=math.matrix([u,l,1]),s=math.multiply(i,s),o.push([s._data[0],s._data[1]])}}catch(t){a=!0,r=t}finally{try{!e&&c.return&&c.return()}finally{if(a)throw r}}return o}},{key:"projectOrthographic",value:function(t){var n=[],i=!0,o=!1,e=void 0;try{for(var a,r=t._data[Symbol.iterator]();!(i=(a=r.next()).done);i=!0){var h=a.value;n.push([h[0],h[1]])}}catch(t){o=!0,e=t}finally{try{!i&&r.return&&r.return()}finally{if(o)throw e}}return n}},{key:"drawSquare",value:function(){var t=this.mouseX-100,n=this.mouseY-100,i=math.matrix([[t,n],[t+200,n],[t+200,n+200],[t,n+200]]);i=this.makeHomogeneous(i),i=this.rotate2d(i,this.rotationX).toArray(),this.ctx.fillStyle="rgb(255, 255, 255)",this.ctx.beginPath(),this.ctx.moveTo(i[0][0],i[0][1]),this.ctx.lineTo(i[1][0],i[1][1]),this.ctx.lineTo(i[2][0],i[2][1]),this.ctx.lineTo(i[3][0],i[3][1]),this.ctx.closePath(),this.ctx.fill()}},{key:"makeHomogeneous",value:function(t){return t.resize([t.size()[0],t.size()[1]+1],1),t}},{key:"rotate2d",value:function(t,n){n*=Math.PI/180;var i=this.getCentroid2d(t).toArray(),o=math.matrix([[Math.cos(n),-Math.sin(n),0],[Math.sin(n),Math.cos(n),0],[0,0,1]]),e=math.matrix([[1,0,-i[0]],[0,1,-i[1]],[0,0,1]]),a=math.matrix([[1,0,i[0]],[0,1,i[1]],[0,0,1]]),r=[],h=!0,c=!1,s=void 0;try{for(var u,l=t._data[Symbol.iterator]();!(h=(u=l.next()).done);h=!0){var m=u.value,v=math.multiply(e,m),x=math.multiply(o,v),g=math.multiply(a,x);r.push(g)}}catch(t){c=!0,s=t}finally{try{!h&&l.return&&l.return()}finally{if(c)throw s}}return math.matrix(r)}},{key:"getCentroid2d",value:function(t){var n=0,i=0,o=!0,e=!1,a=void 0;try{for(var r,h=t._data[Symbol.iterator]();!(o=(r=h.next()).done);o=!0){var c=r.value;n+=c[0],i+=c[1]}}catch(t){e=!0,a=t}finally{try{!o&&h.return&&h.return()}finally{if(e)throw a}}return math.matrix([n/t._data.length,i/t._data.length])}},{key:"getCentroid3d",value:function(t){var n=0,i=0,o=0,e=!0,a=!1,r=void 0;try{for(var h,c=t._data[Symbol.iterator]();!(e=(h=c.next()).done);e=!0){var s=h.value;n+=s[0],i+=s[1],o+=s[2]}}catch(t){a=!0,r=t}finally{try{!e&&c.return&&c.return()}finally{if(a)throw r}}return math.matrix([n/t._data.length,i/t._data.length,o/t._data.length])}}]),t}())},function(t,n,i){t.exports=i(0)}]);
//# sourceMappingURL=Project.js.map