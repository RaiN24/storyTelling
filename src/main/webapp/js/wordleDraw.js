function draw_wordle(x,y,w,h,newsNumber,start,end,Xscale){
         var news = json_by_news[newsNumber];
         var words = [];
         var maxTime = 0;
         for (var i in news){
            words.push(i);
            if(news[i]>maxTime) maxTime = news[i];
         }
    
         var layout = d3.layout.cloud()
            .size([w, h])
            .words(words.map(function(d) {
              return {text: d, size: 10 + news[i] * 20/ maxTime, test: "haha"};
            }))
            .padding(5)
            .rotate(function() { return -45 + Math.random()*90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw);

        layout.start();
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
          		  var newsList = json_by_words[d.text];
          			pict_2(svg1,timeNode,labels2,jsonData,-1,start,end,0);
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
						
						
						//console.log(j);
						//console.log(tmpIndex);
						//console.log("\n");
						if(j>=start&&j<=end){
							//console.log(rects[j][0][tmpIndex]);
							var len = rects[j][0].length;
							for(var p=0;p<len;p++){
								if(rects[j][0].length!=0){
									rects[j][0][p].remove();
									texts[j][0][p].remove();
								}
							}
							f(svg1,labels2,jsonData,-1,-1,j,Xscale,-1,start,end,tmpIndex);
						}
					}
					//rects[6][1].attr("fill","yellow");
            		// write the function to the timeline
        		});
            
            
         
		}
    
        
         
 }   