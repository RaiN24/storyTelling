function draw_relation(selected_start, selected_end) {
    svg_6.selectAll("*").remove();
    var newsNumber = document.getElementById("timeline_bottom").getAttribute("selectD");
    newsNumber = parseInt(newsNumber) + 1;
    var eventNumber = 30;
    var other_event_scale = 0.4;
    var relavent_num = 0.75;
    var base_length = 30;
    var extra_length = 60;
    var other_length = 40;
    var parent = new Array(1500);
    for (var i = 0; i < parent.length; i++) parent[i] = -1;
    var raw_list1 = relation_data[newsNumber]; //raw_list1 is the list list of newsNumber
    var raw_list2 = []; //raw_list2 ia the object list of newsnumber
    var i;
    for (i = 1; i < raw_list1.length; i++) {
        if (i == newsNumber) continue;
        raw_list2.push({
            source: newsNumber,
            target: i,
            value: raw_list1[i]
        });
    }


    var start, end;
    start = 0;
    end = labels2.length;


    raw_list2.sort(by("value"));
    var raw_list3 = []; //raw_list3 ia the object list in eventNumber

    for (var i = 0; i < eventNumber; i++) {
        var tmp = $.extend(true, {}, raw_list2[i]);
        raw_list3.push(tmp);
    }

    var raw_list4 = []; //other events' relations
    for (var i = 0; i < eventNumber; i++) {
        for (var j = i + 1; j < eventNumber; j++) {
            var index_i = raw_list3[i].target;
            var index_j = raw_list3[j].target;
            if (relation_data[index_i][index_j] > relavent_num) {
                raw_list4.push({
                    source: raw_list3[i].target,
                    target: raw_list3[j].target,
                    value: relation_data[index_i][index_j]
                })
            }
        }
    }

    raw_list4.sort(by("value"));


    var max_value = raw_list2[0].value;
    var min_value = raw_list2[eventNumber - 1].value;

    for (var i = 0; i < eventNumber; i++) {
        var tmp_number = raw_list3[i].value;
        raw_list3[i].value = base_length + extra_length * ((max_value - tmp_number) / (max_value - min_value));
    }

    var raw_list5 = []; //for extra events
    for (var i = 0; i < raw_list4.length; i++) {
        var tmp_line = raw_list4[i];
        tmp_line.value = other_length;
        raw_list5.push(tmp_line);
    }
    for (var i = 0; i < raw_list5.length; i++) {
        Union(parent, raw_list5[i].source, raw_list5[i].target);
    }

    var nodes = [];
    var links = [];
    nodes.push({
        id: "n" + newsNumber,
        group: Find(parent, newsNumber)
    });

    var group_list = new Array(2000);
    for (var i = 0; i < group_list.length; i++) group_list[i] = Find(parent, newsNumber);
    var son_num_list = new Array(2000);
    for (var i = 0; i < son_num_list.length; i++) son_num_list[i] = 0;
    for (var i = 0; i < eventNumber; i++) {
        var parent_num = Find(parent, raw_list3[i].target);
        son_num_list[parent_num] += 1;
    }
    //console.log(son_num_list);
    for (var i = 0; i < eventNumber; i++) {
        var old_group = Find(parent, raw_list3[i].target);
        if (old_group != raw_list3[i].target | son_num_list[raw_list3[i].target] > 1)
            group_list[raw_list3[i].target] = Find(parent, raw_list3[i].target);
    }
    for (var i = 0; i < eventNumber; i++) {
        nodes.push({
            id: "n" + raw_list3[i].target,
            //group: 1
            //group: Find(parent, raw_list3[i].target)
            group: group_list[raw_list3[i].target]
        });
    }
    for (var i = 0; i < eventNumber; i++) {
        links.push({
            source: "n" + newsNumber,
            target: "n" + raw_list3[i].target,
            value: raw_list3[i].value
        });
    }
    for (var i = 0; i < raw_list5.length; i++) {
        //links.push(raw_list5[i]);
        links.push({
            source: "n" + raw_list5[i].source,
            target: "n" + raw_list5[i].target,
            value: raw_list5[i].value
        });
    }

    //string(1);

    //var svg = d3.select("svg_6");
    var width = +svg_6.attr("width"),
        height = +svg_6.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
            .id(function (d) {
                return d.id;
            })
            .distance(function (d) {
                return d.value;
            }))
        //.force("link", d3.forceLink().distance(function(d) {
        //    return d.value;
        //}))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));



    var link = svg_6.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return 1;
        })
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6);

    var node = svg_6.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 6)
        .attr("fill", function (d) {
            return color(d.group);
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", "1.5px")
        .on("click", function (d, i) {
            //接口
            //d.id即为事件编号，例如"n15"为15号事件。
            //可使用parseInt(d.id.substring(1))转化为int变量
            //编号与你在Data里的相同，可参考下面几行的node.append("title")添加标题的代码
            //接口结束

            //console.log([start,end]);


            for (var h = start; h < end; h++)
                for (var t = 0; t < labels2[h].length; t++)
                    rectSelected[h][t] = 0;


            var j = parseInt(d.id.substring(1));
            var flag = 0;
            //console.log(j);
            for (var h = 0; h < labels2.length; h++) {
                for (var k = 0; k < labels2[h].length; k++) {
                    if (labels2[h][k] === j) {
                        flag = 1;
                        //console.log([h,k]);
                        break;
                    }
                }
                if (flag)
                    break;
            }

            //console.log(j);
            //console.log([h,k]);

            document.getElementById("timeline_bottom").setAttribute("selectD", parseInt(d.id.substring(1)));
            document.getElementById("timeline_bottom").setAttribute("selectI", k);
            var newsContent = document.getElementById("content");



            /*for (var h = start; h < end; h++)
                if (labels2[h][k] == parseInt(d.id.substring(1)))
                    break;*/


            //console.log([h,k]);
            rectSelected[h][k] = 1;
            //console.log(rectSelected);

            newsContent.innerHTML = Data[parseInt(d.id.substring(1))]["content"];
            //globalContent = data[tmpStr[i]]["content"];
            var h = $("#div_5").height();
            $("#content").animate({
                height: h
            }, 10);
            $("#content").css("font-size", 12);
            $("#content").css("color", "rgb(20,68,106)");

            updateDots(0, $(window).width() * 0.99);

            draw_wordle();
            draw_relation();
            drawReason();
            var legend = document.querySelector('.legend');
            Ps.initialize(legend);


        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function (d) {
            var tmp = parseInt(d.id.substring(1));
            return news_title[tmp];
        });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        link
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    function Find(parent, i) {
        if (parent[i] == -1) return i;
        return Find(parent, parent[i]);
    }

    function Union(parent, x, y) {
        var xset = Find(parent, x);
        var yset = Find(parent, y);
        if (xset == yset) return;
        parent[xset] = yset;
    }

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

}
