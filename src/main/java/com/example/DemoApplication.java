package com.example;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.eventusermodel.XSSFReader;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.openxmlformats.schemas.spreadsheetml.x2006.main.WorkbookDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
@SpringBootApplication
public class DemoApplication {
	@RequestMapping("/")
	@ResponseBody
	public ModelAndView map(){
		ModelAndView mv=new ModelAndView("index");
		return mv;
	}
	@RequestMapping(value="/getAllData")
	public List<News> readExcel(){
		List<News> result=new ArrayList<>();
        Sheet sheet;
		 try {
	            File excelFile = new File("data1.xlsx"); //创建文件对象
	            Workbook wb=new XSSFWorkbook(new FileInputStream(excelFile));
	            sheet =wb.getSheetAt(0);
	            for(Row row:sheet){
	            	if(row.getCell(0)==null||row.getCell(1)==null||row.getCell(2)==null||row.getCell(3)==null||row.getCell(4)==null||row.getCell(5)==null||row.getCell(6)==null)
	            		continue;
	            	SimpleDateFormat sdf=new SimpleDateFormat("yyyy/MM/dd");
	            	row.getCell(6).setCellType(Cell.CELL_TYPE_NUMERIC);
	            	double value = row.getCell(6).getNumericCellValue();  
	                Date date = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(value);  
	            	result.add(new News(row.getCell(0).toString(),row.getCell(1).toString(),row.getCell(2).toString(),row.getCell(3).toString(),row.getCell(4).toString(),row.getCell(5).toString(),sdf.format(date)));
	            }
	        }
	        catch (Exception e) {
	            e.printStackTrace();
	        }
		return result;
	}
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
