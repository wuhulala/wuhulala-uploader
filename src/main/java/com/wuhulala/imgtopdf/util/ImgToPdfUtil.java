package com.wuhulala.imgtopdf.util;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Image;
import com.itextpdf.text.pdf.PdfWriter;
import org.junit.Test;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.ArrayList;

/**
 * 图片转换为pdf
 *
 * @author xueaohui
 * @date 2016-10-18
 * @description
 */
public class ImgToPdfUtil {

    /**
     * 图片转pdf
     * @param path 图片路径
     * @param pdfFile pdf路径
     */
    public static void createPdf(String path, File pdfFile) {
        File file = new File(path);
        String files[];
        ArrayList<String> pictures = new ArrayList<String>();
        files = file.list();
        for (int i = 0; i < files.length; i++)
            if (files[i].matches(".+\\.(jpeg|jpg|gif|png)"))
                pictures.add(files[i]);
        Document doc = new Document();

        try {
            PdfWriter.getInstance(doc, new FileOutputStream(pdfFile));
            doc.open();
            float width = doc.getPageSize().getWidth() - 75;//取页面宽度并减去页边距
            for (String temp : pictures) {
                System.out.println("文件---" + temp);
                Image tempImage = Image.getInstance(path + File.separator + temp);
                if (tempImage.getWidth() > width) {
                    tempImage.scalePercent(width / tempImage.getWidth() * 100);//用页面显示宽度除以图片宽度算出缩小的合适百分比
                }
                doc.add(tempImage);
            }
            doc.close();
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (DocumentException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (MalformedURLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    @Test
    public void testCreatePdf() {
        long begin = System.currentTimeMillis();
        //createPdf("D:/img");
        System.out.println("总耗时: " + (System.currentTimeMillis() - begin) + " ms");
    }
}
