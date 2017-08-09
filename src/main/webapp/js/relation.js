function draw_relation(newsNumber, eventNumber) {
    var other_event_scale = 0.4;
    var base_length = 20;
    var extra_length = 40;
    var other_length = 20;
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
            raw_list4.push({
                source: raw_list3[i].target,
                target: raw_list3[j].target,
                value: relation_data[index_i][index_j]
            })
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
    for (var i = 0; i < eventNumber * other_event_scale; i++) {
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
    for (var i = 0; i < eventNumber; i++) {
        nodes.push({
            id: "n" + raw_list3[i].target,
            //group: 1
            group: Find(parent, raw_list3[i].target)
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
    var svg = d3.select("#relation").append("svg")
        .attr("width", $(window).width() * 0.15)
        .attr("height", $(window).height() * 0.385);
    var width = +svg.attr("width"),
        height = +svg.attr("height");

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



    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", function (d) {
            return 1;
        })
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6);

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function (d) {
            return color(d.group);
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", "1.5px")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title")
        .text(function (d) {
            return d.id;
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
