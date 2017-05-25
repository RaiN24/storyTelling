

function matchYear(s,t){
	if(s[0]>t[0])return 1;
	else if(s[0]==t[0])return 0;
	else return -1;
}

function matchMonth1(s, t){
	var m = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
	var index1,index2;
	for(var i=0;i<12;i++){
		if(m[i]==s[1])
			index1 = i+1;
			
	}
	//console.log(index1);
	if(index1>t[1])return 1;
	else if(index1==t[1])return 0;
	else return -1;
	
}

function matchMonth2(s, t){
	if(s[1]>t[1])return 1;
	else if(s[1]==t[1])return 0;
	else return -1;
	
}

function matchDay(s,t){
	if(s[2]>t[2])return 1;
	else if(s[2]==t[2])return 0;
	else return -1;
}

function match1(s,t1,t2){                                            //?????����???????????��?             
	if(matchYear(s,t1)==0&&matchYear(s,t2)==0){
		if(matchMonth1(s,t1)==0&&matchMonth1(s,t2)==0){
			if(matchDay(s,t1)==1&&matchDay(s,t2)==-1)
				return true;
			if(matchDay(s,t1)==1&&matchDay(s,t2)==0)
				return true;
			if(matchDay(s,t1)==1&&matchDay(s,t2)==1)
				return false;
		}
		
		if(matchMonth1(s,t2)==1)
			return false;
		if(matchMonth1(s,t1)==-1)
			return false;
			
		if(matchMonth1(s,t1)==0&&matchMonth1(s,t2)==-1){
			if(matchDay(s,t1)>=0)
				return true;
			else return false;
		}
	
		if(matchMonth1(s,t1)==1&&matchMonth1(s,t2)==0){
			if(matchDay(s,t2)<=0)
				return true;
			else return false;
		}
	}
	if(matchYear(s,t1)==1&&matchYear(s,t2)==0){
		if(matchMonth1(s,t2)==0){
			if(matchDay(s,t2)<=0)return true;
			else return false;
		}
		if(matchMonth1(s,t2)==-1)
			return true;
			
		if(matchMonth1(s,t2)==1)
			return false;
	}
	
	if(matchYear(s,t1)==0&&matchYear(s,t2)==-1){
		if(matchMonth1(s,t1)==0){
			if(matchDay(s,t1)>=0)
				return true;
			else return false;
		}
		if(matchMonth1(s,t1)==1)
			return true;
			
		if(matchMonth1(s,t1)==-1)
			return false;
	}
	
	return false;
	
		
}

function match2(s,t1,t2){                                                    
	if(matchYear(s,t1)==0&&matchYear(s,t2)==0){
		if(matchMonth2(s,t1)==0&&matchMonth2(s,t2)==0){
			if(matchDay(s,t1)==1&&matchDay(s,t2)==-1)
				return true;
			if(matchDay(s,t1)==1&&matchDay(s,t2)==0)
				return true;
			if(matchDay(s,t1)==1&&matchDay(s,t2)==1)
				return false;
		}
		
		if(matchMonth2(s,t2)==1)
			return false;
		if(matchMonth2(s,t1)==-1)
			return false;
			
		if(matchMonth2(s,t1)==0&&matchMonth2(s,t2)==-1){
			if(matchDay(s,t1)>=0)
				return true;
			else return false;
		}
	
		if(matchMonth2(s,t1)==1&&matchMonth2(s,t2)==0){
			if(matchDay(s,t2)<=0)
				return true;
			else return false;
		}
		if(matchMonth2(s,t1)==1&&matchMonth2(s,t2)==-1)
			return true;
	}
	if(matchYear(s,t1)==1&&matchYear(s,t2)==0){
		if(matchMonth2(s,t2)==0){
			if(matchDay(s,t2)<=0)return true;
			else return false;
		}
		if(matchMonth2(s,t2)==-1)
			return true;
			
		if(matchMonth2(s,t2)==1)
			return false;
	}
	
	if(matchYear(s,t1)==0&&matchYear(s,t2)==-1){
		if(matchMonth2(s,t1)==0){
			if(matchDay(s,t1)>=0)
				return true;
			else return false;
		}
		if(matchMonth2(s,t1)==1)
			return true;
			
		if(matchMonth2(s,t1)==-1)
			return false;
	}
	
	return false;
	
		
}



function spanArrange(begin,end,range){                       
	//console.log(begin);
	//if(timeNode.length>0)timeNode = [];
	while(1){
		//cc++;
		var tmp = [];
		var tmp1 = begin.slice();
		tmp.push(tmp1);
		begin[2]+=range;
		if(begin[0]==end[0]&&begin[1]==end[1]&&begin[2]>end[2])break;
		if(begin[2]>month[begin[1]-1]){
			begin[2] -= month[begin[1]-1];
			if(begin[1]==2&&begin[0]==2016)
				begin[2]-=1;
				
			begin[1] += 1;
			
			if(begin[1]==13){
				begin[0] += 1;
				begin[1]  = 1;
			}
		}
		
		tmp1 = begin.slice();
		tmp.push(tmp1);
		
		timeNode.push(tmp);
		//console.log(tmp);
	}
	//console.log(cc);
}
	
function labelArrange1(){
	for(var i=0;i<span.length;i++){
		for(var j=0;j<timeNode.length;j++){
		
			//if(i==31)
				//console.log(span[i]);
			
			//if(j==24)console.log(timeNode[j]);
			
			
			if(match1(span[i],timeNode[j][0],timeNode[j][1])){
				labels1[j].push(i);
				break;
			}
		}
	}
}

function labelArrange2(){
	for(var i=0;i<dateOfEvents.length;i++){
		for(var j=0;j<timeNode.length;j++){
			if(match2(dateOfEvents[i],timeNode[j][0],timeNode[j][1])){
				labels2[j].push(i);
				break;
			}
		}
	}
}

function plotArrange(data){
	for(var i=0;i<labels1.length;i++){
		if(labels1[i].length==0){
			values[i].push(0);
			values[i].push(0);
		}
		if(labels1[i].length==1){
			values[i].push(parseFloat(data[span[labels1[i][0]][3]]["value"]));
			values[i].push(parseFloat(data[span[labels1[i][0]][4]]["value"]));
			//console.log(span[labels1[i][0]]);
		}
		
		else if(labels1[i].length>1){
			var sum_h=0,sum_t=0;
			for(var j=0;j<labels1[i].length;j++){
				sum_h += parseFloat(data[span[labels1[i][j]][3]]["value"]);
				sum_t += parseFloat(data[span[labels1[i][j]][4]]["value"]);
			}
			sum_h /= labels1[i].length;
			sum_t /= labels1[i].length;
			
			values[i].push(sum_h);
			values[i].push(sum_t);
			
		}
	}
	
}