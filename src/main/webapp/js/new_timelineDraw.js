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
var wind = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    maxWidth = 1200, //Maximum width of the chart, regardless of screen size
    maxHeight = 800, //Maximum height of the chart, regardless of screen size
    w = Math.min(maxWidth, wind.innerWidth || e.clientWidth || g.clientWidth),
    h = Math.min(maxHeight, wind.innerHeight || e.clientHeight || g.clientHeight);

//Offsets needed to properly position elements
var xOffset = Math.max(0, ((wind.innerWidth || e.clientWidth || g.clientWidth) - maxWidth) / 2),
    yOffset = Math.max(0, ((wind.innerHeight || e.clientHeight || g.clientHeight) - maxHeight) / 2)

//Find the offsets due to other divs
//var offsets = document.getElementById('naive').getBoundingClientRect();

//SVG locations
var margin = {
        top: 200,
        right: 20,
        bottom: 50,
        left: 40
    },
    padding = 40,
    //width = w - margin.left - margin.right - padding,
    //height = h - margin.top - margin.bottom - padding;
    width = $(window).width() * 0.99;
height = $(window).height() * 0.42;
//console.log(height);

var dateOfEvents = [];
var timeNode = []; //Ӊҹ֣քɕǚ˽ߝ
var month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
//var width = 840;

var begin = [2015, 7, 1];
var end = [2016, 11, 9];
var labels1 = []; //ÿٶӉҹ֣Ѽ(ք˽ߝքҠۅ
var labels2 = [];
var values = []; //ÿٶӉҹ֣֧ԖÊքƽ߹ֵ
var span = [];
var range = 7;
//var timeNode = [];
var tmpData = [];
var Data;



var rectSelected = [];
var rectSelectedFlag = 0;
var wordleSelected = -1;
var textToHighlight = [];
var drawColor = [];


var x = d3.scaleLinear()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom(x);
//.tickFormat(d3.format("d"));

var yAxis = d3.axisLeft(y);
//.tickFormat(d3.format("d"));

//Create colors
var hexLocation = [
    {
        color: "#007F24",
        text: "1 - 49",
        position: d3.range(1, 50)
    },
    {
        color: "#62BF18",
        text: "50 - 99",
        position: d3.range(50, 100)
    },
    {
        color: "#FFC800",
        text: "100 - 499",
        position: d3.range(100, 500)
    },
    {
        color: "#FF5B13",
        text: "500 - 999",
        position: d3.range(500, 1000)
    },
    {
        color: "#E50000",
        text: "1000 - 2000",
        position: d3.range(1000, 2001)
    }
];
var hexKey = [];
hexLocation.forEach(function (d, i) {
    hexKey[d.color] = i;
})

var color = d3.scaleLinear()
    .domain([0, 1, 2, 3, 4])
    .range(hexLocation.map(function (d) {
        return d.color;
    }));



//Initiate outer chart SVG
var svg = d3.select("#naive").append("svg")
    .attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + 10 + "," + 10 + ")");

//Container for all the rectangles
var dotContainer = svg.append("g").attr("class", "dotContainer");

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

updateDots = function (selected_start, selected_end) {
    //console.log(rectSelected);
    var dots = dotContainer.selectAll(".dot");
    dots.remove();
    dots = dotContainer.selectAll(".dot");

    var start, end;
    start = parseInt(selected_start / $(window).width() * labels2.length);
    end = parseInt(selected_end / $(window).width() * labels2.length);

    //var tmpData = labels2.slice(start,end);

    //console.log([start,end]);


    for (var k = start; k < end; k++) {
        //console.log("*");
        dots
            .data(labels2[k])
            .enter().append("rect")
            .attr("class", "dot")
            .attr("width", rectWidth)
            .attr("height", rectHeight)
            .attr("rx", rectCorner)
            .attr("ry", rectCorner)
            .style("fill", function (d, i) {
                for (var h = start; h < end; h++)
                    if (labels2[h][i] == d)
                        break;
                if (rectSelected[h][i] == 1) {
                    //console.log('*');
                    return "#E9F01D";
                    //return color(3);
                } else if (drawColor[h][i] == 1) {
                    return "#495A80";
                } else
                    return color(0);
            })
            .on("mouseover", showTooltip)
            .on("mouseout", hideTooltip)
            .on("click", function (d, i) {
                document.getElementById("timeline_bottom").setAttribute("selectD", d);
                document.getElementById("timeline_bottom").setAttribute("selectI", i);
                var newsContent = document.getElementById("content");

                for (var h = start; h < end; h++)
                    for (var t = 0; t < labels2[h].length; t++)
                        rectSelected[h][t] = 0;


                for (var h = start; h < end; h++)
                    if (labels2[h][i] == d)
                        break;

                rectSelected[h][i] = 1;

                newsContent.innerHTML = Data[d]["content"];
                //globalContent = data[tmpStr[i]]["content"];
                var h = $("#div_5").height();
                $("#content").animate({
                    height: h
                }, 10);
                $("#content").css("font-size", 12);
                $("#content").css("color", "rgb(20,68,106)");
                draw_wordle();
                draw_relation();
                drawReason();
                updateDots(selected_start, selected_end);

            })
            //.attr("y", function(d) { return y(0); })
            //.style("opacity",0)
            .attr("x", function () {
                return (x(k) - rectWidth / 2);
            })
            .attr("y", function (d, i) {
                //console.log(y(i));
                return y(i);

            })
            .style("opacity", 1);

    }
    //console.log(dots);	

}



d3.csv("data/data2.csv", function (error, data) {
    csvdata = data;
    //console.log(csvdata);
});



d3.csv("data/xx1.2.csv", function (error, data) {
    Data = data;
    //console.log(csvdata);
    span = [];
    labels1 = [];
    values = [];
    //timeNode.length=0;
    //if(timeNode.length>0)timeNode = [];
    //console.log(begin);
    spanArrange(begin, end, range);
    for (var i = 0; i < csvdata.length; i += 2) {
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
        tmp6.push(i + 1);

        span.push(tmp6);
        tmpData.push(csvdata[i]["value"]);
    }
    span.reverse();

    //console.log(span);
    //spanArrange(begin,end,range);

    for (var j = 0; j < timeNode.length; j++) {
        labels1.push([]);
        values.push([]);
    }

    labelArrange1();


    plotArrange(csvdata);





    labels2 = [];
    rects = [];
    texts = [];
    candidate = [];
    flag = [];
    years = [];

    //for(i=0;i<labels2.length;i++)years.push(1);



    dateOfEvents = [];



    for (var i in Data) {
        //console.log(data[i]);if(i==0||data[i]==="undefined")continue;
        if (i == 0) continue;
        var tmp = Data[i]["date"];
        if (tmp === undefined) continue;
        //console.log(tmp);

        //var reg = new RegExp('"',"g");  
        //var this_tmp = tmp.replace(reg, "");
        //tmp = this_tmp;
        //console.log(tmp);

        var tmp1 = tmp.split("/");
        dateOfEvents.push(tmp1);
    }





    for (var j = 0; j < timeNode.length; j++) {
        labels2.push([]);
        rectSelected.push([]);
        drawColor.push([]);
    }

    labelArrange2();
    for (var i = 0; i < labels2.length; i++) {
        for (var j = 0; j < labels2[i].length; j++)
            rectSelected[i].push(0);
        drawColor[i].push(0);
    }

    //console.log(rectSelected);

    x.domain([0, labels2.length]).nice(); //.nice();
    y.domain([0, 100]).nice();

    //Size of the "song" rectangles
    rectWidth = Math.floor(x.range()[1] / 100);
    rectHeight = Math.min(3, Math.floor(y.range()[0] / 100));
    rectCorner = rectHeight / 2;


    //console.log(rectWidth);


    //Create x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height * 0.967 + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", 35)
        .style("text-anchor", "middle");
    //.text("Year of release");

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
    //function updateDots

    //Call first time
    updateDots(0, $(window).width());


});

var rangeChanged = function (flag, selected_start, selected_end) {
    if (flag == 0)
        range = parseInt(document.getElementById("rangechanging").value);
    else
        range = 7;



    timeNode.splice(0, timeNode.length);
    labels1.splice(0, labels1.length);
    values.splice(0, values.length);

    svg.selectAll("*").remove();
    dotContainer = svg.append("g").attr("class", "dotContainer");

    spanArrange([2015, 7, 1], [2016, 11, 9], range);

    //console.log(range);
    //console.log(timeNode);

    //console.log(span);


    for (var j = 0; j < timeNode.length; j++) {
        labels1.push([]);
        values.push([]);
    }

    labelArrange1();

    //console.log(labels1);


    plotArrange(csvdata);



    labels2.splice(0, labels2.length);
    rectSelected.splice(0, rectSelected.length);
    drawColor.splice(0, drawColor.length);
    //texts=[];candidate=[];flag=[];	
    //years = [];

    //for(i=0;i<labels2.length;i++)years.push(1);



    dateOfEvents.splice(0, dateOfEvents.length);



    for (var i in Data) {
        //console.log(data[i]);if(i==0||data[i]==="undefined")continue;
        if (i == 0) continue;
        var tmp = Data[i]["date"];
        if (tmp === undefined) continue;
        //console.log(tmp);

        //var reg = new RegExp('"',"g");  
        //var this_tmp = tmp.replace(reg, "");
        //tmp = this_tmp;
        //console.log(tmp);

        var tmp1 = tmp.split("/");
        dateOfEvents.push(tmp1);
    }





    for (var j = 0; j < timeNode.length; j++) {
        labels2.push([]);
        rectSelected.push([]);
        drawColor.push([]);
    }

    labelArrange2();

    //console.log(labels2);
    for (var i = 0; i < labels2.length; i++) {
        for (var j = 0; j < labels2[i].length; j++)
            rectSelected[i].push(0);
        drawColor[i].push(0);
    }


    x.domain([0, labels2.length]).nice(); //.nice();
    y.domain([0, 100]).nice();

    //Size of the "song" rectangles
    rectWidth = Math.floor(x.range()[1] / 100);
    rectHeight = Math.min(3, Math.floor(y.range()[0] / 100));
    rectCorner = rectHeight / 2;

    //console.log(rectSelected);

    //console.log(rectWidth);


    //Create x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height * 0.97 + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
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
        .text("Number of songs");

    if (flag === 1)
        updateDots(selected_start, selected_end);

    else
        updateDots(0, $(window).width());

}
