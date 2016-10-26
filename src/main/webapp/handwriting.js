var canvasWidth = 1152;			//定义canvas宽高
var canvasHeight = 768;

var isMouseDown = false;			//检测按下鼠标动作
var lastLoc = {x: 0, y: 0};		//上一次的坐标

var canvas = document.getElementById("canvas");		//获取canvas对象
var context = canvas.getContext("2d");			//取得图形上下文

canvas.width = canvasWidth;			//定义canvas宽高
canvas.height = canvasHeight;

var image = new Image();		//创建一个image对象
image.crossOrigin = '*';		//图像的cors（跨域资源共享）设置

window.onload = function () {
    image.src = "http://localhost:8080/img.jpg";		//设置图像路径

    image.onload = function () {
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);		//绘制图像
    }
};

drawGrid();



canvas.onmousedown = function (e) {			//鼠标左键按下事件
    e.preventDefault();
    isMouseDown = true;

    lastLoc = windowToCanvas(e.clientX, e.clientY);
};

canvas.onmouseup = function (e) {			//鼠标左键松开事件
    e.preventDefault();
    isMouseDown = false;
};

canvas.onmouseout = function (e) {			//鼠标离开事件
    e.preventDefault();
    isMouseDown = false;
};

canvas.onmousemove = function (e) {			//鼠标移动事件
    e.preventDefault();
    //此方法 可以每一次刷新位置 刷新画图的状态
    //var nowLoc = windowToCanvas(e.clientX, e.clientY);
    //refresh(nowLoc.x,nowLoc.y);
    if (isMouseDown) {
        //绘制涂抹
        var curLoc = windowToCanvas(e.clientX, e.clientY);

        context.beginPath();
        context.moveTo(lastLoc.x, lastLoc.y);		//移动到起始位置
        context.lineTo(curLoc.x, curLoc.y);			//从起始位置创建到当前位置的一条线

        context.strokeStyle = "black";			//设置笔触的颜色
        context.lineWidth = 30;			//只设置这一项，出现类似毛边的情况
        context.lineCap = "round";		//绘制圆形结束线帽
        context.lineJoin = "round";		//当两条线交汇的时候创建边角的类型
        context.stroke();

        lastLoc = curLoc;
    }

};

function windowToCanvas(x, y) {				//计算canvas上面的坐标
    var point = canvas.getBoundingClientRect();			//元素边框距离页面的距离

    x = Math.round(x - point.left);
    y = Math.round(y - point.top);
    console.log(x+"-----"+y);
    return{x:x,y:y};
}


function refresh(x,y) {
    if(x <= 15  || x >= canvasWidth - 15 || y <= 15 || y >= canvasHeight){
        isMouseDown = false;
    }else {
        isMouseDown = true;
    }
}

function curPoint(x,y) {
    if( x <= 15){
        x = 15;
    }
    if( x >= canvasWidth - 15){
        x = canvasWidth - 15
    }
    if( y <= 15){
        y = 15;
    }
    if( y >= canvasWidth - 15){
        y = canvasWidth - 15;
    }

    return{x:x,y:y};
}

function drawGrid() {
    context.save();

    context.strokeStyle = "rgb(230,11,9)";

    context.beginPath();
    context.moveTo(3, 3);
    context.lineTo(canvasWidth - 3, 3);
    context.lineTo(canvasWidth - 3, canvasHeight - 3);
    context.lineTo(3, canvasHeight - 3);
    context.closePath();

    context.stroke();
}


function save() {
    saveImage();
}
function saveImage() {
    // 获取Base64编码后的图像数据，格式是字符串
    // 后面的部分可以通过Base64解码器解码之后直接写入文件。
    var dataurl = canvas.toDataURL("image/png").replace("data:image/png;base64,", "");

    //imagename
    // 1. 准备从url上截取
    // 2. 或者隐藏表单实现
    var data = {
        imagename: "myImage.png",
        imagedata: dataurl
    };
    $.ajax({
        url: "/uploadImageData",
        data: data,
        type: "post",
        dataType: "json",
        success: function (data) {
            alert(data.code);
            if (data.code == 'success') {
                alert(data.message);
            }
        }
    });
};