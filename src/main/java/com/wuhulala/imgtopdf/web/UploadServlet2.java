package com.wuhulala.imgtopdf.web;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.util.Collection;
import java.util.UUID;

//使用@WebServlet配置UploadServlet的访问路径
@WebServlet(name = "UploadServlet2", urlPatterns = "/uploadImageData")
@MultipartConfig//标识Servlet支持文件上传
public class UploadServlet2 extends HttpServlet {

    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String imageData = request.getParameter("imagedata");
        String imageName = request.getParameter("imagename");
        byte[] imageBytes = new BASE64Decoder().decodeBuffer(imageData);
        String filePath = "D:" + File.separator + imageName;
        File file = new File(filePath);
        if(!file.exists()){
            file.createNewFile();
        }
        OutputStream os = new FileOutputStream(file);
        BufferedOutputStream bos = new BufferedOutputStream(os);

        bos.write(imageBytes);
        bos.close();
        os.close();
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"code\":\"success\",\"message\":\"上传成功\",\"path\":\"server path\"}");
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