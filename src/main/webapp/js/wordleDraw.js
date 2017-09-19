var word_number_max = 70;



function draw_wordle() {
    svg_4.selectAll("text").remove();
    var x = $(window).width() * 0.13;
    var y = $(window).height() * 0.1925;
    var w = $(window).width() * 0.27;
    var h = $(window).height() * 0.385;
    var mychoice = document.getElementById("noun-select").getAttribute("value");
    if (mychoice == "all") var json_by_news = json_by_news_all;
    else if (mychoice == "noun") var json_by_news = json_by_news_noun;
    var old_number = parseInt(document.getElementById("timeline_bottom").getAttribute("selectD"));
    old_number = old_number + 1;
    var tmp_string = old_number.toString();
    var newsNumber = "n" + tmp_string;
    //alert(tmp_string);
    //alert(typeof newsNumber);
    var news = json_by_news[newsNumber];
    var words = [];
    var maxTime = 0;
    //var select_list = $("#delete-words").val().split(" ");
    //console.log(document.getElementById("delete-words"));
    //console.log(document.getElementById("delete-words").getAttribute("value"));
    var select_list = document.getElementById("delete-words").getAttribute("value").split(" ");
    var select_set = {};
    for (var i = 0; i < select_list.length; i++) select_set[select_list[i]] = 0;
    for (var i in news) {
        if (i in select_set) continue;
        words.push({
            name: i,
            time: news[i]
        });
        if (news[i] > maxTime) maxTime = news[i];
    }
    words.sort(by("time"));

    //console.log(x);
    //var test = d3.layout.cloud();

    var delta = words.length - word_number_max;
    for (var i = 0; i < delta; i++) words.pop();

    var layout = d3.layout.cloud()
        .size([w, h])
        .words(words.map(function (d) {
            return {
                text: d.name,
                size: 10 + d.time * 20 / maxTime,
                test: "haha"
            };
        }))
        .padding(5)
        .rotate(function () {
            return -45 + Math.random() * 90;
        })
        .font("Impact")
        .fontSize(function (d) {
            return d.size;
        })
        .on("end", draw);

    layout.start();

    function by(name) {
        return function (o, p) {
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
            } else {
                throw ("error");
            }
        }
    }

    function draw(words) {

        for (var i = 0; i < words.length; i++)
            textToHighlight.push([]);

        wordleImage = svg_4.append("g")
            .attr("transform", "translate(" + x + "," + y + ")")
            .selectAll("text")
            .style("class", "wordleText")

            .data(words)
            .enter().append("text")
            .style("font-size", function (d, i) {
                textToHighlight[i].push(d.text);
                return d.size + "px";
            })
            .style("font-family", "Impact")

            .style("fill", function (d, i) {
                var fillColor = fill(i);
                textToHighlight[i].push(fillColor);
                return fillColor;
            })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) {
                return d.text;
            })
            .on("click", function (d, i) {



                // $(this).mouseup(function(){
                // $(this).css("fill","yellow");
                //});
                if (wordleSelected == -1) {
                    $(this).css("text-shadow", "5px 5px 5px #FFFFFF");
                    wordleSelected = i;
                } else if (wordleSelected != i) {
                    $("#div_5").find("text").css("text-shadow", "none");
                    $(this).css("text-shadow", "5px 5px 5px #FFFFFF");

                    wordleSelected = i;
                } else return;


                for (var i = 0; i < drawColor.length; i++)
                    for (var j = 0; j < drawColor[i].length; j++)
                        drawColor[i][j] = 0;

                var newsList = json_by_words[d.text];
                //pict_2(svg1,timeNode,labels2,jsonData,-1,start,end,0);
                //console.log(rects);
                for (var i = 0; i < newsList.length; i++) {
                    var index = parseInt(newsList[i].substring(1, 4)) - 101;
                    var tmpIndex = index;
                    //console.log(index);
                    var j = 0;
                    for (j = 0; j < timeNode.length; j++) {
                        if (tmpIndex >= labels2[j].length)
                            tmpIndex -= labels2[j].length;
                        else
                            break;
                    }

                    drawColor[j][tmpIndex] = 1;



                }
                updateDots(0, $(window).width() * 0.9)
                //svg.selectAll('rect').remove();
                //svg.selectAll('text').remove();
                //svg.selectAll('axis').remove();
                //svg.selectAll('tick').remove();
                //pict_2(svg1, timeNode, labels2, jsonData, -1, scaler, scaler + parseInt(timeNode.length * $(window).width() * 0.08 / ($(window).width() * 0.72)));

            })
            .on("dblclick", function (d, i) {
                var ul = document.getElementById("delete-words");
                var li = document.createElement("li");
                li.id = d.text;
                li.innerHTML = '<a href="#" onclick="delete_click.call(this)">' + d.text + '</a>';
                ul.appendChild(li);
                //console.log(ul.children);
                //var aaa = "";
                //console.log(ul.children.length);
                //console.log(ul.children);
                //console.log(ul.children[0].innerText);
                var deleteText = "";
                for (i = 0; i < ul.children.length; i++) {
                    deleteText = deleteText + ul.children[i].innerText + " ";
                }
                document.getElementById("delete-words").setAttribute("value", deleteText);
                go_fun();

            });




        var KeyWordIndex;
        var newsContent = $('#content').html();

        var tmpTextColor = [];
        for (var i = 0; i < newsContent.length; i++)
            tmpTextColor.push(-1);


        for (var i = 0; i < textToHighlight.length; i++) {
            KeyWordIndex = newsContent.indexOf(textToHighlight[i][0], 0);
            //console.log(KeyWordIndex);
            if (KeyWordIndex != -1) {


                for (var j = KeyWordIndex; j <= KeyWordIndex + textToHighlight[i][0].length; j++) {
                    tmpTextColor[j] = i;
                }
                var target = textToHighlight[i][0];

                newsContent = newsContent.slice(0, KeyWordIndex) + '<span class=class' + i + '>' + target + '</span>' + newsContent.slice(KeyWordIndex + textToHighlight[i][0].length, -1);




            }


        }
        document.getElementById("content").innerHTML = newsContent;

        for (var i = 0; i < textToHighlight.length; i++) {
            KeyWordIndex = newsContent.indexOf(textToHighlight[i][0], 0);

            if (KeyWordIndex != -1)
                $('.class' + i).css('color', textToHighlight[i][1]);
        }


    }



}
