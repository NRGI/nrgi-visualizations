'use strict';
var d3;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category10();

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 150);

var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) { return d.revenues; });

var svg = d3.select("#chart1").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

svg.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.select("#container").on("mouseleave", mouseleave);

d3.csv("./data/donut.csv", function (error, data) {
  console.log(data);

  var node = data;

  data.forEach(function (d) {
    d.revenues = +d.revenues;
  });

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc")
      .on("mouseover", mouseover);

  g.append("path")
      .attr("d", arc)
      .style("fill", function (d) { return color(d.data.country); });

  g.append("text")
      .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function (d) { return d.data.country; });

});

function mouseover(d) {
    var revenue = numberWithCommas(d.data.revenues);

    d3.select('.tooltip')
        .transition()
        .duration(200)
        .style("opacity", .8);
    d3.select('.tooltip')
        .html("<h4>" + d.data.country + "</h4><small>Revenue: $ " + revenue + "</small>")  
        .style("left", (d3.event.pageX) + "px")     
        .style("top", (d3.event.pageY - 28) + "px");
  
  var sequenceArray = getAncestors(d);

  // Fade all the segments.
  d3.selectAll("path")
      .style("opacity", 0.3);
  
  svg.selectAll("path")
      .filter(function (node) {
        return (sequenceArray.indexOf(node) >= 0);
      })
      .style("opacity", 1);

  // // Then highlight only those that are an ancestor of the current segment.
  // svg.selectAll("path")
  //     .filter(function (node) {
  //               return (sequenceArray.indexOf(node) >= 0);
  //             })
  //     .style("opacity", 1);
  
}

function mouseleave(d) {
  d3.select('.tooltip')
      .transition()
      .duration(200)
      .style("opacity", 0);

  // Deactivate all segments during transition.
  d3.selectAll("path").on("mouseover", null);

  // Transition each segment to full opacity and then reactivate it.
  d3.selectAll("path")
      .transition()
      .duration(1000)
      .style("opacity", 1)
      .each("end", function () {
        d3.select(this).on("mouseover", mouseover);
      });
}

function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}