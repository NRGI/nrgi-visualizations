'use strict';
var d3;

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    radius = Math.min(width, height) / 2,
    color = d3.scale.category10();


var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "container")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var arc = d3.svg.arc()
    .startAngle(function (d) { return d.x; })
    .endAngle(function (d) { return d.x + d.dx - 0.01 / (d.depth + 0.5); })
    .innerRadius(function (d) { return radius / 3 * d.depth; })
    .outerRadius(function (d) { return radius / 3 * (d.depth + 1) - 1; });

svg.append("svg:circle")
        .attr("r", radius)
        .style("opacity", 0);

// var pie = d3.layout.pie()
//     .sort(null)
//     .value(function (d) { return d.revenues; });
var partition = d3.layout.partition()
    .sort(function (a, b) { return d3.ascending(a.name, b.name); })
    .size([2 * Math.PI, radius]);

var div = d3.select("#chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.select("#container").on("mouseleave", mouseleave);

d3.json("./data/donut.json", function (error, root) {
    // var node = data;

  // Compute the initial layout on the entire tree to sum sizes.
  // Also compute the full name and fill color for each node,
  // and stash the children so they can be restored as we descend.
    partition
        .value(function (d) { return d.value; })
        .nodes(root)
        .forEach(function (d) {
            d._children = d.children;
            d.sum = d.value;
            d.key = key(d);
            d.fill = fill(d);
        });

    // Now redefine the value function to use the previously-computed sum.
    partition
        .children(function (d, depth) { return depth < 2 ? d._children : null; })
        .value(function (d) { return d.sum; });

    var center = svg.append("circle")
        .attr("r", radius / 3)
        .on("click", zoomOut)
        .style("fill", "white");

    center.append("title")
        .text("zoom out");

    var path = svg.selectAll("path")
        .data(partition.nodes(root).slice(1))
        .enter().append("path")
        .attr("d", arc)
        .style("fill", function (d) { return d.fill; })
        .each(function (d) { this._current = updateArc(d); })
        .on("click", zoomIn)
        .on("mouseover",mouseover);

    path.append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function (d) { return d.name; });


    function zoomIn(p) {
        if (p.depth > 1) { p = p.parent; }
        if (!p.children) { return; }
        zoom(p, p);
    }

    function zoomOut(p) {
        if (!p.parent) { return; }
        zoom(p.parent, p);
    }

    // Zoom to the specified new root.
    function zoom(root, p) {
        if (document.documentElement.__transition__) { return; }

        // Rescale outside angles to match the new layout.
        var enterArc,
            exitArc,
            outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);

        function insideArc(d) {
          return p.key > d.key
                ? {depth: d.depth - 1, x: 0, dx: 0} : p.key < d.key
                ? {depth: d.depth - 1, x: 2 * Math.PI, dx: 0}
                : {depth: 0, x: 0, dx: 2 * Math.PI};
        }

        function outsideArc(d) {
            return {depth: d.depth + 1, x: outsideAngle(d.x), dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)};
        }

        center.datum(root);

        // When zooming in, arcs enter from the outside and exit to the inside.
        // Entering outside arcs start from the old layout.
        if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);

        path = path.data(partition.nodes(root).slice(1), function (d) { return d.key; });

        // When zooming out, arcs enter from the inside and exit to the outside.
        // Exiting outside arcs transition to the new layout.
        if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);

        d3.transition().duration(d3.event.altKey ? 7500 : 750).each(function () {
            path.exit().transition()
                .style("fill-opacity", function (d) { return d.depth === 1 + (root === p) ? 1 : 0; })
                .attrTween("d", function (d) { return arcTween.call(this, exitArc(d)); })
                .remove();

            path.enter().append("path")
                .style("fill-opacity", function (d) { return d.depth === 2 - (root === p) ? 1 : 0; })
                .style("fill", function (d) { return d.fill; })
                .on("click", zoomIn)
                .each(function (d) { this._current = enterArc(d); });

            path.transition()
                .style("fill-opacity", 1)
                .attrTween("d", function (d) { return arcTween.call(this, updateArc(d)); });
        });
    }
});

function mouseover(d) {
    var revenue = numberWithCommas(d.value);

    d3.select('.tooltip')
        .transition()
        .duration(200)
        .style("opacity", .8);
    d3.select('.tooltip')
        .html("<h4>" + d.name + "</h4><small>Revenue: $ " + revenue + "</small>")  
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

function key(d) {
  var k = [], p = d;
  while (p.depth) k.push(p.name), p = p.parent;
  return k.reverse().join(".");
}

function fill(d) {
  var p = d;
  while (p.depth > 1) p = p.parent;
  return color(p.name);
}

function arcTween(b) {
  var i = d3.interpolate(this._current, b);
  this._current = i(0);
  return function (t) {
    return arc(i(t));
  };
}

function updateArc(d) {
  return {depth: d.depth, x: d.x, dx: d.dx};
}

// d3.select(self.frameElement).style("height", margin.top + margin.bottom + "px");
d3.select(self.frameElement).style("height", height + "px");