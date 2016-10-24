package com.wuhulala.imgtopdf.web;

import java.io.*;
import java.util.Collection;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

//使用@WebServlet配置UploadServlet的访问路径
@WebServlet(name = "UploadServlet", urlPatterns = "/upload")
@MultipartConfig//标识Servlet支持文件上传
public class UploadServlet extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        response.setContentType("text/html;charset=utf-8");

        //存储路径
        String savePath = request.getServletContext().getRealPath("/WEB-INF/uploadFile");
        File dictionary = new File(savePath);
        //如果不存在 创建
        if (!dictionary.exists()) {
            dictionary.mkdir();
        }

        //获取上传的文件集合
        Collection<Part> parts = request.getParts();

        long identifer = System.currentTimeMillis();


        //一次性上传多个文件
        for (Part part : parts) {
            //获取请求头，请求头的格式：form-data; name="file"; filename="snmp4j--api.zip"
            String header = part.getHeader("content-disposition");
            //获取文件名
            String fileName = getFileSuffix(header);
            if (!fileName.equals("notFile")) {
                fileName = UUID.randomUUID() + "." + fileName;
                String newFilePath = savePath + File.separator + identifer + File.separator + fileName;
                File newFile = new File(newFilePath);
                isParentExistAndCreate(newFile);
                //把文件写到指定路径
                part.write(newFilePath);
            }
        }
       /* File resultFile = new File(savePath + File.separator + identifer + File.separator + "picture.pdf");
        resultFile.createNewFile();
        //创建pdf
        ImgToPdfUtil.createPdf(savePath + File.separator + identifer, resultFile);
        //获取输入文件流
        InputStream inStream = new FileInputStream(resultFile);
        byte[] buf = new byte[4096];
        //获取输出文件流
        ServletOutputStream servletOS = response.getOutputStream();
        //设置下载文件头
        response.setContentType("text/plain");
        response.setHeader("Location", "picture.pdf");
        response.setHeader("Content-Disposition", "attachment; filename=picture.pdf");
        int readLength;
        //读取输入流到输出流中
        while (((readLength = inStream.read(buf)) != -1)) {
            servletOS.write(buf, 0, readLength);
        }
        inStream.close();
        servletOS.flush();
        servletOS.close();*/

        response.getWriter().write("ok");
    }

    /**
     * 根据请求头解析出文件名
     * 请求头的格式：火狐和google浏览器下：form-data; name="file"; filename="snmp4j--api.zip"
     * IE浏览器下：form-data; name="file"; filename="E:\snmp4j--api.zip"
     *
     * @param header 请求头
     * @return 文件名
     */
    public String getFileSuffix(String header) {

        String[] tempArr1 = header.split(";");
        if(tempArr1.length < 3){
            return "notFile";
        }
        String[] tempArr2 = tempArr1[2].split("=");
        String fileName = tempArr2[1].substring(tempArr2[1].lastIndexOf("\\") + 1).replaceAll("\"", "");
        String[] fileSuffix = fileName.split("\\.");
        return fileSuffix[fileSuffix.length - 1];
    }

    /**
     * 判断文件父目录是否创建并创建文件
     * 1.未创建 创建并创建文件
     * 2.已创建 创建文件
     *
     * @param file 文件
     * @return 创建状态 0失败 1成功
     */
    private boolean isParentExistAndCreate(File file) {
        if (!file.getParentFile().exists()) {
            //如果目标文件所在的目录不存在，则创建父目录
            if (!file.getParentFile().mkdirs()) {
                return false;
            }
        }
        try {
            if (file.createNewFile()) {
                return true;
            } else {
                return false;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}