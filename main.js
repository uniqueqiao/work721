/**
 * main.js
 */
// 1. letter对象，使用构造函数模式创建对象
/**
 * @param id:    时间戳作为每个标签的唯一标识
 * @param value: 存储随机生成的字母值
 * @param x_pos: 标签的left初始值
 * @param y_pos: 标签的top初始值
 */
function Letters(id, value, x_pos, y_pos) {
    this.id = id || '';
    this.value = String.fromCharCode(value) || 'A';
    this.x_pos = x_pos || 0;
    this.y_pos = y_pos || 0;
    this.speed = Math.random() * 3 + 1;
    this.domObj = null;

    this.createSpan = function () {
        var span = document.createElement("span");
        var alpha = document.createTextNode(this.value);
        span.appendChild(alpha);
        span.setAttribute("id", this.id);
        span.setAttribute("style",
            "position:absolute;" +
            "top: 20px;" +
            "left: 0px;" +
            "display:inline-block;" +
            "height:40px;width:40px;" +
            "line-height:30px;" +
            "text-align:center;" +
            "font-size:30px;"+
            "background-color:BLUE;" +
            "border-radius:20px;" +
            "box-shadow:0 0 2px 5px rgba(255,255,255,0.5);" +
            "opacity:0.8");
        this.domObj = span;
    };

    // 将标签创建之后赋值给this.domObj，调用此函数时，将this.domObj添加到相应父元素中去
    this.attachStage = function (stage) {
        stage.appendChild(this.domObj);
    };

    this.moveTo = function (x_pos, y_pos) {
        this.domObj.style.left = x_pos + "px";
        this.domObj.style.top = y_pos + "px";
    };

    this.remove = function () {
        var span = document.getElementById(this.id);
        if (span.parentNode !== null) {
            span.parentNode.removeChild(span);
        } else {
            console.log("No parent Node! " + span.id);
        }
    };

    this.failed = function () {
        var span = document.getElementById(this.id);
        span.style.boxShadow = "0px 0px 2px 5px red";
    };
}


// 2. Monitor对象
function Monitor(level, score) {
    // 存储当前屏幕上的所有元素
    var nodes = [];
    // 存储最终得分
    var final = new Score();

    // 逐帧运行
    this.runFrame = function () {
        if (Math.random() > 0.8) {
            this.createAlpha();
        }
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].y_pos = parseInt(nodes[i].y_pos) + nodes[i].speed;
            nodes[i].y_pos += "px";
            document.getElementById(nodes[i].id).style.top = nodes[i].y_pos;
            if (parseInt(nodes[i].y_pos) > 560) {
                nodes[i].failed();
                alert("很遗憾，挑战失败，游戏结束！");
                location.reload();
            }
            if (level === 5 && final.getCount() >= score) {
                alert("恭喜你，完成所有关卡，闯关成功！");
                location.reload();
                console.log("getCount = " + final.getCount() + " score = " + score + final.getCount() >= score);
            } else if (final.getCount() >= score) {
                alert("恭喜你，进入下一关卡\n下一关卡需要得分：" + (score + 10));
                final.clearScore();
                document.getElementById("score").innerHTML = String(0);
                this.clear();
                level++;
                score += 10;
                this.Monitor(level, score);
            }
        }
    };

    // 生成字母表标签
    this.createAlpha = function () {
        // 随机生成字母（A - Z）
        var code = 65 + Math.floor(Math.random() * 26);
        var letter = new Letters(new Date().getTime(), code);
        // 将定义的节点添加到盒子中
        letter.createSpan();
        letter.attachStage(document.getElementById("gameBox"));
        var x = Math.ceil(Math.random() * parseInt(document.getElementById("gameBox").style.width));
        var y = 0;
        letter.moveTo(x, y);
        nodes.push(letter);
        return letter;
    };

    // 绑定键盘事件
    this.keydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        var keyCode = String.fromCharCode(e.keyCode);
        for (var i = 0; i < nodes.length; i++) {
            if (keyCode === nodes[i].value) {
                nodes[i].remove();
                nodes.splice(i, 1);
                final.incScore();
                document.getElementById("score").innerHTML = final.getCount();
                break;
            }
        }
        // 跳出循环后，i = monitor.node.length || i = 当前value在node中的下标
        // 若i = monitor.node.length， 则表明未找到键盘按下的字母
        // i !== 0排除数组只有一个元素且被消除的情况
        if (i === nodes.length && i !== 0) {
            final.decScore();
            document.getElementById("score").innerHTML = final.getCount();
            if (final.getCount() === 0) {
                alert("很遗憾，您的分数太低了，挑战失败！");
                location.reload();
            }
        }
    };

    // 清除游戏界面上的多余标签
    this.clear = function () {
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].remove();
        }
        nodes.splice(0, nodes.length);
        clearInterval(this.Monitor.timer);
    };

    this.refreshFrame = {
        1: {
            time: 150
        },
        2: {
            time: 100
        },
        3: {
            time: 80
        },
        4: {
            time: 50
        },
        5: {
            time: 30
        }
    };
    window.addEventListener("keydown", this.keydown);
    this.Monitor.timer = setInterval(this.runFrame, this.refreshFrame[level].time);
}

// 3. 计分对象
function Score() {
    var count = 0;
    this.incScore = function () {
        count++;
    };
    this.decScore = function () {
        count --;
    };
    this.getCount = function () {
        return count;
    };
    this.clearScore = function () {
        count = 0;
    }
}

// 游戏开始
document.getElementById("start").addEventListener("click", function () {
    var start = document.getElementById("start");
    start.disabled = true;
    start.style.cursor = "not-allowed";
    document.getElementById("tools").style.display = "none";
    document.getElementById("panel").style.display = "inline-block";
    Monitor(1, 10);
});

// 游戏结束
document.getElementById("stop").addEventListener("click", function () {
    location.reload();
    document.getElementById("start").disabled = false;
    document.getElementById("tools").style.display = "block";
    document.getElementById("panel").style.display = "none";
});