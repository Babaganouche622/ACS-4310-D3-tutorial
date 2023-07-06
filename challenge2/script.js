// set the dimensions and margins of the graph
const margin = { top: 100, right: 0, bottom: 0, left: 0 },
  width = 900 - margin.left - margin.right,
  height = 1200 - margin.top - margin.bottom,
  innerRadius = 90,
  outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);


// handle form submit
document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();

  // get parameters from the user
  const filterType = document.getElementById("filterType").value;
  const filterValue = document.getElementById("filterValue").value;
  const filterOperator = document.getElementById("filterOperator").value;
  const sortType = document.getElementById("sortType").value;
  const sliceAmount = document.getElementById("sliceAmount").value;

  // update the chart
  updateChart(filterType, filterValue, filterOperator, sortType, sliceAmount);
});

// update the chart
function updateChart(filterType, filterValue, filterOperator, sortType, sliceAmount) {
  svg.selectAll("g").remove();
  //   // load the data
  d3.csv("./challenge2/MALratings.csv").then(function (data) {
    // console.log(data.map(d => parseInt(d.Title)));
    // X scale: common for 2 data series
    console.log(filterType, filterValue, filterOperator, sortType, sliceAmount)
    let filteredData = data
    .filter((d) => {
      // Convert filterValue to a number if it represents a numeric value

      // Perform the comparison based on the filterOperator
      switch (filterOperator) {
        case "=":
          return d[filterType] == filterValue;
        case ">":
          return d[filterType] > filterValue;
        case "<":
          return d[filterType] < filterValue;
        case ">=":
          return d[filterType] >= filterValue;
        case "<=":
          return d[filterType] <= filterValue;
      }
    })
      .sort((a, b) => a[sortType] - b[sortType])
      .slice(0, sliceAmount);

    const x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(filteredData.map(d => (d.Title))); // The domain of the X axis is the list of states.

    // Y scale outer variable
    const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([0, 20000]); // Domain of Y is from 0 to the max seen in the data

    // Second barplot Scales
    const ybis = d3.scaleRadial()
      .range([innerRadius, 5])   // Domain will be defined later.
      .domain([0, 10]);


    console.log(filteredData)
    console.log(data)
    // Add the bars
    svg.append("g")
      .selectAll("path")
      .data(filteredData)
      .join("path")
      .attr("fill", "#c4f8a2")
      .attr("class", "yo")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(d => y(parseInt(d['Popularity'])))
        .startAngle(d => x(d.Title))
        .endAngle(d => x(d.Title) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

    // Add the labels
    svg.append("g")
      .selectAll("g")
      .data(filteredData)
      .join("g")
      .attr("text-anchor", function (d) { return (x(d.Title) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function (d) { return "rotate(" + ((x(d.Title) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['Popularity']) + 10) + ",0)"; })
      .append("text")
      .text(d => d.Title)
      .attr("transform", function (d) { return (x(d.Title) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "11px")
      .style("fill", "#d346f3")
      .attr("alignment-baseline", "middle")

    // console.log(data.map(d => parseInt(d.Popularity)));
    // Add the second series
    svg.append("g")
      .selectAll("path")
      .data(filteredData)
      .join("path")
      .attr("fill", "#ff69b4")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
        .innerRadius(d => ybis(0))
        .outerRadius(d => ybis(parseInt(d['Score'])))
        .startAngle(d => x(d.Title))
        .endAngle(d => x(d.Title) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

  });
};
