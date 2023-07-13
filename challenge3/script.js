const margin = { top: 100, right: 0, bottom: 0, left: 0 },
  width = 900 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom,
  innerRadius = 120,
  outerRadius = Math.min(width, height) / 2;

// append the svg object
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${width / 2 + margin.left}, ${height / 2 + margin.top})`);


const spotifyPlayer = document.getElementById("spotifyPlayer");
const iframe = document.getElementsByTagName("iframe")[0];

const genres = document.getElementById("genres");
let genre = "Pop";
d3.csv("./challenge3/genres_v2.csv").then(function (data) {
  let filteredGenres = data
    .map(d => d.genre)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.sortOption - b.sortOption)

  filteredGenres.forEach((genre) => {
    const option = document.createElement("option");
    if (genre === genre.toLowerCase()) {
      return
    }
    option.value = genre;
    option.text = genre;
    if (genre === "Pop") {
      option.selected = true;
    }
    genres.appendChild(option);
  });
});

let sortOption = "danceability";

const sortDanceability = document.getElementById("Danceability");
sortDanceability.addEventListener("click", function (event) {
  sortOption = "danceability";
  toggleData();
});

const sortLoudness = document.getElementById("Loudness");
sortLoudness.addEventListener("click", function (event) {
  sortOption = "loudness";
  toggleData();
});

genres.addEventListener("change", function (event) {
  genre = event.target.value;
  toggleData();
});

let songSelection;
function songTable(data) {
    filteredData2 = data
      .filter((d) => d.id === songSelection)
    // build a table with D3 that displays the data from the filteredData2 array
    d3.select("#my_dataviz2").html("");

    // Create table element
    const table = d3.select("#my_dataviz2")
      .append("table")
  
    // Create table headers
    const thead = table.append("thead");
    const headerRow = thead.append("tr");
    
    console.log(filteredData2)
    Object.keys(filteredData2[0]).forEach((key) => {
      if (key === "title" || key === "Unnamed: 0") {
        console.log(key)
      }
      else if (!isNaN(filteredData2[0][key])) {
        headerRow.append("th").text(key);
      }
    });
  
    // Create table body
    const tbody = table.append("tbody");
    filteredData2.forEach((d) => {
      const row = tbody.append("tr");
      Object.values(d).forEach((value) => {
        if (value === ""){
        }
        else if (!isNaN(value)) {
          row.append("td").text(value); 
        }
      });
    });

}

function toggleData() {
  d3.csv("./challenge3/genres_v2.csv").then(function (data) {
    svg.selectAll("g").remove();
    let filteredData = data
      .filter((d) => d.genre === genre)
      .sort((a, b) => b[sortOption] - a[sortOption])
      .slice(0, 40);


    console.log(filteredData);
    const x = d3.scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(filteredData.map(d => (d.song_name)));

    const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])
      .domain([0, 2]);

    const ybis = d3.scaleRadial()
      .range([innerRadius, 5])
      .domain([0, 1]);

    // Add the bars
    svg.append("g")
      .selectAll("path")
      .data(filteredData)
      .join("path")
      .attr("fill", "#c4f8a2")
      .attr("class", "yo")
      .attr("d", d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(d => y(d['danceability']))
        .startAngle(d => x(d.song_name))
        .endAngle(d => x(d.song_name) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

    // Add the labels
    svg.append("g")
      .selectAll("g")
      .data(filteredData)
      .join("g")
      .attr("text-anchor", function (d) { return (x(d.song_name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function (d) { return "rotate(" + ((x(d.song_name) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d['danceability']) + 10) + ",0)"; })
      .append("text")
      .text(d => d.song_name)
      .on("click", function (event, d) {
        console.log(d.id)
        songSelection = d.id;
        songTable(data);
        iframe.src = `https://open.spotify.com/embed/track/${d.id}?utm_source=generator`;
      })
      .attr("transform", function (d) { return (x(d.song_name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "14px")
      .style("fill", "#d346f3")
      .attr("alignment-baseline", "middle")

    svg.append("g")
      .selectAll("path")
      .data(filteredData)
      .join("path")
      .attr("fill", "#ff69b4")
      .attr("class", "innerYo")
      .attr("d", d3.arc()
        .innerRadius(d => ybis(0))
        .outerRadius(d => ybis(d['energy']))
        .startAngle(d => x(d.song_name))
        .endAngle(d => x(d.song_name) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius))

  });
}
toggleData();
