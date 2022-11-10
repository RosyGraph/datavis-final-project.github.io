setup();

function setup() {
  d3.select("#bar-chart")
    .append("svg")
    .attr("id", "barchart-svg")
    .attr("height", 400)
    .attr("width", 600);

  d3.select("#barchart-svg")
    .append("g")
    .attr("id", "bar-chart")
    .attr("class", "bar-chart");
  d3.csv("./data/video_games_dataset.csv").then((data) =>
    displayYear(data, 1984)
  );
}

function loadData() {
  d3.csv("./data/video_games_dataset.csv").then((data) => {
    console.log(data);
  });
}
