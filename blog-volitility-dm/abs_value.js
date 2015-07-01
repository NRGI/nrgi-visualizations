'use strict';
var d3;

var datafile = "./data/abs_data.csv";
var country_init = "Algeria";
var citation_text = "International Monetary Fund WEO";
var citation_url = "https://www.imf.org/external/pubs/ft/weo/2015/01/weodata/index.aspx";

var margin = {top: 20, right: 80, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var xScale = d3.time.scale()
    .range([0, width]);

var yScale = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#4f7184", "#ff6f4a"]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function (d) { return xScale(d.year); })
    .y(function (d) { return yScale(d.value); });

var parseDate = d3.time.format("%Y").parse;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("id", "container")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(datafile, function (error, data) {
    if (error) throw error;
    var opts = [],
        cat_names = [];

    data.sort(function (a, b) {
        return a.year - b.year;
    });

    data.forEach(function(d) {
        d.year = parseDate(d.year);
        if (opts.indexOf(d.country) < 0) {
            opts.push(d.country);
        }
      });
    opts.sort();

    for (var key in data[0]) {
      if (data[0].hasOwnProperty(key) && key !== 'iso' && key !== 'country' && key !== 'year') {
        cat_names.push(key);
      }
    }

    var data_init = data.filter(function (d) { return (d.country === country_init); });

    color.domain(d3.keys(data_init[0]).filter(function(key) { return key !== "year" && key !== 'country' && key !== 'iso';  }));

    var variables = color.domain().map(function(name) {
        if (name !== 'country' || name !== 'iso') {
            return {
              name: name,
              values: data_init.map(function(d) {
                return {year: d.year, value: +d[name]};
              })
            };    
        }
        
      });

    xScale.domain(d3.extent(data_init, function(d) { return d.year; }));

    yScale.domain([
        d3.min(variables, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
        d3.max(variables, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
    ]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Billions national currency");

    // var div = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    // d3.select("#container").on("mouseleave", mouseleave);

    var variable = svg.selectAll(".variable")
      .data(variables)
    .enter().append("g")
      .attr("class", "variable");

    variable.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });
        // .on("mouseover", mouseover);

    // d3.select("#chart_title")
    //     .text(country_init);
    d3.select("body").append("div")
        .attr("class", "citation")
        .style("width", width + "px")
        .html("<small><em>Graphic by: Chris Perry | Source: <a href='" + citation_url + "' target='_blank'>" + citation_text + "</a></em></small>");


    var legend = svg.selectAll(".legend")
        .data(variables)
        // .data(cat_names.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(-400," + i * 20 + ")"; });
    legend.append('circle')
        .attr('cx', width - 24)
        .attr('cy', 20)
        .attr('r', 7)
        .style('fill', function(d) { return color(d.name); });
    legend.append("text")
        .attr("x", width - 10)
        .attr("y", 20)
        .attr("dy", ".35em")
        .text(function (d) { return d.name; });

    var dropdown = d3.select("#dropdown").append("select")
        .attr("class", "form-control")
        .on("change", function change() {
            var value = this.value;

            d3.csv(datafile, function (error, data) {
                if (error) throw error;

                data.sort(function (a, b) {
                    return a.year - b.year;
                });

                data.forEach(function(d) {
                    d.year = parseDate(d.year);
                });

                data_init = data.filter(function (d) { return (d.country === value); });
                
                color.domain(d3.keys(data_init[0]).filter(function(key) { return key !== "year" && key !== 'country' && key !== 'iso';  }));

                var variables = color.domain().map(function(name) {
                    if (name !== 'country' || name !== 'iso') {
                        return {
                            name: name,
                            values: data_init.map(function(d) {
                                return {year: d.year, value: +d[name]};
                            })
                        };    
                    }
                });

                xScale.domain(d3.extent(data_init, function(d) { return d.year; }));
                yScale.domain([
                    d3.min(variables, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
                    d3.max(variables, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
                ]);
                var svg = d3.select("body").transition();

                variable.select(".line")
                  .data(variables)
                  .transition()
                  .duration(750)
                  .attr("d", function(d) { return line(d.values); });

                svg.select(".x.axis") // change the x axis
                    .duration(750)
                    .call(xAxis);
                svg.select(".y.axis") // change the y axis
                    .duration(750)
                    .call(yAxis);
            });
        });
    var options = dropdown.selectAll("option")
            .data(opts)
            .enter()
            .append("option")
            .property("selected", function (d) { return d === country_init; });
    options.text(function (d) { return d; })
         .attr("value", function (d) { return d; });

});

// function mouseover(d) {
//     var expend = numberWithCommas(d.value);

//     var hover_element = this;
//     console.log(d);

//     d3.select('.tooltip')
//         .transition()
//         .duration(500)
//         .style("opacity", 0.8);

//     d3.select('.tooltip')
//         .html("<h4>" + d.name + "</h4>")
//         .html("<h4>" + d.name + "</h4><small>$ USD " + d.value + "</small>")
//         .style("left", (d3.event.pageX) + "px")
//         .style("top", (d3.event.pageY - 28) + "px");

//     d3.selectAll('path')
//         .filter(function (d, i) {
//             return (this !== hover_element);
//         })
//         .transition('mouseover')
//         .duration(500)
//         .style('opacity','0.5');

//     d3.select(this).attr('opacity','1.0');
// }

// function mouseleave(d) {
//     d3.select('.tooltip')
//         .transition()
//         .duration(200)
//         .style("opacity", 0);

//       // Transition each segment to full opacity and then reactivate it.
//       d3.selectAll("rect")
//           .transition()
//           .duration(500)
//           .style("opacity", 1);
// }

// function numberWithCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }