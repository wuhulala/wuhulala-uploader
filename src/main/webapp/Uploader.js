function Uploader(targetUrl) {
    var o = {};

    o.targetUrl = targetUrl;
    o.showlog = true;
    o.files = [];
    o.predate = 0;
    o.premill = 0;
    o.prebyte = 0;
    o.nowIndex = 0;
    o.all = 0;
    /**
     * 初始化 添加dom 监听按钮事件
     */
    o.init = function () {
        $("#upload").click(function () {
            console.log("click upload");
            o.startUpload();
        });

        //文件域选择文件时, 执行readFile函数
        document.getElementById("file_upload").addEventListener('change', o.readFile, false);
    };


    o.readFile = function () {
        o.files = document.getElementById("file_upload").files;
        o.showFilesInfo();
    };
    /**
     * 显示file的信息
     * @param files
     */
    o.showFilesInfo = function () {
        var output = [];
        for (var i = 0, f; f = o.files[i]; i++) {
            output.push('<li><strong>',
                escape(f.name),
                '</strong> (',
                f.type || 'n/a',
                ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate.toLocaleDateString(),
                '</li>');
        }
        $('#list').html('<ul>' + output.join('') + '</ul>');
    };


    /**
     * 开始上传文件
     */
    o.startUpload = function () {
        o.all = o.files.length;
        o.index = 0;
        o.uploadCurFile();
    };

    /**
     * 上传当前下标指向的文件
     */
    o.uploadCurFile = function () {
        if (o.index == o.all) {
            return;
        }
        $("#progressNumber").css("width", "" + 0 + "px");
        o.showState();
        o.upload(o.files[o.index], {});
    };


    /**
     * 上传文件
     *
     * @param file 文件
     * @param extraData 额外参数
     *                  json {"name":"uploader"}
     */
    o.upload = function (file, extraData) {
        if (!typeof file == File) {
            o.showLog("type not file");
            return;
        }
        var xhr;
        if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE 6 and older
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        //包装一个FormData用于传输
        var fd = new FormData();
        fd.append("fileName", file);
        /*$.each(extraData, function (name, value) {
         fd.append(name, value);
         });*/

        //监听事件
        xhr.upload.addEventListener("progress", o.uploadListener, false);
        xhr.upload.addEventListener("abort", o.abortListener, false);

        //发送文件和表单自定义参数
        xhr.open("POST", o.targetUrl, true);
        var now = new Date();
        o.prebyte = 0;
        o.predate = now.getSeconds();
        o.premill = now.getMilliseconds();

        //监听取消按钮
        $("#abortUpload").click(function () {
            o.abortUpload(xhr);
        });

        xhr.send(fd);
        if (o.showlog == true) {
            o.showLog("upload start");
        }
    };


    /**
     * 上传文件显示进度条
     * @param evt
     */
    o.uploadListener = function (evt) {
        if (evt.lengthComputable) {
            var nowdate = new Date();
            var nowload = evt.loaded;
            var percentComplete = Math.floor(nowload * 100 / evt.total);
            if (nowdate.getSeconds() != o.predate && o.premill <= nowdate.getMilliseconds() && percentComplete != 100) {
                var speed = (nowload - o.prebyte) / 1024;
                o.prebyte = nowload;
                o.predate = nowdate.getSeconds();
                //evt.loaded：文件上传的大小 evt.total：文件总的大小
                //加载进度条，同时显示信息
                $("#percent").html(percentComplete + "%------" + speed + "KB/S");
                $("#progressNumber").css("width", "" + percentComplete + "px");
                if (o.showlog) {
                    o.showLog("文件已上传大小：" + evt.loaded + "------文件总大小：" + evt.total);
                }
            } else if (percentComplete == 100) {
                $("#percent").html(percentComplete + '%');
                $("#progressNumber").css("width", "" + percentComplete + "px");
                if (o.showlog) {
                    o.showLog("upload end");
                }
                o.index = o.index + 1;
                o.uploadCurFile();
            }
        }
    };

    o.abortListener = function (evt) {

    };

    /**
     * 取消上传
     */
    o.abortUpload = function (xhr) {
        xhr.abort();
    };

    /**
     * 显示日志 需设置参数 showlog = true 默认true
     * @param message
     */
    o.showLog = function (message) {
        var date = new Date();
        console.log(date.getMinutes() + ':' + date.getSeconds() + ':' + date.getMilliseconds() + " : " + message);
    };

    /**
     * 显示当前文件
     */
    o.showState = function () {
        var fileinfo = "总共 " + o.all + " 个文件，现在正在上传第" + (o.index + 1) + "个文件";
        $("#info").html(fileinfo);
    };
    return o;
}