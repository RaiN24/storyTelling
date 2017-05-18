function f(svg,num,data,z,m,k,Xscale,chosen,start,end,highlight){                                 
	var tmp = (num[k].reverse()).slice();
	var tmpLength = tmp.length;
	num[k].reverse();
	//if(highlight!=-1)console.log(tmp);
		var tmpStr = [];
		var len = tmp.length>flag[k]*20+20?flag[k]*20+20:tmp.length;
		for(var b=flag[k]*20;b<len;b++)
			tmpStr.push(tmp[b]);
		
		if(tmp.length>=20){
			//if(tmp.length!=len)
			tmpStr.push(-2);
			tmpStr.push(-1);
		}
		//console.log(tmpStr);
			
		rects[k] = svg.selectAll("MyRect")
					.data(tmpStr)
					.enter()
					.append("rect")
					.attr("class","MyRect")
					.attr("transform","translate("+$(window).width()*0.01+","+$(window).height()*0.21+")")
					.attr("rx",5)
					.attr("x",function(d,i){
						if(i<=21){
							if(chosen>=0){
								if(k-start==chosen) 
									return (Xscale(k-start)+Xscale(k-start+1))/2-30;
									//return parseInt($(window).width()*0.78/(end-start+1))*(k-start)*1.3;
								
								else
									return (Xscale(k-start)+Xscale(k-start+1))/2+25;
									//return parseInt($(window).width()*0.78/(end-start+1))*(k-start)*1.5;
							}
							else{
								if(k<end-1)
									return (Xscale(k-start)+Xscale(k-start+1))/2+10;
								else 
									return Xscale(k-start)+(Xscale(k-start)-Xscale(k-start-1))+10;
							}
						}
						
					})
					.attr("y",function(d,i){
						if(m==-1)
							return $(window).height()*0.226-i*$(window).height()*0.015;
						else{
							if(d!=-1&&d!=-2){
								if(i<z)
									return $(window).height()*0.226-i*$(window).height()*0.015;
								else if(i>z)
									return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.06;
								else	
									return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.06;
							}
						
							else if(d==-2)return $(window).height()*0.226-(tmpStr.length-i)*$(window).height()*0.015;
							
							else return $(window).height()*0.226 + $(window).height()*0.015;
						}
					})
					.attr("fill",function(d,i){
						if(drawColor[k][i]==1)return "yellow";
						else if(rectSelected[k][i]==1)return "purple";
						else return "white";
					})
					.attr("stroke","black")
					.attr("width",function(d,i){
						if(chosen>=0){
							if(k-start==chosen)
								return parseInt($(window).width()*0.78/(end-start+1))*1.5;
							else 
								return parseInt($(window).width()*0.78/(end-start+1))*0.5;
						}
						else
							return parseInt($(window).width()*0.78/(end-start+1));
							//return Xscale(k-start)+10;
					})
					.attr("height",function(d,i){
						if(m==-1)	
							return $(window).height()*0.015;
						else{
							if(d!=-1&&d!=-2){
								if(i==z)
									return $(window).height()*0.075;
								else 
									return $(window).height()*0.015;
						
							}
							else return 0;
						}
					})
					.on("click",function(d,i){
						if(d==-1){
							if(tmpLength!=len){
									for(var p=0;p<=len-flag[k]*20+1;p++){
										if(rects[b][0].length!=0){
											//console.log(texts[k][0][p]["text"]);
											rects[k][0][p].remove();
											texts[k][0][p].remove();
											candidate[k][0][p].remove();
										}
									}
									flag[k]++;
									f(svg,num,data,-1,-1,k,Xscale,chosen,start,end);
								
							}
						}
						else if(d==-2){
							if(flag[k]>0){
								for(var p=0;p<=len-flag[k]*20+1;p++){
									if(rects[k][0].length!=0){
										rects[k][0][p].remove();
										texts[k][0][p].remove();
										candidate[k][0][p].remove();
									}
								}
						 		flag[k]--;
								f(svg,num,data,-1,-1,k,Xscale,chosen,start,end);
							}
						}
						else{
							wordleSelected = -1;
							
							if(rectSelectedFlag&&rectSelected[k][i]==0)
								return;
							if(rectSelected[k][i]==0){
								rectSelected[k][i] = 1;
								rectSelectedFlag = 1;
							//console.log(rectSelected);
							
							var newsContent = document.getElementById("content");
							//console.log(data[tmpStr[i]]["content"]);
							newsContent.innerHTML = data[tmpStr[i]]["content"];
							$("#content").css("font-size",12);
							$("#content").css("color","rgb(20,68,106)");	
							var tmp = tmpStr[i] ;
							tmp = 'n' + tmp;
							//console.log(tmp);
							svg_4.selectAll("text").remove();
							draw_wordle($(window).width()*0.15,$(window).height()*0.1925,$(window).width()*0.3,$(window).height()*0.385,tmp,start,end,Xscale);
							}
							else {
								rectSelected[k][i] = 0;
								rectSelectedFlag = 0;
								svg_4.selectAll("text").remove();
								$("#content").html("");
							}
							
							for(var p=0;p<len-20*flag[k];p++){
								if(rects[k][0].length!=0){
									rects[k][0][p].remove();
									texts[k][0][p].remove();
									candidate[k][0][p].remove();
								}
							//candidate[q][0][p].remove();
						
							}
							if(tmp.length!=len&&tmp.length>=20){
									//console.log(rects[k][0][len-start]);
									rects[k][0][len-20*flag[k]].remove();
									texts[k][0][len-20*flag[k]].remove();
									rects[k][0][len-20*flag[k]+1].remove();
									texts[k][0][len-20*flag[k]+1].remove();
									//candidate[k][0][len-10*flag[k]].remove();
							}
								
						
					
							f(svg,num,data,i,1,k,Xscale,chosen,start,end,highlight);
						}
					})
					.on("mouseover",function(d,i){
						//console.log("*");
						if(d!=-1&&d!=-2){
							//console.log(rects[k]);
							for(var p=0;p<len-20*flag[k];p++){
								if(rects[k][0].length!=0){
									rects[k][0][p].remove();
									texts[k][0][p].remove();
									candidate[k][0][p].remove();
								}
							//candidate[q][0][p].remove();
						
							}
							if(tmp.length!=len&&tmp.length>=20){
									//console.log(rects[k][0][len-start]);
									rects[k][0][len-20*flag[k]].remove();
									texts[k][0][len-20*flag[k]].remove();
									rects[k][0][len-20*flag[k]+1].remove();
									texts[k][0][len-20*flag[k]+1].remove();
									//candidate[k][0][len-10*flag[k]].remove();
							}
								
						
					
							f(svg,num,data,i,1,k,Xscale,chosen,start,end,highlight);
							//console.log("*");
						}
						
					
						
						
					})
					.on("mouseout",function(d,i){
						
						var l = texts[k].length;
						//console.log("*");
					
						if(d!=-1&&d!=-2){
							
								for(var p=0;p<len-20*flag[k];p++){
								
									rects[k][0][p].remove();
									candidate[k][0][p].remove();
									texts[k][0][p].remove();
						
								}	
							
								for(var v=1;v<l;v++){
									var a=texts[k][v][0].length;
									for(var p=0;p<a;p++)
										texts[k][v][0][p].remove();
								}
							
								if(tmp.length!=len&&tmp.length>=20){
									rects[k][0][len-20*flag[k]].remove();
									texts[k][0][len-20*flag[k]].remove();
									candidate[k][0][len-20*flag[k]].remove();
									rects[k][0][len-20*flag[k]+1].remove();
									texts[k][0][len-20*flag[k]+1].remove();
									candidate[k][0][len-20*flag[k]+1].remove();
									
								}
						
								f(svg,num,data,i,-1,k,Xscale,chosen,start,end,highlight);
							
						}
						
						
					
					});	
	
		if(m==-1)				
			texts[k] = svg.selectAll("t")
					.data(tmpStr)
					.enter()
					.append("text")
					.attr("class","t")
					.attr("transform","translate("+$(window).width()*0.01+","+$(window).height()*0.21+")")
					.attr("x",function(d,i){
						if(i<=21){
							if(chosen>=0){
								if(k-start==chosen)
									return (Xscale(k-start)+Xscale(k-start+1))/2-30;
									//return parseInt($(window).width()*0.78/(end-start+1))*(k-start)*1.3;
								
								else
									return (Xscale(k-start)+Xscale(k-start+1))/2+25;
									//return parseInt($(window).width()*0.78/(end-start+1))*(k-start)*1.5;
							}
							else{
									if(k<end-1)
										return (Xscale(k-start)+Xscale(k-start+1))/2+10;
									else 
										return Xscale(k-start)+(Xscale(k-start)-Xscale(k-start-1))+10;
							}
						}
						
						
					})
					.attr("y",function(d,i){
						if(m==-1)
							return $(window).height()*0.226-i*$(window).height()*0.015+$(window).height()*0.012;
						else{
							if(i<z)
								return $(window).height()*0.226-i*$(window).height()*0.015;
							else if(i>z)
								return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.045;
							else	
								return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.045;
						}
					})
					.text(function(d,i){
						if(d==-1)
							return ">>>>>>>>";
						else if(d==-2)
							return "<<<<<<<<";
						else{
							//if(highlight!=-1)console.log(tmpStr[i]);
							return data[tmpStr[i]]["date"];
						}
						
					})
					.attr("width",function(d,i){
						if(chosen>=0){
							if(k-start==chosen)
								return parseInt(width/(end-start))*2;
							else 
								return parseInt((width-(width/(end-start))*2)/(end-start-1));
						}
						else
							return parseInt(width/(end-start));
					})
					.attr("height",function(d,i){
						if(m==-1)	
							return $(window).height()*0.015;
						else{
							if(i==z)
								return $(window).height()*0.075;
							else 
								return $(window).height()*0.015;
						
						}				
					})
					.style("font-size",function(){
						return "6px";
					});
					
		else{	
			var v = data[tmpStr[z]]["title"];
			var new_v = [];
			var prev = 0;
			if(k-start==chosen)
				for(var w=0;w<v.length;w++){
					if(w!=0&&w%12==0){
						new_v.push(v.substring(prev,w));
						prev = w;
						//console.log(new_v);
					}
				} 
			else
				for(var w=0;w<v.length;w++){
					if(w!=0&&w%6==0){
						new_v.push(v.substring(prev,w));
						prev = w;
					}
				} 
			new_v.push(v.substring(prev,v.length));
			//console.log(new_v);
		
		
			for(var w=0;w<new_v.length;w++){
				texts[k].push( svg.selectAll("t")
						.data(tmpStr)
						.enter()
						.append("text")
						.attr("class","t")
						.attr("transform","translate("+$(window).width()*0.01+","+$(window).height()*0.21+")")
						.attr("x",function(d,i){
							if(i<=20){
								if(chosen>=0){
									if(k-start==chosen)
										return (Xscale(k-start)+Xscale(k-start+1))/2-30;
										//return parseInt($(window).width()*0.78/(end-start+1))*(k-start)*1.3;
									
									else
										return (Xscale(k-start)+Xscale(k-start+1))/2+25;
										//return parseInt($(window).width()*0.78/(end-start+1))*(k-start)*1.5;
								}
								else{
									if(k<end-1)
										return (Xscale(k-start)+Xscale(k-start+1))/2+10;
									else 
										return Xscale(k-start)+(Xscale(k-start)-Xscale(k-start-1))+10;
								}
							}
							
						
					})
						.attr("y",function(d,i){
							if(k-start==chosen){
								if(z==i){
									if(m==-1)
										return $(window).height()*0.226-i*$(window).height()*0.015;
									else{
										if(i<z)
											return $(window).height()*0.226-i*$(window).height()*0.015;
										else if(i>z)
											return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.06;
										else	
											return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.06+$(window).height()*0.017*w;
									}
								}
								else{	
									if(m==-1)
										return $(window).height()*0.226-i*$(window).height()*0.015+$(window).height()*0.015;
									else{
										if(i<z)
											return $(window).height()*0.226-i*$(window).height()*0.015+$(window).height()*0.015;
										else if(i>z)
											return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.045;
										else	
											return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.045+$(window).height()*0.0075*w;
									}
								}
							}
						
							else{
								if(m==-1)
									return $(window).height()*0.226-i*$(window).height()*0.015+$(window).height()*0.015;
								else{
									if(i<z)
										return $(window).height()*0.226-i*$(window).height()*0.015+$(window).height()*0.015;
									else if(i>z)
										return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.045;
									else	
										return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.045+$(window).height()*0.0075*w;
								}
							}
						})
					.text(function(d,i){
						if(d==-1){
							return ">>>>>>>>";
						}
						else if(d==-2){
							return "<<<<<<<<";
						}
						else if(z==i){
							//console.log(new_v[w]);
							//if(k-start==chosen)
								return new_v[w];
							
						}
						else
							return data[tmpStr[i]]["date"];
						
					})
					.attr("width",function(d,i){
						if(chosen>=0){
							if(k-start==chosen)
								return parseInt(width/(end-start))*2;
							else 
								return parseInt((width-(width/(end-start))*2)/(end-start-1));
						}
						else
							return parseInt(width/(end-start));
					})
					.attr("height",function(d,i){
						if(m==-1)	
							return $(window).height()*0.015;
						else{
							if(i==z)
								return $(window).height()*0.075;
							else 
								return $(window).height()*0.015;
						
						}				
					})
					.style("font-size",function(d,i){
						if(k-start==chosen){
							if(i==z)return "10px";
							else return "6px";
						}
						else
							return "6px";
					}));
	
		
		}
	}
	
	
	
	candidate[k] = 	svg.selectAll("ci")
					.data(tmpStr)
					.enter()
					.append("circle")
					.attr("transform","translate("+$(window).width()*0.01+","+$(window).height()*0.21+")")
					.attr("class","ci")
					.attr("cx",function(d,i){
						if(m==-1)
							return $(window).height()*0.226-i*$(window).height()*0.015;
						else{
							if(d!=-1&&d!=-2){
								if(i<z)
									return $(window).height()*0.226-i*$(window).height()*0.015;
								else if(i>z)
									return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.06;
								else	
									return $(window).height()*0.226-i*$(window).height()*0.015-$(window).height()*0.06;
							}
						
							else if(d==-2)return $(window).height()*0.226-(tmpStr.length-i)*$(window).height()*0.015;
							
							else return $(window).height()*0.226 + $(window).height()*0.015;
						}
						
					})
					.attr("cy",function(d,i){
						if(i<=21){
							if(chosen>=0){
								if(k-start==chosen)
									return (Xscale(k-start)+Xscale(k-start+1))/2-30;
									//return parseInt($(window).width()*0.78/(end-start+1))*(k-start)*1.3;
								
								else
									return (Xscale(k-start)+Xscale(k-start+1))/2+25;
									//return parseInt($(window).width()*0.78/(end-start+1))*(k-start)*1.5;
							}
							else{
									if(k<end-1)
										return (Xscale(k-start)+Xscale(k-start+1))/2+10;
									else 
										return Xscale(k-start)+(Xscale(k-start)-Xscale(k-start-1))+10;
							}
						}
					})
					.attr("fill",function(d,i){
						if(d!=-1&&d!=-2){
							//console.log(data[tmpStr[i]]);
							var cc = data[tmpStr[i]]["content"];
							var c1=0,c2=0;
							//console.log(cc);
							for(var j=0;j<=cc.length-3;j++){
								if((cc[j]=='��'&&cc[j+1]=='��'&&cc[j+2]=='��')
								||(cc[j]=='��'&&cc[j+1]=='��'&&cc[j+2]=='��'))
									c1++;
							
								else if((cc[j]=='ϣ'&&cc[j+1]=='��'&&cc[j+2]=='��')
								||(cc[j]=='��'&&cc[j+1]=='��'&&cc[j+2]=='��'))
									c2++;
								
							
							}
						
							if(c1>c2)return "red";
							else if(c1<c2)return "steelblue";
							else return "yellow";
						
						}
						
					})
					.attr("r",function(d,i){
						if(m!=-1)	
						{
							if(i==z)
								return 3;
							else 
								return 0;
						
						}
						else	
							return 0;
					});		
	
}



function drawRect(svg,Xscale,Y,num,timeNode,start,end,h,isTimeline){
	var thisColor = ["steelBlue","red"];	
	
	var v = [];
	for(var i=0;i<2;i++){
		var tmp = [];
		for(var j=start;j<end;j++)
			tmp.push(num[j][i]);
		v.push(tmp);
	}
	
	//if(!isTimeline)console.log(values);
	
	var dist1 = [];
	var dist2 = [];
	
	for(var k=0;k<2;k++){	
		for(var j=0;j<end-start;j++){		
			var tmp1 = [];
			var tmp2 = [];
			if(isTimeline){
				circles[k][j] = svg.selectAll("ci")
					.data(v[k])
					.enter()
					.append("circle")
					.attr("class","ci")
					.attr("transform",function(){
						if(h==150)
							return "translate(40,50)";
						else 
							return "translate(40,2)";
					})
					.attr("fill",thisColor[k])
					.on("mouseover",function(d,i){
						if(h==150)
							tooltip.html("the exact value is: "+d)
								.style("left",(d3.event.pageX)+"px")
								.style("top",(d3.event.pageY+20)+"px")
								.style("opacity",1.0);
							})
					.on("mouseout",function(d,i){
						tooltip.style("opacity",0.0);
					})
					.on("click",function(d,i){
						if(h==150){
							for(var m=0;m<2;m++)
								for(var n=0;n<end-start;n++)
									circles[m][n].attr("fill",thisColor[m]);
					
							var x = 0;
							for(x=0;x<2;x++)
								if(d==v[x][i])break;
							
							
							circles[x][i].attr("fill","yellow");
							for(var q=start;q<end;q++){
								//console.log(rects[q]);
								var len = rects[q][0].length;
									for(var p=0;p<len;p++){
									if(rects[q][0].length!=0){
									rects[q][0][p].remove();
											texts[q][0][p].remove();
									}
								}
							}		
						
					
					d3.selectAll(".axisX text")
								.attr("color","white")
								.attr("x", function(d,j){
									if(i>j)return parseInt(width*(0.003*j-0.1)/(2*(end-start)));
									else return parseInt(width*(0.003*j+0.1)/(2*(end-start)));
										
								});
							
						
						for(var k=start;k<end;k++){
							
							f(svg1,labels2,jsonData,-1,-1,k,Xscale,i,start,end,-1);
				
							}
						}
					})
				
					.attr("cx",function(d,i){
						if(i==j){
							if(Y(d)!=h){
								if(k==0)tmp1.push(Xscale(i)+10);
									else tmp2.push(Xscale(i)+10);
							}
							return Xscale(i);
						}
						else return 0;
					})
					.attr("cy",function(d,i){
						if(Y(d)!=h){
							if(j==i){
								if(k==0)tmp1.push(Y(d)+18);
								else tmp2.push(Y(d)+18);
								
								//console.log(Y(d));
							}
							return Y(d);
						}
						else return h;
					})
					.attr("r",function(d,i){
						if(j==i){
							if(Y(d)==h)return 0;
							else {
								if(h==150)
									return 4;
								else 
									return 0.5;
							}
						}
						else return 0;
					});
			}
			else{
				svg.selectAll("ci")
				.data(v[k])
				.enter()
				.append("circle")
				.attr("class","ci")
				.attr("cx",function(d,i){
						if(i==j){
							if(Y(d)!=h){
								if(k==0)tmp1.push(Xscale(i)+10);
									else tmp2.push(Xscale(i)+10);
							}
							return Xscale(i);
						}
						else return 0;
				})
				.attr("cy",function(d,i){
					if(Y(d)!=h){
						if(j==i){
								if(k==0)tmp1.push(Y(d));
								else tmp2.push(Y(d));
								//console.log(i);
								//console.log(Y(d));
							}
						return Y(d);
					}
					else return h;
				})
				.attr("r",0);
			
			}
			if(tmp1.length!=0)dist1.push(tmp1);
			if(tmp2.length!=0)dist2.push(tmp2);
			
		}
	}
	//console.log(dist1);
	
	
	var lineGenerator = d3.svg.line()
						.x(function(d){return d[0];})
						.y(function(d){return d[1];})
						.interpolate('linear');
						
	
	
		svg.append("path")
			.attr("class","line")
			.attr("transform",function(){
				if(h==150)
					return "translate(30,30)";
				else 
					return "translate(30,2)";
			})
			.attr('stroke-width', '1')
			.attr('stroke',"blue")
			.attr("fill","none")
			.attr("d",lineGenerator(dist1));
			
		svg.append("path")
			.attr("class","line")
			.attr("transform",function(){
				if(h==150)
					return "translate(30,30)";
				else 
					return "translate(30,2)";
			})
			.attr('stroke-width', '1')
			.attr('stroke',"red")
			.attr("fill","none")
			.attr("d",lineGenerator(dist2));
	

}



function setXscale(start,end,w,flag){
		var x_scale = [];
		var curVal = 0;
		for(var i=start;i<end;i++){
			if(flag==0){
				var tmp =[];
				tmp.push(timeNode[i][0][1]);
				tmp.push(timeNode[i][0][2]);
				x_scale.push(tmp);
				
			}
			
			else x_scale.push(curVal);
			curVal+=1;
		}
		
		var Xscale=d3.scale.ordinal()
			.domain(x_scale)
			.rangeRoundBands([0,w]);
		
		return Xscale;
}


function pict_1(svg,timeNode,num,start,end,h,isTimeline){
		//svg.selectAll('*').remove();
		var min=[];
		var max=[];
		var t,maxY;
		for(var i=start;i<end;i++){
			min.push(d3.min(num[i]));
			max.push(d3.max(num[i]));
		}
		
		
		
		var Min=d3.min(min);
		var Max=d3.max(max);
		
		
		var linear;
			if(isTimeline)
				linear = d3.scale.linear()                        
							.domain([Min,Max])
							.range([0,$(window).height()*0.4]);
			
			else
				linear = d3.scale.linear()                        
							.domain([Min,Max])
							.range([0,$(window).height()*0.1]);
			
		
		var Xscale;
		if(isTimeline)
			Xscale = setXscale(start,end,$(window).width()*0.78,-1);
		else
			Xscale = setXscale(start,end,$(window).width()*0.78,-1);
		//var XscaleDraw = setXscale(start,end,width,0);
			
		var Yscale=[];
		
		for(var i=start;i<end;i++){
			var tmp;
			if(isTimeline)
				tmp = d3.scale.linear()
						.domain([0,d3.max(num[i])])
						.range([$(window).height()*0.5,0]);
			else
				tmp = d3.scale.linear()
						.domain([0,d3.max(num[i])])
						.range([$(window).height()*0.1,0]);
			Yscale.push(tmp);
			
		}
		
		//console.log(Yscale);
		
		var Ydraw;
		if(isTimeline)
			Ydraw = d3.scale.linear()
						.domain([0,1])
						.range([$(window).height()*0.5,0]);
		else 
			Ydraw = d3.scale.linear()
						.domain([0,1])
						.range([$(window).height()*0.1,0]);
		
		maxY=-1;
		
		//console.log(d3.max(num[maxY]));
		for(t=start;t<end;t++){
			if(maxY==-1)
				maxY=t;
			else if(d3.max(num[maxY])<d3.max(num[t]))
				maxY=t;
		}
		
		//if(!isTimeline){console.log(maxY);}
		maxY -= start;
		//console.log(Yscale[0](num[0]));
		//var axisX=d3.svg.axis()
			//.scale(XscaleDraw)
			//.orient("bottom");
			//.ticks(timeNode.length);
		if(isTimeline==1){
			var axisY;
			
				axisY=d3.svg.axis()
					.scale(Ydraw)
					.orient("left");
		
			
			//svg.append("g")
			//	.attr("class","axisX")
			//	.attr("transform","translate(30,170)")
			//	.call(axisX);
			
				svg.append("g")
					.attr("class","axisY")
					.attr("transform","translate("+$(window).width()*0.015+","+$(window).height()*0.01+")")
					.call(axisY);
		
		}			
		
		drawRect(svg,Xscale,Yscale[maxY],num,timeNode,start,end,h,isTimeline);	
		
		
			
			
			
}


function pict_2(svg,timeNode,num,data,chosen,start,end){
		//svg.selectAll('*').remove();
		var min=[];
		var max=[];
		var t,maxY;
		var x_scale = [];
		for(var i=0;i<num.length;i++){
			min.push(d3.min(num[i]));
			max.push(d3.max(num[i]));
		}
		
		
		var Min=d3.min(min);
		var Max=d3.max(max);
		//console.log(min);
		//console.log(data);
		
		var Xscale = setXscale(start,end,$(window).width()*0.78,-1);
		var Xscale_draw = setXscale(start,end,$(window).width()*0.78,0);
			
		//var tickValue = [];
		//for(var i=0;i<end-start;i++)
			//tickValue.push(parseInt(width/(end-start)/2*(2*i+1)));
		
		//console.log(tickValue);
		
		var axisX=d3.svg.axis()
			.scale(Xscale_draw)
			//.innerTickSize(tickValue)
			.orient("bottom");
		
		axisDraw = svg.append("g")
						.attr("class","axisX")
						.attr("transform","translate("+$(window).width()*0.01+","+$(window).height()*0.45+")")
						.call(axisX);
		
		
		
		
		
		for(var k=start;k<end;k++){
				f(svg,num,data,-1,-1,k,Xscale,chosen,start,end,-1);
							
		}
		//console.log(candidate);
					
		
		//drawRect(svg,Xscale,Yscale[maxY],num,timeNode);			
}



function spanChosen(r,start,end){
	var s = document.getElementById("s").value;
	var e = document.getElementById("e").value;
	var reg = new RegExp('"',"g");  
	s = s.replace(reg, "");
	e = e.replace(reg, "");
	
	s = s.split("-");
	e = e.split("-");
	
	if(s[1][0]==0)s[1]=s[1][1];
	if(s[2][0]==0)s[2]=s[2][1];
	
	if(e[1][0]==0)e[1]=e[1][1];
	if(e[2][0]==0)e[2]=e[2][1];
	
	range = r;
	timeNode = [];
	spanArrange(start,end,range);
	//console.log(timeNode);
	//console.log(s);
	//console.log(e);
 
	var a,b;
	for(a=0;a<timeNode.length;a++)
		if(match2(s,timeNode[a][0],timeNode[a][1]))
			break;
	for(b=0;b<timeNode.length;b++)
		if(match2(e,timeNode[b][0],timeNode[b][1]))
			break;
	if(a==71)a=0;
	//console.log(a);
	//console.log(b);
	
	timelinePict(a,b,r,jsonData,csvData,1);
	
	
	//$(".show").animate({left:(a/timeNode.length*$(window).width()*0.78)+"px"},10);
	if(r==7)$(".show").animate({width:($(window).width()*0.1*(b-a+1)/11)+"px",left:($(window).width()*0.09+a/timeNode.length*$(window).width()*0.78)+"px"},10);
	else if(r==14)$(".show").animate({width:($(window).width()*0.2*(b-a+1)/11)+"px",left:($(window).width()*0.09+a/timeNode.length*$(window).width()*0.78)+"px"},10);
	else if(r==30)$(".show").animate({left:($(window).width()*0.09+a/timeNode.length*$(window).width()*0.78)+"px",width:($(window).width()*0.2*30/21*(b-a+1)/11)+"px"},10);
	else if(r==90)$(".show").animate({left:($(window).width()*0.09+a/timeNode.length*$(window).width()*0.78)+"px",width:($(window).width()*0.2*90/21*(b-a+1)/11)+"px"},10);
	else if(r==180)$(".show").animate({left:($(window).width()*0.09+a/timeNode.length*$(window).width()*0.78)+"px",width:($(window).width()*0.2*180/21*(b-a+1)/11)+"px"},10);
	else if(r==365)$(".show").animate({left:($(window).width()*0.09+a/timeNode.length*$(window).width()*0.78)+"px",width:($(window).width()*0.2*365/21*(b-a+1)/11)+"px"},10);
	
	
	
}

function timelinePict(head,tail,range,data,csvdata,isTimeline){
	svg1.selectAll('*').remove();
	
	svg1.append("circle")
		.attr("cx",$(window).width()*0.68)
		.attr("cy",$(window).height()*0.01)
		.attr("r",5)
		.attr("fill","blue");
	
	svg1.append("text")
		.attr("x",$(window).width()*0.71)
		.attr("y",$(window).height()*0.015)
		.text("共和党")
		.attr("fill","white");
	
	svg1.append("circle")
		.attr("cx",$(window).width()*0.68)
		.attr("cy",$(window).height()*0.03)
		.attr("r",5)
		.attr("fill","red");	

	svg1.append("text")
		.attr("x",$(window).width()*0.71)
		.attr("y",$(window).height()*0.035)
		.text("民主党")
		.attr("fill","white");
	
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
	
	/*if(!isTimeline){
		console.log(timeNode);
		console.log(labels1);
		console.log(csvdata);
		console.log(values);
	}*/
				
	pict_1(svg1,timeNode,values,head,tail,150,isTimeline);
	
	//if(!isTimeline)timeNode = [];
	
	if(isTimeline){
	
	dateOfEvents=[];
	for(var i=0;i<data.length;i++){
		var tmp = data[i]["date"];
		var reg = new RegExp('"',"g");  
		tmp = tmp.replace(reg, "");  

		var tmp1 = tmp.split("/");
		dateOfEvents.push(tmp1);
	}
	
	
	labels2=[];rects=[];texts=[];candidate=[];flag=[];
	
	//console.log(timeNode);

	
	for(var j=0;j<timeNode.length;j++){              
		labels2.push([]);
		//values.push([]);
	}
	for(var i=0;i<timeNode.length;i++){
		rects.push([]);
		texts.push([]);
		candidate.push([]);
		flag.push(0);
		
	}		
	
	//console.log(values);
	
	labelArrange2();
	
	for(var i=0;i<timeNode.length;i++){
		drawColor.push([]);
		rectSelected.push([]);
		for(var j=0;j<labels2.length;j++){
			drawColor[i].push(0);
			rectSelected[i].push(0);
		}
	}

		//console.log(labels2);
		
		pict_2(svg1,timeNode,labels2,data,-1,head,tail);
	}
}