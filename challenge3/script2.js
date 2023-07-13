const margin = { top: 20, right: 20, bottom: 50, left: 40 };
const width = window.innerWidth - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Append the svg object to the "my_dataviz2" class
const svg = d3
  .select("#my_dataviz2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Define the Y axis scale
const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

// Read the data from the CSV file
d3.csv("./genres_v2.csv").then(function (data) {
  // Create the bars
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (width / data.length))
    .attr("y", (d) => yScale(d.value))
    .attr("width", width / data.length)
    .attr("height", (d) => height - yScale(d.value))
    .attr("fill", "steelblue");
  
  // Create the Y axis
  const yAxis = d3.axisLeft(yScale);
  svg.append("g").call(yAxis);
});
