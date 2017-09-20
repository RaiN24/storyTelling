

var autoplaytimer;



{
var upperLineId="upper_line";
var upper_width=$("#"+upperLineId).css("width");
upper_width=parseFloat(upper_width.split("p")[0]);
var upper_height=$("#"+upperLineId).css("height");
upper_height=parseFloat(upper_height.split("p")[0]);
var upper_margin={"top":8,"left":5,"right":5,"bottom":20};
var focus_width=(upper_width-upper_margin.left-upper_margin.right)*0.9;
var focus_height=upper_height-upper_margin.top-upper_margin.bottom;

var upper_svg=d3.select("#"+upperLineId).append("svg")
			.attr("width", upper_width)
			.attr("height", upper_height);
var focusline = upper_svg.append("g")
			.attr("transform", "translate(" + upper_margin.left + "," + upper_margin.top + ")")
			.attr("width", focus_width)
			.attr("height", focus_height);
var focus_area;var focus_area_stroke;
var focus_xAxis;var focus_yAxis;
var focus_timerect;	
}
{
var lowerLineId="lower_line";
var lower_width=$("#"+lowerLineId).css("width");
lower_width=parseFloat(lower_width.split("p")[0]);
var lower_height=$("#"+lowerLineId).css("height");
lower_height=parseFloat(lower_height.split("p")[0]);
var lower_margin={"top":5,"left":0,"right":5,"bottom":20};
var context_width=lower_width*0.9;//-lower_margin.left-lower_margin.right
var context_height=lower_height*0.85;//-lower_margin.top-lower_margin.bottom;





//console.log(context_height);

var lower_svg=d3.select("#"+lowerLineId).append("svg")
			.attr("width", lower_width)
			.attr("height", lower_height);





var context = lower_svg.append("g")
			.attr("transform", "translate(" + lower_margin.left + "," + lower_margin.top + ")")
			//.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.attr("width", context_width)
			.attr("height", context_height);
var context_area;
var context_xAxis;var context_yAxis;
var context_brushhandle;
	
}
{
	var focus_x = d3.scaleTime().range([0, focus_width]),
	context_x = d3.scaleTime().range([0, context_width]),
	focus_y = d3.scaleLinear().range([focus_height, 0]),
	context_y = d3.scaleLinear().range([context_height, 0]);
						
var lowerformat = d3.timeFormat("%Y/%m/%e");

//var lowerformat = d3.timeFormat("%Y/%m/%e);
var upperormat = d3.timeFormat("%Y:%m:%e");
var lowerparseTime = d3.timeParse("%Y/%m/%e");	
}
{
var lower_timeminsplite=1;//lower timeline axis tick, default:60
var upper_timeminsplite=0.5;//upper timeline axis tick, default:30
var lower_timeminspan=24*60;//global time range, default:24*60
var upper_timemin_gran=0.5;//upper time granulariy, default:15

var lowertimerange=[];//lower time range
var lowertimebrushed=[];//upper time range
var uppertimewindow=[];//uper time window

var lower_data = new Array();	
var lower_data1 = new Array();
}


d3.csv("data/data2.csv", function(error, csvdata) {
	var month = ['Jan',,'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	for(var i=0;i<csvdata.length;i+=2){                
		var s = new Object;
		var s1 = new Object;
		var date = csvdata[i]["date"];
		var tmp1 = date.split(" ");
		var tmp2 = tmp1[3];
		var tmp3 = tmp1[2];
		var tmp4 = tmp1[1];
		var tmp6 = [];
		for(j=0;j<12;j++)
			if(month[j]==tmp3)
				break;
		var tmp7 = tmp2+'/'+j+'/'+tmp4;
		
		//tmp6.push(tmp7);
		//tmp6.push(csvdata[i]["value"]);
		s[tmp7] = parseInt(csvdata[i]["value"]);
		s1[tmp7] = parseInt(csvdata[i+1]["value"]);
		lower_data.push(s);
		lower_data1.push(s1);
	}
	
	//console.log("*");
	//console.log(lower_width);
		
	drawLowerTimeLine(lower_data,"#E87E51");
	drawLowerTimeLine(lower_data1,"#D9B3E6");

	drawUpperTimeLine(lower_data,lower_data1,["#E87E51","#D9B3E6"]);
	
	
});


	



function drawLowerTimeLine(datap,thisColor){	
	context_x.domain(d3.extent(datap.map(function(d) {return lowerparseTime(d3.keys(d)[0]);})));
	
	//console.log(datap);
	
	//context_x.domain([0,labels2.length]);
	context_y.domain([0, d3.max(datap.map(function(d) {return d3.values(d)[0];}))]);
	//context_y.domain([0, 100]);
	
	context_area = d3.area().curve(d3.curveBasis)
				.x(function(d) {return context_x(lowerparseTime(d3.keys(d)[0]));})
				.y0(context_height*0.8)
				.y1(function(d) {return context_y(d3.values(d)[0]);});
	context_xAxis = d3.axisBottom(context_x).tickSize(-context_height);
						//.ticks(d3.timeMinute.every(lower_timeminsplite));
	context_yAxis = d3.axisLeft(context_y).ticks(5);
	
	lowertimerange=context_x.domain();

	
	
	context.append("g").append("path")
		.attr("class", "timeline_path")
		.datum(datap)
		.attr("d", context_area)
		.attr("fill",thisColor)
		.attr("opacity",0.44)
		.on("mouseover",function(){
		//console.log("*");
			context.selectAll("g").remove();	
			drawLowerTimeLine(datap,thisColor);
		})
		.on("mouseout",function(){
			drawLowerTimeLine(lower_data,"#F17C67");
			drawLowerTimeLine(lower_data1,"#8192D6");	
		});
	var xaxis=context.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (context_height*0.8) + ")")
		.call(context_xAxis);
	
	
	xaxis.selectAll(".tick text").attr("transform", "translate(0," + 5 + ")");
	context.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (context_height*0.8) + ")")
		.call(context_yAxis);
	//context.selectAll("g").remove();	
	
	var brush = d3.brushX()
		.extent([[0, 0], [context_width, context_height*0.8]])
		//.on("end", brushend)
		.on("brush", function(){
				
				//rangeChanged(select_x,select_x1);
				//console.log("*");
				brushed();
			
		});		
	var gbrush=context.append("g")
		.attr("class", "brush")
		.call(brush);
	$("#"+lowerLineId+" .overlay").css("height",context_height).css("width",context_width);
	$("#"+lowerLineId+" .selection").css("height",context_height);
	context_brushhandle = gbrush.selectAll(".handle--lower")
		.data([{type: "w"}, {type: "e"}])
		.enter().append("path")
		.attr("class", "handle--lower")
		.attr("cursor", "ew-resize")
		.attr("d", resizePath);
	context_brushhandle.attr("display", "none");

	function resizePath(d) {
		//console.log(d);
		var e = +(d.type == "e"),
			x = e ? 1 : -1,
			y = context_height / 5;
		return "M" + (.5 * x) + "," + y
        	+ "A1.5,1.5 0 0 " + e + " " + (4.5 * x) + "," + (y + 1.5)
        	+ "V" + (2 * y - 1.5)
        	+ "A1.5,1.5 0 0 " + e + " " + (.5 * x) + "," + (2 * y);
	}

}

function brushend(){
	focusToStart();
}	
function brushed(){
	var s = d3.event.selection;
	var select_x = s[0],
		select_x1 = s[1];
	
	s_date = parseInt(select_x / ($(window).width()*0.9) * 527);
	e_date = parseInt(select_x1 / ($(window).width()*0.9) * 527);
	
	//console.log([s_date,e_date]);
	
	dx = select_x1 - select_x;
	//console.log(s);
	if(dx) {
		lowertimebrushed=[context_x.invert(select_x), context_x.invert(select_x1)];
		context_brushhandle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + (context_height-context_height / 5-lower_margin.bottom) / 2 + ")"; });
		//timedata = [context_x.invert(select_x), context_x.invert(select_x1)];
		focus_x.domain([context_x.invert(select_x), context_x.invert(select_x1)]);
		lowertimebrushed=focus_x.domain();
		focusline.select(".timeline_path").attr("d", function(){/*console.log("*");*/return focus_area;});
		focusline.select(".timeline_path_stroke").attr("d", focus_area_stroke);
		focusline.select(".axis").call(focus_xAxis);
		focusline.selectAll(".axis .tick text").attr("transform", "translate(0," + 5 + ")");
		
		//rangeChanged(0,300);
		rangeChanged(1,select_x,select_x1);
		drawReason();
		var legend = document.querySelector('.legend');
        Ps.initialize(legend);
		
	} else {
		lowertimebrushed=context_x.domain();
		context_brushhandle.attr("display", "none");
		
		focus_x.domain(context_x.domain());
		lowertimebrushed=focus_x.domain();
		focusline.select(".timeline_path").attr("d", focus_area);
		focusline.select(".timeline_path_stroke").attr("d", focus_area_stroke);
		focusline.select(".axis").call(focus_xAxis);
		focusline.selectAll(".axis .tick text").attr("transform", "translate(0," + 5 + ")");
		
		//rangeChanged(select_x1,select_x);
		
	}
	//document.getElementById("timeline_play").innerHTML='<i class="fa fa-play"></i>&nbsp;&nbsp;开始动画'
	autoplaytimer=window.clearInterval(autoplaytimer);
}				
			
function drawUpperTimeLine(datap,datap1,thisColor){
	
	focusline.selectAll("g").remove();	
	
	focus_x.domain(context_x.domain());
	focus_y.domain(context_y.domain());
	focus_xAxis = d3.axisBottom(focus_x).tickSize(-focus_height)
				.ticks(d3.timeMinute.every(upper_timeminsplite));
	focus_yAxis = d3.axisLeft(focus_y).ticks(5);
	focus_area = d3.area().curve(d3.curveBasis)
				.x(function(d) {return focus_x(lowerparseTime(d3.keys(d)[0]));})
				.y0(focus_height)
				.y1(function(d) {return focus_y(d3.values(d)[0]);});
	focus_area_stroke=d3.line().curve(d3.curveBasis)
				.x(focus_area.x()).y(focus_area.y1());
	lowertimebrushed=focus_x.domain();
	//path
	var patharea=focusline.append("g");
	patharea.append("defs").append("clipPath")
			.attr("id", "tl_clip").append("rect")
			.attr("width", focus_width)
			.attr("height", focus_height);
	patharea.append("path")
		.attr("class", "timeline_path")
		.datum(datap)
		.attr("clip-path", "url(#tl_clip)")
		.attr("d", focus_area)
		.attr("fill",thisColor[0])
		.attr("opacity",0.44);
	
	patharea.append("path")
		.attr("class", "timeline_path")
		.datum(datap1)
		.attr("clip-path", "url(#tl_clip)")
		.attr("d", focus_area)
		.attr("fill",thisColor[1])
		.attr("opacity",0.44);
	
	/*patharea.append("path")
		.attr("class", "timeline_path_stroke")
		.datum(datap)
		.attr("clip-path", "url(#tl_clip)")
		.attr("d", focus_area_stroke);*/
		
	//axis
	var axisarea=focusline.append("g");
	var xaxis=axisarea.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (focus_height) + ")")
		.call(focus_xAxis); 
	xaxis.selectAll(".tick text").attr("transform", "translate(0," + 5 + ")");
	axisarea.append("g")
		.attr("class", "axis")
		.call(focus_yAxis);
	//focus window
	focus_timerect=focusline.append("g");
	//mouseover
	var mouseoverarea=focusline.append("g");
	var linearGradient = mouseoverarea.append("defs").append("linearGradient")  
							.attr("id","focusline_linearColor")  
							.attr("x1","0%").attr("y1","0%")  
							.attr("x2","0%").attr("y2","100%"); 	  
	linearGradient.append("stop").attr("offset","0%")  
					.style("stop-color","rgba(230,230,31,0)");  
	linearGradient.append("stop").attr("offset","50%")  
					.style("stop-color","rgba(230,230,31,1)"); 
	linearGradient.append("stop").attr("offset","100%")  
					.style("stop-color","rgba(230,230,31,0)");  		
	var focus_mousemove=mouseoverarea.append("rect")
			.attr("class", "upper_mousemove")
			.attr("x", 0).attr("y", 0)
			.attr("width", 2).attr("height", focus_height)
			.attr("fill","url(#focusline_linearColor)");
	focus_mousemove.attr("display", "none");	
	//mouseover layer
	var focusarea=focusline.append("g").attr("class", "focusarea");
	focusarea.append("rect").attr("class", "overlay")
		.attr("x", 0).attr("y", 0)//.attr("opacity",0)
		.attr("width", focus_width).attr("height", focus_height);
	focusarea.attr("cursor", "pointer")
		.on("mousemove",function(){
			var pardom=$("#upper_line .focusarea .overlay")[0];
			var curx=d3.mouse(pardom)[0];
			//var curtime=focus_x.invert(curx);
			//console.log(curx);console.log(curtime);
			focus_mousemove.attr("x",curx-1);
		}).on("mouseenter",function(){
			focus_mousemove.attr("display", "block");
		}).on("mouseleave",function(){
			focus_mousemove.attr("display", "none");
		}).on("click",function(){
			var pardom=$("#upper_line .focusarea .overlay")[0];
			var curx=d3.mouse(pardom)[0];
			var curtime=focus_x.invert(curx);
			focusToTime(curtime);
		});
	focusToStart();
}
function focusToTime(time){
	
	var timeend=focus_x.invert(focus_width).valueOf();
	var timestart=focus_x.invert(0).valueOf();
	if(time.valueOf()-upper_timemin_gran*60*1000<timestart){
		focusToStart();
	}else{
		drawUpperRectRangeDateE(time,upper_timemin_gran);
	}
}
function focusToEnd(){
	drawUpperRectRangeDateE(focus_x.invert(focus_width),upper_timemin_gran);
}
function focusToStart(){
	drawUpperRectRangeDateS(focus_x.invert(0),upper_timemin_gran);
}
function drawUpperRectRangeDateS(timestart,timespan){
	var timeend=timestart.valueOf()+timespan*60*1000;
	timeend=new Date(timeend);
	var timespw=focus_x(timeend)-focus_x(timestart);
	drawUpperRectRangeLoc(focus_x(timeend),timespw)
}
function drawUpperRectRangeDateE(timeend,timespan){
	var starttime=timeend.valueOf()-timespan*60*1000;
	starttime=new Date(starttime);
	var timespw=focus_x(timeend)-focus_x(starttime);
	drawUpperRectRangeLoc(focus_x(timeend),timespw)
}
function drawUpperRectRangeLoc(timeendlocx,timespanwidth){
	if(timeendlocx>focus_width){
		timeendlocx=focus_width;
	}
	uppertimewindow=[focus_x.invert(timeendlocx-timespanwidth),focus_x.invert(timeendlocx)];
	//document.getElementById("timeline_tip").innerHTML="时刻指示器:&nbsp;"+upperormat(focus_x.invert(timeendlocx));
	
	focus_timerect.selectAll("g").remove();
	focus_timerect.append("g").append("rect")
			.attr("class", "upper_timerange")
			.attr("x", timeendlocx-timespanwidth)
			.attr("width", timespanwidth)
			.attr("height", focus_height);	
	focus_timerect.append("g").append("path")
			.attr("class", "upper_timerange_t")
			.attr("d", resizePath);
	focus_timerect.append("g").append("line")
			.attr("class", "upper_timerange_t")
			.attr("x1", timeendlocx).attr("y1", 0)
			.attr("x2", timeendlocx).attr("y2", focus_height);
			
	function resizePath() {
		var pathw=5;var pathh=upper_margin.top;
		var rectanglerate=1/4.5;
        var str= "M" + (timeendlocx-pathw/2) + ",-" + (1 * pathh)
			+ " L" + (timeendlocx+pathw/2) + ",-" + (1 * pathh)
			+ " L" + (timeendlocx+pathw/2) + ",-" + (pathh*rectanglerate)
			+ " L" + timeendlocx + "," + 0
			+ " L" + (timeendlocx-pathw/2) + ",-" + (pathh*rectanglerate)
			+ " Z";
		//console.log(str);
		return str;
			
     }
}




