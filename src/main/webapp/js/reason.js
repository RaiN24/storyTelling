var reason_num = 20;
var s_date = 440,
    e_date = 470;


function distQuant(data, id) {

    function getPoints(_, i) {
        return _.map(function (d, j) {
            return {
                x: j,
                y: d[i]
            };
        });
    }
    /* function to return 0 for all attributes except k-th attribute.*/
    function getPointsZero(_, i, k) {
        return _.map(function (d, j) {
            return {
                x: j,
                y: (i == k ? d[i] : 0)
            };
        });
    }

    function toComma(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var width = $(window).width() * 0.15,
        height = $(window).height() * 0.25,
        margin = 20;
    var colors = ["#7D74FE", "#7DFF26", "#F84F1B", "#28D8D5", "#FB95B6", "#9D9931", "#F12ABF", "#27EA88", "#549AD5", "#FEA526", "#7B8D8B", "#BB755F", "#432E16",
                "#D75CFB", "#44E337", "#51EBE3", "#ED3D24", "#4069AE", "#E1CC72", "#E33E88", "#D8A3B3", "#428B50", "#66F3A3", "#E28A2A", "#B2594D", "#609297", "#E8F03F", "#3D2241",
                "#954EB3", "#6A771C", "#58AE2E", "#75C5E9", "#BBEB85", "#A7DAB9", "#6578E6", "#932C5F", "#865A26", "#CC78B9", "#2E5A52", "#8C9D79", "#9F6270", "#6D3377", "#551927", "#DE8D5A",
                "#E3DEA8", "#C3C9DB", "#3A5870", "#CD3B4F", "#E476E3", "#DCAB94", "#33386D", "#4DA284", "#817AA5", "#8D8384", "#624F49", "#8E211F", "#9E785B", "#355C22", "#D4ADDE",
                "#A98229", "#E88B87", "#28282D", "#253719", "#BD89E1", "#EB33D8", "#6D311F", "#DF45AA", "#E86723", "#6CE5BC", "#765175", "#942C42", "#986CEB", "#8CC488", "#8395E3",
                "#D96F98", "#9E2F83", "#CFCBB8", "#4AB9B7", "#E7AC2C", "#E96D59", "#929752", "#5E54A9", "#CCBA3F", "#BD3CB8", "#408A2C", "#8AE32E", "#5E5621", "#ADD837", "#BE3221", "#8DA12E",
                "#3BC58B", "#6EE259", "#52D170", "#D2A867", "#5C9CCD", "#DB6472", "#B9E8E0", "#CDE067", "#9C5615", "#536C4F", "#A74725", "#CBD88A", "#DF3066", "#E9D235", "#EE404C", "#7DB362",
                "#B1EDA3", "#71D2E1", "#A954DC", "#91DF6E", "#CB6429", "#D64ADC"
            ];

    function draw(type) {
        var maxT = d4.max(data[type].map(function (d) {
            return d4.sum(d);
        }));

        function tW(d) {
            return x(d * (data[type].length - 1) / 50);
        }

        function tH(d) {
            return y(d * maxT / 50);
        }

        var svg = d4.select("#" + id).select("." + type);

        //x and y axis maps.
        var x = d4.scale.linear().domain([0, data[type].length - 1]).range([0, width]);
        var y = d4.scale.linear().domain([0, maxT]).range([height, 0]);

        //draw yellow background for graph.
        svg.append("rect").attr("x", 0).attr("y", 0).attr("width", width).attr("height", height).style("fill", "rgba(56,56,56,0.96)");

        // draw vertical lines of the grid.
        svg.selectAll(".vlines").data(d4.range(51)).enter().append("line").attr("class", "vlines")
            .attr("x1", tW).attr("y1", 0)
            .attr("x2", tW).attr("y2", function (d, i) {
                return d % 10 == 0 && d != 50 ? height + 12 : height;
            });

        //draw horizontal lines of the grid.
        svg.selectAll(".hlines").data(d4.range(51)).enter().append("line").attr("class", "hlines")
            .attr("x1", function (d, i) {
                return d % 10 == 0 && d != 50 ? -12 : 0;
            })
            .attr("y1", tH).attr("x2", width).attr("y2", tH);

        // make every 10th line in the grid darker.	
        svg.selectAll(".hlines").filter(function (d) {
            return d % 10 == 0
        }).style("stroke-opacity", 0.7);
        svg.selectAll(".vlines").filter(function (d) {
            return d % 10 == 0
        }).style("stroke-opacity", 0.7);

        function getHLabel(d, i) {
            if (type == "dist") { // for distribution graph use the min and max to get the 5 label values.
                var r = data.distMin + i * (data.distMax - data.distMin) / 5;
                return Math.round(r * 100) / 100;
            } else { // for quantile graph, use label 20, 40, 60, and 80.
                //return (i * 20) + ' %';
                //var Ymd = d4.time.format("%Y-%m-%d");
                var Ymd = d4.time.format("%m-%d");
                var i_date = new Date('2015, 06, 01, 00:00:00');
                i_date.setDate(i_date.getDate() + s_date);
                i_date.setDate(i_date.getDate() + (e_date - s_date) / 5 * i);
                return Ymd(i_date);
            }
        }

        function getVLabel(d, i) {
            if (type == "dist") { // for dist use the maximum for sum of frequencies and divide it into 5 pieces.
                return Math.round(maxT * i / 5);
            } else { // for quantile graph, use percentages in increments of 20%.
                return (i * 20) + ' %';
            }
        }
        // add horizontal axis labels
        svg.append("g").attr("class", "hlabels")
            .selectAll("text").data(d4.range(41).filter(function (d) {
                return d % 10 == 0
            })).enter().append("text")
            .text(getHLabel).attr("x", function (d, i) {
                return tW(d) + 5;
            }).attr("y", height + 14);

        // add vertical axes labels.
        svg.append("g").attr("class", "vlabels")
            .selectAll("text").data(d4.range(41).filter(function (d) {
                return d % 10 == 0
            })).enter().append("text")
            .attr("transform", function (d, i) {
                return "translate(-10," + (tH(d) - 14) + ")rotate(-90)";
            })
            .text(getVLabel).attr("x", -10).attr("y", function (d) {
                return 5;
            });

        var area = d4.svg.area().x(function (d) {
                return x(d.x);
            })
            .y0(function (d) {
                return y(d.y0);
            })
            .y1(function (d) {
                return y(d.y0 + d.y);
            })
            .interpolate("basis");

        var layers = d4.layout.stack().offset("zero")(data.dP.map(function (d, i) {
            return getPoints(data[type], i);
        }));

        svg.selectAll("path").data(layers).enter().append("path").attr("d", area)
            .style("fill", function (d, i) {
                return colors[i];
            })
            .style("stroke", function (d, i) {
                return colors[i];
            });

        //draw a white rectangle to hide and to show some statistics.
        var stat = svg.append("g").attr("class", "stat");

        stat.append("rect").attr("x", -margin).attr("y", -margin)
            .attr("width", width + 2 * margin).attr("height", margin).style("fill", "white");

        // show sum and mean in statistics
        if (type == "dist") {
            stat.append("text").attr("class", "count").attr("x", 20).attr("y", -6)
                .text(function (d) {
                    var sum = d4.sum(data.dP.map(function (s) {
                        return s[2];
                    }));
                    return "Count: " + toComma(sum) + " / " + toComma(sum) + " ( 100 % )";
                });

            stat.append("text").attr("class", "mean").attr("x", 250).attr("y", -6)
                .text(function (d) {
                    return "Mean: " + data.mean;
                });
        }
    }

    function transitionIn(type, p) {
        var maxT = d4.max(data[type].map(function (d) {
            return d4.sum(d);
        }));
        var max = d4.max(data[type].map(function (d) {
            return d[p];
        }));

        var x = d4.scale.linear().domain([0, data[type].length - 1]).range([0, width]);
        var y = d4.scale.linear().domain([0, max]).range([height, 0]);

        function tW(d) {
            return x(d * (data[type].length - 1) / 50);
        }

        function tH(d) {
            return y(d * maxT / 50);
        }

        var area = d4.svg.area().x(function (d) {
                return x(d.x);
            })
            .y0(function (d) {
                return y(d.y0);
            })
            .y1(function (d) {
                return y(d.y0 + d.y);
            })
            .interpolate("basis");

        var layers = d4.layout.stack().offset("zero")(data.dP.map(function (d, i) {
            return getPointsZero(data[type], i, p);
        }));
        var svg = d4.select("#" + id).select("." + type);
        //transition all the lines, labels, and areas.
        svg.selectAll("path").data(layers).transition().duration(500).attr("d", area);

        svg.selectAll(".vlines").transition().duration(500).attr("x1", tW).attr("x2", tW);
        svg.selectAll(".hlines").transition().duration(500).attr("y1", tH).attr("y2", tH);
        svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
            .attr("transform", function (d, i) {
                return "translate(-10," + (tH(d) - 14) + ")rotate(-90)";
            });

        //update the statistics rect for distribution graph.
        if (type == "dist") {
            svg.select(".stat").select(".count")
                .text(function (d) {
                    var sumseg = data.dP[p][2];
                    var sum = d4.sum(data.dP.map(function (s) {
                        return s[2];
                    }));
                    return "Count: " + toComma(sumseg) + " / " + toComma(sum) + " ( " + Math.round(100 * sumseg / sum) + " % )";
                });
            svg.select(".stat").select(".mean").text(function (d) {
                return "Mean: " + data.dP[p][1];
            });
        }
    }

    function transitionOut(type) {
        var maxT = d4.max(data[type].map(function (d) {
            return d4.sum(d);
        }));

        function tW(d) {
            return x(d * (data[type].length - 1) / 50);
        }

        function tH(d) {
            return y(d * maxT / 50);
        }

        var x = d4.scale.linear().domain([0, data[type].length - 1]).range([0, width]);
        var y = d4.scale.linear().domain([0, maxT]).range([height, 0]);

        var area = d4.svg.area().x(function (d) {
                return x(d.x);
            })
            .y0(function (d) {
                return y(d.y0);
            })
            .y1(function (d) {
                return y(d.y0 + d.y);
            })
            .interpolate("basis");
        var layers = d4.layout.stack().offset("zero")(data.dP.map(function (d, i) {
            return getPoints(data[type], i);
        }));

        // transition the lines, areas, and labels.
        var svg = d4.select("#" + id).select("." + type);
        svg.selectAll("path").data(layers).transition().duration(500).attr("d", area);
        svg.selectAll(".vlines").transition().duration(500).attr("x1", tW).attr("x2", tW);
        svg.selectAll(".hlines").transition().duration(500).attr("y1", tH).attr("y2", tH);
        svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
            .attr("transform", function (d, i) {
                return "translate(-10," + (tH(d) - 14) + ")rotate(-90)";
            });

        // for distribution graph, update the statistics rect.
        if (type == "dist") {
            svg.select(".stat").select(".count")
                .text(function (d) {
                    var sum = d4.sum(data.dP.map(function (s) {
                        return s[2];
                    }));
                    return "Count: " + toComma(sum) + " / " + toComma(sum) + " ( 100 % )";
                });
            svg.select(".stat").select(".mean").text(function (d) {
                return "Mean: " + data.mean;
            });
        }
    }

    function mouseoverLegend(_, p) {
        //transitionIn("dist", p);
        transitionIn("quant", p);
    }

    function mouseoutLegend() {
        //transitionOut("dist");
        transitionOut("quant");
    }
    // add title.
    //d4.select("#" + id).append("h3").text(data.title);

    // add svg and set attributes for distribution.
    //d4.select("#" + id).append("svg").attr("width", width + 2 * margin).attr("height", height + 2 * margin)
    //.append("g").attr("transform", "translate(" + margin + "," + margin + ")").attr("class", "dist");

    //add svg and set attributes for quantil.
    d4.select("#" + id).append("svg").attr("width", width + 2 * margin).attr("height", height + 2 * margin)
        .append("g").attr("transform", "translate(" + margin + "," + margin + ")").attr("class", "quant");

    // Draw the two graphs.
    //draw("dist");
    draw("quant");

    // draw legends.
    var legRow = d4.select("#" + id).append("div").attr("class", "legend")
        .append("table").selectAll("tr").data(data.dP).enter().append("tr").append("td");
    legRow.append("div").style("background", function (d, i) {
            return colors[i];
        })
        .on("mouseover", mouseoverLegend).on("mouseout", mouseoutLegend).style("cursor", "pointer");

    legRow.append("span").text(function (d) {
            return d[0];
        })
        .on("mouseover", mouseoverLegend).on("mouseout", mouseoutLegend).style("cursor", "pointer");
}

function drawReason() {

    var dqData = [];
    dqData.push({
        title: 'Reason',
        dP: [],
        quant: []
    })

    var tmpsum1, tmpsum2, i, j;
    var word_dic = {},
        word_list_tmp = [];

    for (i = 0; i < mydata.length; i++) {
        tmpsum1 = tmpsum2 = 0;
        for (j in mydata[i]) {
            if (mydata[i][j] > 0) tmpsum1 += mydata[i][j];
            else tmpsum2 += mydata[i][j];
        }
        tmpsum2 = -tmpsum2;
        for (j in mydata[i]) {
            if (mydata[i][j] > 0) mydata[i][j] = mydata[i][j] * 100 / tmpsum1;
            else mydata[i][j] = mydata[i][j] * 100 / tmpsum2;
        }
    }

    for (i = s_date; i < e_date; i++) {
        for (j in mydata[i]) {
            if (j in word_dic) word_dic[j] += mydata[i][j];
            else word_dic[j] = mydata[i][j];
        }
    }
    for (j in word_dic) {
        if (isNaN(word_dic[j])) word_dic[j] = 0;
    }

    for (i in word_dic) {
        word_list_tmp.push({
            name: i,
            number: word_dic[i]
        });
    }
    word_list_tmp.sort(by("number"));
    var word_list = [];
    for (i = 0; i < reason_num; i++) {
        var tmp = $.extend(true, {}, word_list_tmp[i]);
        word_list.push(tmp);
    }
    //console.log(word_list);
    for (i = 0; i < reason_num; i++) {
        dqData[0].dP.push([]);
        dqData[0].dP[i].push(word_list[i].name);
    }
    word_list = [];
    for (i = 0; i < reason_num; i++) {
        word_list.push(dqData[0].dP[i][0]);
    }

    for (i = 0; i < e_date - s_date; i++) {
        dqData[0].quant.push([]);
        for (j = 0; j < reason_num; j++) {
            if (word_list[j] in mydata[i + s_date]) dqData[0].quant[i].push(mydata[i + s_date][word_list[j]]);
            else dqData[0].quant[i].push(0);
        }
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

    var seg = d4.select("#reason").selectAll("div").data(d4.range(dqData.length)).enter()
        .append("div").attr("id", function (d, i) {
            return "segment" + i;
        }).attr("class", "distquantdiv");

    d4.range(dqData.length).forEach(function (d, i) {
        distQuant(dqData[i], "segment" + i);
    });
}
