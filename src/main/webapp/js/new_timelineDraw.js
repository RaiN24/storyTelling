////////////////////////////////////////////////////////////
//////////////////////// Set-up ////////////////////////////
////////////////////////////////////////////////////////////

//Chart variables
var startYear,
	years, //save height per year
	rectWidth,
	rectHeight,
	rectCorner,
	currentYear = 2015,
	chosenYear = currentYear,
	chosenYearOld = currentYear,
	optArray, //for search box
	inSearch = false, //is the search box being used - for tooltip
	selectedArtist, //for search box and highlighting
	timeNode,
	updateDots; //function needed in global
	
//Width and Height of the SVG
var	wind = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	maxWidth = 1200, //Maximum width of the chart, regardless of screen size
	maxHeight = 800, //Maximum height of the chart, regardless of screen size
	w = Math.min(maxWidth, wind.innerWidth || e.clientWidth || g.clientWidth),
	h = Math.min(maxHeight, wind.innerHeight|| e.clientHeight|| g.clientHeight);

//Offsets needed to properly position elements
var xOffset = Math.max(0, ((wind.innerWidth || e.clientWidth || g.clientWidth)-maxWidth)/2),
	yOffset = Math.max(0, ((wind.innerHeight|| e.clientHeight|| g.clientHeight)-maxHeight)/2)

//Find the offsets due to other divs
//var offsets = document.getElementById('naive').getBoundingClientRect();
	
//SVG locations
var margin = {top: 200, right: 20, bottom: 50, left: 40},
	padding = 40,
    //width = w - margin.left - margin.right - padding,
    //height = h - margin.top - margin.bottom - padding;
	width = $(window).width()*0.99;
	height = $(window).height()*0.51;
	//console.log(height);
	
var begin = [2015,7,1];
var end = [2016,11,9];
var range = 7;
var month = [31,28,31,30,31,30,31,31,30,31,30,31];
var timeNode = [];
var tmpData=[];
var Data;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
	.tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
	.tickFormat(d3.format("d"));
	
//Create colors
var hexLocation = [
	{color:"#007F24", text: "1 - 49", position: d3.range(1,50)},
	{color:"#62BF18", text: "50 - 99", position: d3.range(50,100)},
	{color:"#FFC800", text: "100 - 499", position: d3.range(100,500)},
	{color:"#FF5B13", text: "500 - 999", position: d3.range(500,1000)},
	{color:"#E50000", text: "1000 - 2000", position: d3.range(1000,2001)}
];
var hexKey = [];
hexLocation.forEach(function(d,i) {
	hexKey[d.color] = i;
})
	
var color = d3.scale.linear()
	.domain([1,50,100,500,1000,2000])
	.range(hexLocation.map(function(d) { return d.color; }));


	
//Initiate outer chart SVG
var svg = d3.select("#naive").append("svg")
    .attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + 10 + "," + 10 + ")");
	
//Container for all the rectangles
var dotContainer = svg.append("g").attr("class","dotContainer");
	
//Create title to show chosen year
/*var yearTitle = svg.append('text')                                     
	  .attr('x', width/2) 
	  .attr('y', -10)	  
	  .attr("class", "yearTitle")
	  .text(chosenYear);  
*/
	  
////////////////////////////////////////////////////////////	
///////////////////// Read in data /////////////////////////
////////////////////////////////////////////////////////////

var csvdata;

d3.csv("data/data2.csv",function(error,data){
	csvdata =  data;
});


d3.csv("data/xx1.2.csv", function(error, data) {
	Data = data;
	span=[];labels1=[];values=[];
	//timeNode.length=0;
	//if(timeNode.length>0)timeNode = [];
	spanArrange(begin,end,range);
	for(var i=0;i<csvdata.length;i+=2){                               
		var date = csvdata[i]["date"];
		var tmp1 = date.split(" ");
		var tmp2 = tmp1[3];
		var tmp3 = tmp1[2];
		var tmp4 = tmp1[1];
		var tmp6 = [];
		
		
		
		tmp6.push(tmp2);
		tmp6.push(tmp3);
		tmp6.push(tmp4);
		tmp6.push(i);
		tmp6.push(i+1);
		
		span.push(tmp6);
		tmpData.push(csvdata[i]["value"]);
	}
	span.reverse();
	
	//console.log(span);
	//spanArrange(begin,end,range);
	
	for(var j=0;j<timeNode.length;j++){             
		labels1.push([]);
		values.push([]);
	}
	
	labelArrange1();

	
	plotArrange(csvdata);
	
	
		
	
		
	labels2=[];rects=[];texts=[];candidate=[];flag=[];	
	years = [];
	
	//for(i=0;i<labels2.length;i++)years.push(1);
		
		
	
	dateOfEvents=[];
	

	
	for(var i in data){
		//console.log(data[i]);if(i==0||data[i]==="undefined")continue;
		if(i==0)continue;
		var tmp = data[i]["date"]; 
		var reg = new RegExp('"',"g");  
		tmp = tmp.replace(reg, "");  

		var tmp1 = tmp.split("/");
		dateOfEvents.push(tmp1);
	}
	
	
	
	

	for(var j=0;j<timeNode.length;j++){              
		labels2.push([]);

	}
	
	labelArrange2();	
	
	x.domain([0,labels2.length]).nice();//.nice();
	y.domain([0,100]).nice();

	//Size of the "song" rectangles
	rectWidth = Math.floor(x.range()[1]/100);
	rectHeight = Math.min(3,Math.floor(y.range()[0]/100));
	rectCorner = rectHeight/2;

	
	//console.log(rectWidth);
	
	
	//Create x axis
	svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height*0.98 + ")")
		  .call(xAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("x", width/2)
		  .attr("y", 35)
		  .style("text-anchor", "middle")
		  .text("Year of release");

	//Create y axis
	svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("class", "label")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 8)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text("Number of songs")
	
	//Create the legend
	//createLegend();

	//Change the year when moving the slider
	updateDots = function () {
		
		
		var dots = dotContainer.selectAll(".dot");
			
		for(var k=0;k<labels2.length;k++){
			dots
					.data(labels2[k])
					.enter().append("rect")
					.attr("class", "dot")
					.attr("width", rectWidth)
					.attr("height", rectHeight)
					.attr("rx", rectCorner)
					.attr("ry", rectCorner)
					.style("fill", function(d) { return color(0); })
					.on("mouseover", showTooltip)
					.on("mouseout", hideTooltip)
					.transition().duration(500)
					//.attr("y", function(d) { return y(0); })
					//.style("opacity",0)
					.transition().duration(10).delay(function(d,i) { return i/2; })
					.attr("x",function(){
							//console.log(x(k));
							//console.log(k);
							return (x(k) - rectWidth/2);
					})
					.attr("y", function(d,i) {
							//console.log('i');
							//console.log(i);
							//console.log('k');
							//console.log(k);
							return y(i); 
						
					})
					.style("opacity",1);
			
		}
		//console.log(dots);	
		
	}//function updateDots
	
	//Call first time
	
		updateDots();
	
});
