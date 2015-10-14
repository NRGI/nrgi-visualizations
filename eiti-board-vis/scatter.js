'use strict';
var d3;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var xScale = d3.scale.linear()
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);


var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.format(".0%"));

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickFormat(d3.format(".0%"));

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);



d3.csv("./data/scatter.csv", function (error, data) {
    // get the x and y values for least squares
    var xSeries = data.map(function (d) { return parseFloat(d.oda); }),
        ySeries = data.map(function (d) { return parseFloat(d.resource); }),

        // returns slope, intercept and r-square of the line
        leastSquaresCoeff = leastSquares(xSeries, ySeries),

        max = d3.max(data, function (d) { return d.oda; }),
        // apply the reults of the least squares regression
        x1 = 0.1,
        // var x1 = 0;
        y1 = leastSquaresCoeff[0] * 0.1 + leastSquaresCoeff[1],
        // var y1 = leastSquaresCoeff[1];
        x2 = (max - 0.2),
        y2 = leastSquaresCoeff[0] * (max - 0.2) + leastSquaresCoeff[1],
        trendData = [[x1, y1, x2, y2]];

    var trendline = svg.selectAll(".trendline")
        .data(trendData);

    trendline.enter()
        .append("line")
        .attr("class", "trendline")
        .attr("x1", function (d) { return xScale(d[0]); })
        .attr("y1", function (d) { return yScale(d[1]); })
        .attr("x2", function (d) { return xScale(d[2]); })
        .attr("y2", function (d) { return yScale(d[3]); })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("opacity", 0.3);

    data.forEach(function (d) {
        d.resource = +d.resource;
        d.oda = +d.oda;
    });

    xScale.domain(d3.extent(data, function (d) { return d.oda; })).nice();
    yScale.domain(d3.extent(data, function (d) { return d.resource; })).nice();

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("ODA as % of GDP");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Resource Revenue as % of GDP");

    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function (d) { return xScale(d.oda); })
        .attr("cy", function (d) { return yScale(d.resource); })
        .style("fill", "orange")
        .on("mouseover", mouseover)
        .on("mouseleave", mouseleave);
});

function mouseover(d) {
    var oda = (d.oda * 100).toFixed(2),
        resource = (d.resource * 100).toFixed(2),
        hover_element = this;

    d3.select('.tooltip')
        .transition()
        .duration(500)
        .style("opacity", 0.8);

    d3.select('.tooltip')
        .html("<h4>" + d.country + "</h4><small>ODA: " + oda + " %<br/>Resource revenue: " + resource + " %</small>")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");

    // Fade all the segments.
    d3.selectAll('.dot')
        .filter(function (d,i) {
            return (this !== hover_element);
        })
        .transition()
        .duration(500)
        .style('opacity', '0.5');

    d3.select(this).attr('opacity', '1.0');
}

function mouseleave() {
    d3.select('.tooltip')
        .transition()
        .duration(500)
        .style("opacity", 0);

    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll(".dot")
        .transition()
        .duration(500)
        .style("opacity", 1)
        .each("end", function () {
            d3.select(this).on("mouseover", mouseover);
        });
}

// returns slope, intercept and r-square of the line
function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function (prev, cur) { return prev + cur; },

        xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length,
        yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length,

        ssXX = xSeries.map(function (d) { return Math.pow(d - xBar, 2); })
            .reduce(reduceSumFunc),

        ssYY = ySeries.map(function (d) { return Math.pow(d - yBar, 2); })
            .reduce(reduceSumFunc),

        ssXY = xSeries.map(function (d, i) { return (d - xBar) * (ySeries[i] - yBar); })
            .reduce(reduceSumFunc),

        slope = ssXY / ssXX,
        intercept = yBar - (xBar * slope),
        rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
}