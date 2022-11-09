setup();

function setup() {
  d3.select("#barChart").append("svg").attr("id", "Barchart-svg");

  d3.select("#Barchart-svg").append("g").attr("id", "Barchart-y-axis");
  d3.select("#Barchart-svg").append("g").attr("id", "Barchart-x-axis");
  d3.select("#Barchart-svg")
    .append("g")
    .attr("id", "BarChart")
    .attr("class", "bar-chart");

  loadData();
}

function loadData() {
  d3.csv("./data/video_games_dataset.csv").then((data) => {
    console.log(data);
  });
}
