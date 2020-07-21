// 函数封装
function drag(selector) {
    this.ele = document.querySelector(selector);
    this.x = true;
    this.y = true;
    this.side = {
        x1: "",
        x2: "",
        y1: "",
        y2: ""

    }
}
drag.prototype = {
    move(callback) {
        var that = this;
        this.ele.onmousedown = function(ev0) {
            var cx = ev0.clientX;
            var cy = ev0.clientY;
            var ox = that.ele.offsetLeft;
            var oy = that.ele.offsetTop;
            var downx = cx - ox;
            var downy = cy - oy;
            document.onmousemove = function(ev1) {
                moveX = ev1.clientX;
                moveY = ev1.clientY;
                var x = moveX - downx;
                var y = moveY - downy;
                if (that.side.x1 !== "") {
                    if (x < that.side.x1) {
                        x = that.side.x1;
                    }
                }
                if (that.side.x2 !== "") {
                    if (x > that.side.x2) {
                        x = that.side.x2;
                    }
                }
                if (that.side.y1 !== "") {
                    if (y < that.side.y1) {
                        y = that.side.y1;
                    }
                }
                if (that.side.y2 !== "") {
                    if (y > that.side.y2) {
                        y = that.side.y2;
                    }
                }
                if (that.x) {
                    that.ele.style.left = x + "px";
                }
                if (that.y) {
                    that.ele.style.top = y + "px"
                }

                ev1.preventDefault();
            }
            document.onmouseup = function() {
                document.onmousemove = null;
                if (callback) {
                    callback.call(that.ele);
                }

            }
        }
    }

}
/*事件的构成：
1.事件源
2.事件（动作）
3.事件处理程序
4.事件对象 ev
***********************************************
如何添加一个事件
1.直接量
var div = document.querySelector("div");
div.onclick = function(ev) {
    alert(1);
}

2.

***********************************************
鼠标事件的事件对象
var div = document.querySelector("div");
div.onclick = function(ev) {
    //div.onmousemove = function(ev) {

    console.log(ev.screenX); //鼠标相对于屏幕的距离
    console.log(ev.screenY);
    console.log(ev.clientX); //鼠标相对于浏览器的距离
    console.log(ev.clientY);
    console.log(ev.offsetX); //相对于事件源的距离
    console.log(ev.offsetY);
    console.log(ev.target); //事件源
}
***********************************************
拖拽    按下->移动->抬起
浏览器默认按下抬起在选中文字（解决）

var div = document.querySelector("div");
div.onmousedown = function(ev0) {
    var startX = ev0.offsetX;
    var startY = ev0.offsetY;
    document.onmousemove = function(ev1) {
        moveX = ev1.clientX;
        moveY = ev1.clientY;
        div.style.left = moveX - startX + "px";
        div.style.top = moveY - startY + "px"
        ev1.preventDefault();
    }
    document.onmouseup = function() {
        document.onmousemove = null;
        //div.onmousup = null;

    }
}
***********************************************
拖拽子元素
var div = document.querySelector(".two");
div.onmousedown = function(ev0) {
    var cx = ev0.clientX;
    var cy = ev0.clientY;
    var ox = div.offsetLeft;
    var oy = div.offsetTop;
    var downx = cx - ox;
    var downy = cy - oy;

    document.onmousemove = function(ev1) {
        moveX = ev1.clientX;
        moveY = ev1.clientY;
        div.style.left = moveX - downx + "px";
        div.style.top = moveY - downy + "px"
        ev1.preventDefault();
    }
    document.onmouseup = function() {
        document.onmousemove = null;
        //div.onmousup = null;

    }
}*/