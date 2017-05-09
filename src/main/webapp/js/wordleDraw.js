var word_number_max = 50;



function draw_wordle(x,y,w,h,newsNumber,start,end,Xscale){	
         var news = json_by_news[newsNumber];
         var words = [];
         var maxTime = 0;
         for (var i in news){
        	 words.push({name: i, time: news[i]});
            if(news[i]>maxTime) maxTime = news[i];
         }
         words.sort(by("time"));
         
         var delta = words.length - word_number_max;
         for (var i = 0; i < delta; i++) words.pop();
         
         var layout = d3.layout.cloud()
            .size([w, h])
            .words(words.map(function(d) {
              return {text: d.name, size: 10 + d.time * 20 / maxTime, test: "haha"};
            }))
            .padding(5)
            .rotate(function() { return -45 + Math.random()*90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw);

        layout.start();
        function by(name){
            return function(o, p){
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? 1 : -1;
            }
            return typeof a < typeof b ? 1 : -1;
        }
        else {
            throw ("error");
        }
    }
}    
        function draw(words) {
        	//console.log("*");
           wordleImage =  svg_4.append("g")
              .attr("transform", "translate(" + x + "," + y + ")")
            .selectAll("text")
              .data(words)
            .enter().append("text")
              .style("font-size", function(d) { return d.size + "px"; })
              .style("font-family", "Impact")
              
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) {return d.text; })
              .on("click",function(d,i){
            	  for(var i=0;i<drawColor.length;i++)
          			for(var j=0;j<drawColor[i].length;j++)
          				drawColor[i][j] = 0;
            	  
          		  var newsList = json_by_words[d.text];
          			//pict_2(svg1,timeNode,labels2,jsonData,-1,start,end,0);
					//console.log(rects);
					for(var i=0;i<newsList.length;i++){
						var index = parseInt(newsList[i].substring(1,4))-101;
						var tmpIndex = index;
						//console.log(index);
						var j=0;
						for(j=0;j<timeNode.length;j++){
							if(tmpIndex>=labels2[j].length)
								tmpIndex -= labels2[j].length;
							else 
								break;
						}
						
						drawColor[j][tmpIndex] = 1;
						//if(j>=start&&j<=end){
							//console.log(rects[j][0][tmpIndex]);
							//var len = rects[j][0].length;
							//for(var p=0;p<len;p++){
							//	if(rects[j][0].length!=0){
							//		rects[j][0][p].remove();
							//		texts[j][0][p].remove();
							//	}
						//	}
						//	f(svg1,labels2,jsonData,-1,-1,j,Xscale,-1,start,end,tmpIndex);
						//}
					}
					pict_2(svg1,timeNode,labels2,jsonData,-1,scaler,scaler+parseInt(timeNode.length* $(window).width()*0.08/ ($(window).width()*0.72)));
					
        		});
            
            
         
		}
    
        
         
 }   