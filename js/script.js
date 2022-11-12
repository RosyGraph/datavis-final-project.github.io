let mainData;
loadData();

function loadData() {
  d3.csv("./data/video_games_dataset.csv").then((data) => {
    mainData = data;
    setup();
  });
}

function setup() {
  document.querySelector('#sort_by_selection').addEventListener('change', changeSort);

  d3.select("#bar-chart")
    .append("svg")
    .attr("id", "barchart-svg")
    .classed("barchart", true)
    .attr("height", 400)
    .attr("width", 600);

  d3.select("#barchart-svg")
    .append("g")
    .attr("id", "bar-chart")
    .attr("class", "bar-chart");

  displayYear(mainData, 1984)
}

function changeSort() {
  displayYear(mainData, 1984);
}