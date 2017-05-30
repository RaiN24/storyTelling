package com.example;

import static org.assertj.core.api.Assertions.setMaxElementsForPrinting;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.stream.Stream;

import com.google.gson.*;

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
import org.apache.xmlbeans.impl.jam.mutable.MPackage;
import org.apache.xmlbeans.impl.xb.xsdschema.impl.PublicImpl;
import org.json.JSONObject;
import org.mockito.BDDMockito.BDDStubber;
import org.openxmlformats.schemas.spreadsheetml.x2006.main.WorkbookDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.example.dao.MessageDao;
import com.example.dao.TextDao;
import com.example.domain.Message;
import com.example.domain.MyDate;
import com.example.domain.News;
import com.example.domain.Text;
import com.example.domain.User;
import com.example.service.UserService;
import com.fasterxml.jackson.core.JsonParser;

@RestController
@SpringBootApplication
public class DemoApplication {
	SimpleDateFormat sdf=new SimpleDateFormat("yyyy/MM/dd");
	static MyDate early;
	static MyDate late;
	@Autowired
	private UserService userService;
	@Autowired
	private MessageDao messageDao;
	@Autowired
	private TextDao textDao;
	@RequestMapping("/")
	public ModelAndView map(){
		ModelAndView mv=new ModelAndView("index");
		return mv;
	}
	@RequestMapping("/search")
	public ModelAndView search(){
		ModelAndView mv=new ModelAndView("search_div");
		return mv;
	}
	@RequestMapping("/china")
	public void china() throws FileNotFoundException{
		File root = new File("C:/Users/rain/Desktop/data"); //创建文件对象
		File files[]=root.listFiles();
		Map<String, String> map=new HashMap<>();
		for(File file:files){
			Scanner x=new Scanner(file);
			x.nextLine();
			while(x.hasNextLine()){
				String m=x.nextLine();
				m+=x.nextLine();
				int first=m.indexOf("\"");
				int last=m.lastIndexOf("\"");
				if(first<=0||first>=last){
					System.out.println(m);
					continue;
				}
				String md5=m.substring(0, first-1);
				String content=m.substring(first+1,last);
				String left=m.substring(last+2);
				String s[]=left.split(",");
				messageDao.insertMessage(new Message(md5, s[0], new Timestamp(Long.parseLong(s[1])), new Timestamp(Long.parseLong(s[2])), Double.parseDouble(s[3]), Double.parseDouble(s[4])));
				if(!map.containsKey(md5)){
					map.put(md5, content);
					Text text=new Text();
					text.setMd5(md5);
					text.setContent(content);
					textDao.insertText(text);
				}
			}
			System.out.println(map.size());
		}
	}
	@RequestMapping("/csv_data")
	public List<Map<MyDate, Double>> getCSV() throws FileNotFoundException{
		List<Map<MyDate, Double>> result=new ArrayList<>();
		Map<MyDate, Double> mapT=new HashMap<>();
		Map<MyDate, Double> mapX=new HashMap<>();
		File csvFile = new File("src/main/webapp/data/data2.csv"); //创建文件对象
		Scanner x=new Scanner(csvFile);
		x.nextLine();
		while(x.hasNextLine()){
			String xi=x.nextLine();
			String te=x.nextLine();
			String xx[]=xi.split(",");
			String tt[]=te.split(",");
			MyDate date=new MyDate(xx[6].substring(1, xx[6].length()-1));
			mapX.put(date,Double.parseDouble(xx[3]));
			mapT.put(date,Double.parseDouble(tt[3])); 
		}
		result.add(mapX);
		result.add(mapT);
		return result;
	}
	@RequestMapping("/json_wordle")
	public List<Map<String, Double>> getWordle() throws FileNotFoundException{
		com.google.gson.JsonParser parser=new com.google.gson.JsonParser();
		JsonObject json=(JsonObject) parser.parse(new FileReader("src/main/webapp/json_by_news.txt"));
//		System.out.println(json.get("n1007"));
		List<Map<String, Double>> result=new ArrayList();
		Map<String, Double> resultX=new HashMap<>();
		Map<String, Double> resultT=new HashMap<>();
		Map<String, Integer> countWord=new HashMap<>();
		List<Map<MyDate, Double>> list=getCSV();
		Map<MyDate, Double> mapX=list.get(0);
		Map<MyDate, Double> mapT=list.get(1);
		Sheet sheet=readRows();
		int count=0;
		double sum=0;
		for (int i = 0; i <= sheet.getLastRowNum(); i++) {
			Row row=sheet.getRow(i);
			if(row.getCell(0)==null||row.getCell(1)==null||row.getCell(2)==null||row.getCell(3)==null||row.getCell(4)==null||row.getCell(5)==null||row.getCell(6)==null)
        		continue;
			row.getCell(6).setCellType(Cell.CELL_TYPE_NUMERIC);
	    	double value = row.getCell(6).getNumericCellValue();  
	        Date date =org.apache.poi.ss.usermodel.DateUtil.getJavaDate(value);
	        MyDate myDate=new MyDate();//当前时间
	        myDate.setYear(date.getYear());
	        myDate.setMonth(date.getMonth());
	        myDate.setDate(date.getDate());
	        MyDate weekLater=new MyDate();//一周后时间
	        weekLater.setYear(myDate.getYear());
	        weekLater.setMonth(myDate.getMonth());
	        weekLater.setDate(myDate.getDate()+7);
	        if(myDate.before(early)||myDate.after(late))
	        	continue;
	        JsonObject obj=json.get("n"+(i-1)).getAsJsonObject();
	        for(Entry<String, JsonElement> map:obj.entrySet()){
	        	if(map==null)
	        		continue;
	        	String key=map.getKey();
	        	if(key.length()<=0)
	        		continue;
	        	int weight=map.getValue().getAsInt();
	        	double beforeX=mapX.get(myDate);
	        	double afterX=mapX.get(weekLater);
	        	double beforeT=mapT.get(myDate);
	        	double afterT=mapT.get(weekLater);
	        	if(countWord.containsKey(key)){
	        		countWord.put(key, countWord.get(key)+1);
	        		resultX.put(key, resultX.get(key)+weight*(afterX-beforeX));
	        		resultT.put(key, resultT.get(key)+weight*(afterT-beforeT));
	        	}else{
	        		countWord.put(key, 1);
	        		resultX.put(key, weight*(afterX-beforeX));
	        		resultT.put(key, weight*(afterT-beforeT));
	        	}
	        }
		}
		Map<String, Double> argResultX=new HashMap();
		Map<String, Double> argResultT=new HashMap();
		for(Map.Entry<String, Double> map:resultX.entrySet()){
			String key=map.getKey();
			argResultX.put(key, map.getValue()/countWord.get(key));
		}
		for(Map.Entry<String, Double> map:resultT.entrySet()){
			String key=map.getKey();
			argResultT.put(key, map.getValue()/countWord.get(key));
		}
		Map<String, Double> sortedResultX= new LinkedHashMap<>();
        Stream<Entry<String, Double>> sx = argResultX.entrySet().stream();
        sx.sorted(Comparator.comparing(e -> e.getValue())).forEach(e -> sortedResultX.put(e.getKey(), e.getValue()));
        Map<String, Double> sortedResultT= new LinkedHashMap<>();
        Stream<Entry<String, Double>> st = argResultT.entrySet().stream();
        st.sorted(Comparator.comparing(e -> e.getValue())).forEach(e -> sortedResultT.put(e.getKey(), e.getValue()));
        result.add(sortedResultX);
        result.add(sortedResultT);
//        System.out.println(sortedResultX);
//        System.out.println(sortedResultT);
		return result;
	}
	@RequestMapping(value="/getRows")
	public Sheet readRows(){
        Sheet sheet = null;
		 try {
	            File excelFile = new File("data1.xlsx"); //创建文件对象
	            Workbook wb=new XSSFWorkbook(new FileInputStream(excelFile));
	            sheet =wb.getSheetAt(0);
	        }
	        catch (Exception e) {
	            e.printStackTrace();
	        }
		return sheet;
	}
	@RequestMapping(value="/getAllData")
	public Map<Integer,News> readExcel(){
		Map<Integer,News> result=new HashMap<>();
        Sheet sheet;
		 try {
	            File excelFile = new File("data1.xlsx"); //创建文件对象
	            Workbook wb=new XSSFWorkbook(new FileInputStream(excelFile));
	            sheet =wb.getSheetAt(0);
	            int index=-1;
	            for(Row row:sheet){
	            	index++;
	            	if(row.getCell(0)==null||row.getCell(1)==null||row.getCell(2)==null||row.getCell(3)==null||row.getCell(4)==null||row.getCell(5)==null||row.getCell(6)==null)
	            		continue;
	            	row.getCell(6).setCellType(Cell.CELL_TYPE_NUMERIC);
	            	double value = row.getCell(6).getNumericCellValue();  
	                Date date = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(value);  
//	                System.out.println(date.getDate());
//	                date.setDate(date.getDate()+7);
//	                System.out.println(date.getDate());
	            	result.put(index, new News(row.getCell(0).toString(),row.getCell(1).toString(),row.getCell(2).toString(),row.getCell(3).toString(),row.getCell(4).toString(),row.getCell(5).toString(),sdf.format(date)));
	            }
	        }
	        catch (Exception e) {
	            e.printStackTrace();
	        }
		return result;
	}
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
		early=new MyDate();
		early.setYear(115);
		early.setMonth(6);
		early.setDate(1);
		late=new MyDate();
		late.setYear(116);
		late.setMonth(10);
		late.setDate(1);
	}
}
