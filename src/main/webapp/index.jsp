<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<html>
<head>
    <meta charset="utf-8">
    <title>进度条测试</title>
    <script src="//cdn.bootcss.com/jquery/3.1.1/jquery.min.js"></script>
    <script src="Uploader.js"></script>
</head>
<body>

<input type="file" id="file_upload" class="file-upload" multiple/>

<input type="button" value="上传" id="upload"/>
<input type="button" value="取消" id="abort"/>

<div style="background:#848484;width:100px;height:10px;margin-top:5px">
    <div id="progressNumber" style="background:#428bca;width:0;height:10px">

    </div>
</div>
<font id="percent">0%</font>
<output id="info"></output>

<output id="list"></output>

</body>
<script>

    $(function () {
        var uploader = new Uploader("/upload");
        console.log(uploader.predate);
        uploader.init();
    });






</script>
</html>
