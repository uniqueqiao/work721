var getSpeed = {
    1: {
        speed: 50
    },
    2: {
        speed: 30
    },
    3: {
        speed: 20
    },
    4: {
        speed: 10
    },
    5: {
        speed: 5
    }
};

// 2. 随机生成字母
function getRandom() {
    // 随机生成一个字母( a-z )的ASCII码
    var charCode = 97 + Math.floor(Math.random() * 26);
    // 将该ASCII码转化为字母
    return String.fromCharCode(charCode);
}

// 获取键盘上按键的值并消除
function game(level, score) {
    var gameBox = document.getElementById("gameBox");
    var letterArr = [],     // 字母对象列表
        spanArr = [];       // span对象列表
    var hit = 0;            // 击中个数

    var start = function () {
        // 使用random可以使每次下落的字母数随机
        if (Math.random() > (0.8 - level * 0.01)) {
            var letterIn = getRandom();
            letterArr.push(letterIn);
            spanArr.push(createSpan(letterIn));
            window.addEventListener("keyup", keyup);
        }
    };
    // 绑定键盘事件
    var keyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        var keyCode = String.fromCharCode(e.keyCode);
        for (var i = 0; i < letterArr.length; i++) {
            if (keyCode.toLowerCase() === letterArr[i]) {
                clearInterval(spanArr[i].intervalID); // 这是一句不写就后患无穷的代码，不信你可以试试
                spanArr[i].parentNode.removeChild(spanArr[i]);
                letterArr.splice(i, 1);
                spanArr.splice(i, 1);
                hit++;
                document.getElementById("score").innerHTML = hit;
                if (hit >= Number(score) && getSpeed[level + 1] === undefined) {
                    alert("恭喜你，所有关卡挑战成功！");
                    location.reload();
                    return;
                } else if (hit >= Number(score)) {
                    clear();
                    alert("恭喜你，进入下一关卡！\n下一关卡需要得分：" + ( score + 10 ));
                    document.getElementById("score").innerHTML = 0;
                    game(level + 1, score + 10);
                }
                break;
            }
        }
    };
    // 3. 根据随机生成的字母生成标签，插入到gameBox中并显示
    var createSpan = function (letter) {
        var span = document.createElement("span");
        var spanCon = document.createTextNode(letter);
        var loc = document.getElementById("gameBox");
        var width = parseInt(loc.style.width);
        span.appendChild(spanCon);
        span.setAttribute("style",
            "position:absolute;" +
            "top:" + parseInt(loc.offsetTop) + "px;" +
            "left:" + Math.random() * width + "px;" +
            "display:inline-block;" +
            "height:20px;width:20px;" +
            "line-height:15px;" +
            "text-align:center;" +
            "background-color:#888;" +
            "border-radius:15px;" +
            "box-shadow:0 0 2px 5px rgba(255,255,255,0.5);" +
            "opacity:0.8");
        loc.appendChild(span);
        spanMove(span);
        return span;
    };

    // 4. 获取标签位置始末并下落
    var spanMove = function (span) {
        // 页面高度
        var height = parseInt(document.getElementById("gameBox").style.height);
        var top = parseInt(span.style.top);

        span.intervalID = window.setInterval(function () {
            if (span.parentNode) {
                top = top + 1;
                if (top <= height - 40) {
                    span.style.top = top + "px";
                } else {
                    span.style.boxShadow = "0px 0px 2px 5px red";
                    console.log(span.intervalID);
                    clearInterval(span.intervalID);
                    alert("很遗憾，挑战失败，游戏结束！");
                    location.reload();
                }
            }
        }, getSpeed[level].speed);

    };

    var clear = function () {
        clearInterval(game.timer);
        window.removeEventListener("keyup", keyup);
        for (var n = spanArr.length - 1; n >= 0; n--) {
            console.log(spanArr[n] === null);
            if (spanArr[n] !== null) {
                spanArr[n].parentNode.removeChild(spanArr[n]);
                clearInterval(spanArr[n]);
                spanArr[n] = null;
            }
        }
        letterArr = [];
    };

    game.timer = setInterval(start, 200);
}

// 游戏开始
document.getElementById("start").addEventListener("click", function () {

    var start = document.getElementById("start");
    start.disabled = true;
    start.style.cursor = "not-allowed";
    document.getElementById("tools").style.display = "none";
    document.getElementById("panel").style.display = "inline-block";
    game(1, 10);
});
// 游戏结束
document.getElementById("stop").addEventListener("click", function () {
    location.reload();
    document.getElementById("start").disabled = false;
    document.getElementById("tools").style.display = "block";
    document.getElementById("panel").style.display = "none";
});