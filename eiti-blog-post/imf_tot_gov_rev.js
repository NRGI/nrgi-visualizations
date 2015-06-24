'use strict';
var d3;

var datafile = "./data/imf_tot_gov_rev.json";
var country_init = "Guinea";
var citation_text = "International Monetary Fund";
var citation_url = "http://www.imf.org/external/data.htm";


var margin = {top: 20, right: 20, bottom: 30, left: 40},
    // width = parseInt(d3.select('#chart').style('width'), 10),
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#4f7184", "#ff6f4a"]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format('s'));

      // Change D3's SI prefix to more business friendly units
      //      K = thousands
      //      M = millions
      //      B = billions
      //      T = trillion
      //      P = quadrillion
      //      E = quintillion
      // small decimals are handled with e-n formatting.
var d3_formatPrefixes = ["e-24", "e-21", "e-18", "e-15", "e-12", "e-9", "e-6", "e-3", "", "K", "M", "B", "T", "P", "E", "Z", "Y"].map(d3_formatPrefix);

// Override d3's formatPrefix function
d3.formatPrefix = function (value, precision) {
    var i = 0;
    if (value) {
        if (value < 0) {
            value *= -1;
        }
        if (precision) {
            value = d3.round(value, d3_format_precision(value, precision));
        }
        i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
        i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
    }
    return d3_formatPrefixes[8 + i / 3];
};

function d3_formatPrefix(d, i) {
    var k = Math.pow(10, Math.abs(8 - i) * 3);
    return {
        scale: i > 8 ? function (d) { return d / k; } : function (d) { return d * k; },
        symbol: d
    };
}

function d3_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
}

// d3.csv(datafile, function (error, data) {
d3.json(datafile, function (error, data) {

    var groupSpacing = 0,
        opts = [],
        years = [],
        cat_names = [];

    data.sort(function (a, b) {
        return a.year - b.year;
    });

    data.forEach(function (el) {
        if (opts.indexOf(el.name) < 0) {
            opts.push(el.name);
        }
        if (years.indexOf(el.year) < 0) {
            years.push(el.year);
        }
    });
    opts.sort();
    years.sort();

    data[0].cats.forEach(function (el) {
        cat_names.push(el.name);
    });

    var data_init = data.filter(function (d) { return (d.name === country_init); });

    x0.domain(years.map(function (d) { return d; }));
    x1.domain(cat_names).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data_init, function (d) { return d3.max(d.cats, function (d) { return d.value; }); })]);
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.select("#container").on("mouseleave", mouseleave);

    var year = svg.selectAll(".year")
        .data(data)
        .enter().append("g")
        .filter(function (d) { return (d.name === country_init); })
        .attr("class", "g")
        .attr("name", function (d) { return d.year; })
        .attr("transform", function (d) { return "translate(" + x0(d.year) + ",0)"; });

    year.selectAll("rect")
        .data(function (d) { return d.cats; })
        .enter().append("rect")
        .attr("width", x1.rangeBand() - groupSpacing)
        .attr("class", "year")
        .attr("x", function (d) { return x1(d.name); })
        .attr("y", function (d) { return y(d.value); })
        .attr("height", function (d) { return height - y(d.value); })
        .style("fill", function (d) { return color(d.name); })
        .on("mouseover", mouseover);

    d3.select("#chart_title")
        .text(country_init);

    d3.select("body").append("div")
        .attr("class", "citation")
        .style("width", width + "px")
        .html("<small><em>Graphic by: Chris Perry | Source: <a href='" + citation_url + "' target='_blank'>" + citation_text + "</a> and the <a href='http://www.resourcegovernance.org/sites/default/files/nrgi_EITIDataset_20150608.xlsx'>NRGI EITI Dataset</a></em></small>");

    var legend = svg.selectAll(".legend")
        .data(cat_names.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(-600," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("y", 10)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 20)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d + " (US$)"; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("$ USD");

    var dropdown = d3.select("#dropdown").append("select")
        .attr("class", "form-control")
        .on("change", function change() {
            var value = this.value;

            d3.select("#chart_title")
                .text(value);

            var new_data = data.filter(function (d) { return (d.name === value); });

            year.data(new_data);

            y.domain([0, d3.max(new_data, function (d) { return d3.max(d.cats, function (d) { return d.value; }); })]);

            year.selectAll("rect")
                .data(function (d) { return d.cats; })
                .transition('barchange')
                .duration(1000)
                .attr("x", function (d) { return x1(d.name); })
                .attr("y", function (d) { return y(d.value); })
                .attr("height", function (d) { return height - y(d.value); })
                .style("fill", function (d) { return color(d.name); });

            svg.selectAll(".axis").filter(".y")
                .transition().duration(1000)
                .call(yAxis);

        });

    var options = dropdown.selectAll("option")
            .data(opts)
            .enter()
            .append("option")
            .property("selected", function (d) { return d === country_init; });

    options.text(function (d) { return d; })
         .attr("value", function (d) { return d; });
});

function mouseover(d) {
    var expend = numberWithCommas(d.value);

    var hover_element = this;

    d3.select('.tooltip')
        .transition('tooltip')
        .duration(500)
        .style("opacity", 0.8);

    d3.select('.tooltip')
        .html("<h4>" + d.name + "</h4>")
        .html("<h4>" + d.name + "</h4><small>$ USD " + expend + "</small>")
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");

    d3.selectAll('rect')
        .filter(function(d,i) {
            return (this !== hover_element);
        })
        .transition()
        .duration(500)
        .style('opacity','0.5');

    d3.select(this).attr('opacity','1.0');
}

function mouseleave(d) {
    d3.select('.tooltip')
        .transition()
        .duration(200)
        .style("opacity", 0);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll("rect")
          .transition()
          .duration(500)
          .style("opacity", 1);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}